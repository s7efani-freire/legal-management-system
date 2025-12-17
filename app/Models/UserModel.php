<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class UserModel
{
    private Database $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->pdo()->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function findByCpf(string $cpf): ?array
    {
        $stmt = $this->db->pdo()->prepare('SELECT * FROM users WHERE cpf = :cpf LIMIT 1');
        $stmt->execute(['cpf' => $cpf]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->pdo()->prepare(
            'SELECT id, first_name, last_name, cpf, email, user_type
             FROM users WHERE id = :id LIMIT 1'
        );
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function create(array $data): int
    {
        $sql = 'INSERT INTO users (first_name, last_name, cpf, email, user_type, password_hash)
                VALUES (:first_name, :last_name, :cpf, :email, :user_type, :password_hash)';

        $stmt = $this->db->pdo()->prepare($sql);
        $stmt->execute([
            'first_name'    => $data['first_name'],
            'last_name'     => $data['last_name'],
            'cpf'           => $data['cpf'],
            'email'         => $data['email'],
            'user_type'     => $data['user_type'],
            'password_hash' => $data['password_hash'],
        ]);

        return (int) $this->db->pdo()->lastInsertId();
    }
}
