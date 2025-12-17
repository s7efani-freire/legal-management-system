<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;
use Throwable;

final class UserModel
{
    public function findByEmail(string $email): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function findByCpf(string $cpf): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM users WHERE cpf = :cpf LIMIT 1');
        $stmt->execute(['cpf' => $cpf]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT id, first_name, last_name, cpf, email, user_type, profile_photo_path, created_at, updated_at, is_active
             FROM users WHERE id = :id LIMIT 1'
        );
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function findAuthById(int $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function create(array $data): int
    {
        $sql = 'INSERT INTO users (first_name, last_name, cpf, email, user_type, password_hash, profile_photo_path)
                VALUES (:first_name, :last_name, :cpf, :email, :user_type, :password_hash, :profile_photo_path)';

        $stmt = Database::pdo()->prepare($sql);
        $stmt->execute([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'cpf' => $data['cpf'],
            'email' => $data['email'],
            'user_type' => $data['user_type'],
            'password_hash' => $data['password_hash'],
            'profile_photo_path' => $data['profile_photo_path'] ?? null,
        ]);

        return (int) Database::pdo()->lastInsertId();
    }

    public function emailExistsForOtherUser(string $email, int $currentId): bool
    {
        $stmt = Database::pdo()->prepare(
            'SELECT id FROM users WHERE email = :email AND id <> :id LIMIT 1'
        );
        $stmt->execute(['email' => $email, 'id' => $currentId]);

        return (bool) $stmt->fetchColumn();
    }

    public function updateProfile(int $id, string $firstName, string $lastName, string $email): void
    {
        $stmt = Database::pdo()->prepare(
            'UPDATE users
             SET first_name = :first_name,
                 last_name  = :last_name,
                 email      = :email
             WHERE id = :id'
        );

        $stmt->execute([
            'id' => $id,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
        ]);
    }

    public function updatePasswordHash(int $id, string $passwordHash): void
    {
        $stmt = Database::pdo()->prepare(
            'UPDATE users SET password_hash = :password_hash WHERE id = :id'
        );

        $stmt->execute([
            'id' => $id,
            'password_hash' => $passwordHash,
        ]);
    }

    public function updateProfilePhotoPath(int $id, ?string $path): void
    {
        $stmt = Database::pdo()->prepare(
            'UPDATE users SET profile_photo_path = :path WHERE id = :id'
        );

        $stmt->execute([
            'id' => $id,
            'path' => $path,
        ]);
    }

    /* =========================
       PERMISSIONS
       ========================= */

    public function getPermissionsByUserId(int $userId): array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT p.name
             FROM user_permissions up
             JOIN permissions p ON p.id = up.permission_id
             WHERE up.user_id = :user_id
             ORDER BY p.name'
        );
        $stmt->execute(['user_id' => $userId]);

        return $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];
    }

    public function setPermissionsByNames(int $userId, array $permissionNames): void
    {
        $pdo = Database::pdo();
        $pdo->beginTransaction();

        try {
            // remove todas as permissões atuais
            $del = $pdo->prepare('DELETE FROM user_permissions WHERE user_id = :user_id');
            $del->execute(['user_id' => $userId]);

            $permissionNames = array_values(array_unique(array_filter(array_map('strval', $permissionNames))));
            if (count($permissionNames) === 0) {
                $pdo->commit();
                return;
            }

            // busca IDs das permissions por name
            $in = implode(',', array_fill(0, count($permissionNames), '?'));
            $stmt = $pdo->prepare("SELECT id FROM permissions WHERE name IN ($in)");
            $stmt->execute($permissionNames);
            $permIds = $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];

            if (count($permIds) === 0) {
                $pdo->commit();
                return;
            }

            $ins = $pdo->prepare('INSERT INTO user_permissions (user_id, permission_id) VALUES (:user_id, :permission_id)');
            foreach ($permIds as $pid) {
                $ins->execute(['user_id' => $userId, 'permission_id' => (int)$pid]);
            }

            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public function listAllActive(): array
    {
        $stmt = Database::pdo()->query(
            'SELECT id, first_name, last_name, cpf, email, user_type, created_at, updated_at, is_active
             FROM users
             WHERE is_active = 1
             ORDER BY user_type, first_name, last_name'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function deactivateById(int $id): bool
    {
        $stmt = Database::pdo()->prepare('UPDATE users SET is_active = 0 WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
