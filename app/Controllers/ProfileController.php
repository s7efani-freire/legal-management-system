<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\UserModel;

final class ProfileController
{
    private UserModel $users;

    public function __construct()
    {
        $this->users = new UserModel();
    }

    public function me(Request $req, Response $res): void
    {
        $userId = (int)($_SESSION['user_id'] ?? 0);
        $user = $userId ? $this->users->findById($userId) : null;

        if (!$user) {
            Response::json(['ok' => false, 'message' => 'Não autenticado'], 401);
            return;
        }

        Response::json(['ok' => true, 'data' => ['user' => $user]], 200);
    }

    public function updateProfile(Request $req, Response $res): void
    {
        $userId = (int)($_SESSION['user_id'] ?? 0);
        $body = $req->json();

        $first = trim((string)($body['first_name'] ?? ''));
        $last  = trim((string)($body['last_name'] ?? ''));
        $email = strtolower(trim((string)($body['email'] ?? '')));

        $errors = [];
        if ($first === '') $errors['first_name'] = 'Nome é obrigatório';
        if ($last === '')  $errors['last_name']  = 'Sobrenome é obrigatório';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Email inválido';

        if ($errors) {
            Response::json(['ok' => false, 'message' => 'Dados inválidos', 'errors' => $errors], 422);
            return;
        }

        if ($this->users->emailExistsForOtherUser($email, $userId)) {
            Response::json(['ok' => false, 'message' => 'Email já está em uso'], 409);
            return;
        }

        $this->users->updateProfile($userId, $first, $last, $email);

        $user = $this->users->findById($userId);
        Response::json(['ok' => true, 'message' => 'Perfil atualizado', 'data' => ['user' => $user]], 200);
    }

    public function changePassword(Request $req, Response $res): void
    {
        $userId = (int)($_SESSION['user_id'] ?? 0);
        $body = $req->json();

        $current = (string)($body['current_password'] ?? '');
        $new     = (string)($body['new_password'] ?? '');

        if ($current === '' || $new === '') {
            Response::json(['ok' => false, 'message' => 'Informe a senha atual e a nova senha'], 422);
            return;
        }

        if (strlen($new) < 8) {
            Response::json(['ok' => false, 'message' => 'Nova senha deve ter no mínimo 8 caracteres'], 422);
            return;
        }

        $user = $this->users->findAuthById($userId);
        if (!$user || !password_verify($current, (string)$user['password_hash'])) {
            Response::json(['ok' => false, 'message' => 'Senha atual incorreta'], 401);
            return;
        }

        $this->users->updatePasswordHash($userId, password_hash($new, PASSWORD_DEFAULT));
        Response::json(['ok' => true, 'message' => 'Senha alterada com sucesso'], 200);
    }

public function testUpload(Request $req, Response $res): void
{
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
    
    error_log('=== TEST UPLOAD ENDPOINT ===');
    error_log('Headers: ' . print_r(getallheaders(), true));
    error_log('Files: ' . print_r($_FILES, true));
    error_log('Post: ' . print_r($_POST, true));
    error_log('Session: ' . print_r($_SESSION, true));
    
$testDir = __DIR__ . '/../../public/uploads/profile';
$writable = is_writable($testDir);
if (!$writable) {
    if (!is_dir($testDir)) {

        $created = mkdir($testDir, 0775, true);
        $writable = $created && is_writable($testDir);
    } else {

        $writable = false;
    }
}
    $limits = [
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'post_max_size' => ini_get('post_max_size'),
        'max_file_uploads' => ini_get('max_file_uploads'),
        'memory_limit' => ini_get('memory_limit')
    ];
    
    Response::json([
        'ok' => true,
        'message' => 'Test endpoint working',
        'debug' => [
            'request_method' => $_SERVER['REQUEST_METHOD'],
            'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'none',
            'content_length' => $_SERVER['CONTENT_LENGTH'] ?? 0,
            'files_received' => array_keys($_FILES),
            'session_active' => isset($_SESSION['user_id']),
            'user_id' => $_SESSION['user_id'] ?? 0,
            'directory_writable' => $writable,
            'php_limits' => $limits,
            'all_headers' => getallheaders()
        ]
    ], 200);
}
}
