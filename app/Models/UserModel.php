<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

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
            'SELECT id, first_name, last_name, cpf, email, user_type, profile_photo_path
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
}
