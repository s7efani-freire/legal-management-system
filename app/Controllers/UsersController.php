<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\UserModel;

final class UsersController
{
    private UserModel $users;

    public function __construct()
    {
        $this->users = new UserModel();
    }

    public function index(Request $req, Response $res): void
    {
        $rows = $this->users->listAllActive();

        $mapped = array_map(function (array $u) {
            $nome = trim(($u['first_name'] ?? '') . ' ' . ($u['last_name'] ?? ''));
            $perms = $this->users->getPermissionsByUserId((int)$u['id']);

            return [
                'id' => (int)$u['id'],
                'nome' => $nome,
                'email' => (string)$u['email'],
                'user_type' => (string)$u['user_type'],
                'cadastradoEm' => $u['created_at'] ?? null,
                'ultimaAtualizacao' => $u['updated_at'] ?? null,
                'role' => $this->roleLabelFor((string)$u['user_type']),
                'permissions' => $perms,
            ];
        }, $rows);

        $groups = [];
        foreach ($mapped as $u) {
            $type = $u['user_type'];
            if (!isset($groups[$type])) $groups[$type] = [];
            $groups[$type][] = $u;
        }

        $res->json(['ok' => true, 'groups' => $groups]);
    }

    public function destroy(Request $req, Response $res): void
    {
        $body = $req->json();
        $id = (int)($body['id'] ?? 0);

        if ($id <= 0) {
            $res->json(['message' => 'ID inválido'], 400);
            return;
        }

        $user = $this->users->findAuthById($id);
        if (!$user) {
            $res->json(['message' => 'Usuário não encontrado'], 404);
            return;
        }

        if (($user['user_type'] ?? '') === 'ADMIN') {
            $res->json(['message' => 'Não é permitido desativar usuários ADMIN'], 403);
            return;
        }

        $ok = $this->users->deactivateById($id);
        if (!$ok) {
            $res->json(['message' => 'Falha ao desativar usuário'], 500);
            return;
        }

        $res->json(['message' => 'Usuário desativado com sucesso']);
    }

    public function setPermissions(Request $req, Response $res): void
    {
        

        $authId = (int)($_SESSION['user_id'] ?? 0);
        if ($authId <= 0) {
            $res->json(['message' => 'Não autenticado'], 401);
            return;
        }

        $authPerms = $this->users->getPermissionsByUserId($authId);

        if (!in_array('usuarios.view', $authPerms, true)) {
            $res->json(['message' => 'Acesso negado'], 403);
            return;
        }


        $body = $req->json();
        $id = (int)($body['id'] ?? 0);
        $permissions = (array)($body['permissions'] ?? []);

        if ($id <= 0) {
            $res->json(['message' => 'ID inválido'], 400);
            return;
        }

        $target = $this->users->findAuthById($id);
        if (!$target) {
            $res->json(['message' => 'Usuário não encontrado'], 404);
            return;
        }







        $this->users->setPermissionsByNames($id, $permissions);

        $res->json(['ok' => true, 'message' => 'Permissões atualizadas com sucesso']);
    }

    private function roleLabelFor(string $type): string
    {
        return match ($type) {
            'ADMIN' => 'Administrador',
            'LAWYER' => 'Advogado',
            'ACCOUNTING' => 'Financeiro',
            'MANAGER' => 'Gestor',
            default => $type,
        };
    }
}
