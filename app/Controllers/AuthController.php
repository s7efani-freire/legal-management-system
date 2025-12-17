<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\UserModel;
use App\Core\Database;

final class AuthController
{
    private UserModel $users;

    public function __construct()
    {
        
        $db = new Database();
        $this->users = new UserModel($db);
    }

    public function register(Request $req, Response $res): void
    {
        $body = $req->json(); 
        $first = trim((string)($body['first_name'] ?? ''));
        $last  = trim((string)($body['last_name'] ?? ''));
        $cpf   = preg_replace('/\D+/', '', (string)($body['cpf'] ?? ''));
        $email = strtolower(trim((string)($body['email'] ?? '')));
        $type  = strtoupper(trim((string)($body['user_type'] ?? '')));
        $pass  = (string)($body['password'] ?? '');

        $allowedTypes = ['ADMIN', 'MANAGER', 'LAWYER', 'RESIDENT', 'OTHER'];

        $errors = [];
        if ($first === '') $errors['first_name'] = 'Nome é obrigatório';
        if ($last === '')  $errors['last_name']  = 'Sobrenome é obrigatório';
        if (strlen($cpf) !== 11) $errors['cpf']   = 'CPF inválido';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Email inválido';
        if (!in_array($type, $allowedTypes, true)) $errors['user_type'] = 'Tipo de usuário inválido';
        if (strlen($pass) < 8) $errors['password'] = 'Senha deve ter no mínimo 8 caracteres';

        if ($errors) {
            $res->json(['ok' => false, 'message' => 'Dados inválidos', 'errors' => $errors], 422);
            return;
        }

        if ($this->users->findByEmail($email)) {
            $res->json(['ok' => false, 'message' => 'Email já cadastrado'], 409);
            return;
        }
        if ($this->users->findByCpf($cpf)) {
            $res->json(['ok' => false, 'message' => 'CPF já cadastrado'], 409);
            return;
        }

        $userId = $this->users->create([
            'first_name'    => $first,
            'last_name'     => $last,
            'cpf'           => $cpf,
            'email'         => $email,
            'user_type'     => $type,
            'password_hash' => password_hash($pass, PASSWORD_DEFAULT),
        ]);

        
        session_regenerate_id(true);
        $_SESSION['user_id'] = $userId;

        $user = $this->users->findById($userId);

        $res->json(['ok' => true, 'message' => 'Usuário cadastrado', 'data' => ['user' => $user]], 201);
    }

    public function login(Request $req, Response $res): void
    {
        $body  = $req->json();
        $email = strtolower(trim((string)($body['email'] ?? '')));
        $pass  = (string)($body['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $pass === '') {
            $res->json(['ok' => false, 'message' => 'Credenciais inválidas'], 422);
            return;
        }

        $user = $this->users->findByEmail($email);
        if (!$user || !password_verify($pass, (string)$user['password_hash'])) {
            $res->json(['ok' => false, 'message' => 'Email ou senha incorretos'], 401);
            return;
        }

        session_regenerate_id(true);
        $_SESSION['user_id'] = (int)$user['id'];

        $safeUser = [
            'id'         => (int)$user['id'],
            'first_name' => $user['first_name'],
            'last_name'  => $user['last_name'],
            'cpf'        => $user['cpf'],
            'email'      => $user['email'],
            'user_type'  => $user['user_type'],
        ];

        $res->json(['ok' => true, 'message' => 'Login realizado', 'data' => ['user' => $safeUser]]);
    }

    public function me(Request $req, Response $res): void
    {
        $id = (int)($_SESSION['user_id'] ?? 0);
        if ($id <= 0) {
            $res->json(['ok' => false, 'message' => 'Não autenticado'], 401);
            return;
        }

        $user = $this->users->findById($id);
        if (!$user) {
            $res->json(['ok' => false, 'message' => 'Usuário não encontrado'], 404);
            return;
        }

        $res->json(['ok' => true, 'data' => ['user' => $user]]);
    }

    public static function logout(Request $req): void
    {
        $_SESSION = [];
    
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
    
        session_destroy();
    
        Response::json(['ok' => true, 'message' => 'Logout realizado'], 200);
    }

}
