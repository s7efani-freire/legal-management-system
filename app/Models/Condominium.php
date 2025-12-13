<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class Condominium {
  public static function listAll(): array {
    $pdo = Database::pdo();
    return $pdo->query("SELECT id, corporate_name, trade_name, condo_type FROM condominiums ORDER BY id DESC")->fetchAll();
  }

  public static function findById(int $id): ?array {
    $pdo = Database::pdo();
    $stmt = $pdo->prepare("SELECT * FROM condominiums WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    return $row ?: null;
  }

  public static function create(array $data): int {
    $pdo = Database::pdo();
    $sql = "INSERT INTO condominiums
      (corporate_name, trade_name, email, cnpj, phone, phone_type, zip_code, street, number, state, city, address_complement, condo_type, created_by)
      VALUES
      (:corporate_name, :trade_name, :email, :cnpj, :phone, :phone_type, :zip_code, :street, :number, :state, :city, :address_complement, :condo_type, :created_by)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($data);
    return (int)$pdo->lastInsertId();
  }

   public static function list(array $filters = []): array
    {
        $pdo = Database::pdo();

        $sql = "SELECT
                    id,
                    corporate_name,
                    trade_name,
                    cnpj,
                    email,
                    phone,
                    zip_code,
                    street,
                    number,
                    city,
                    state,
                    created_at,
                    condo_type
                FROM condominiums
                WHERE 1=1";

        $params = [];

        if (!empty($filters['name'])) {
            $sql .= " AND (trade_name LIKE :name OR corporate_name LIKE :name)";
            $params[':name'] = '%' . $filters['name'] . '%';
        }

        if (!empty($filters['cnpj'])) {
            // filtra ignorando pontuação, se quiser (simplesmente faz LIKE no que vier)
            $sql .= " AND cnpj LIKE :cnpj";
            $params[':cnpj'] = '%' . $filters['cnpj'] . '%';
        }

        if (!empty($filters['city'])) {
            $sql .= " AND city LIKE :city";
            $params[':city'] = '%' . $filters['city'] . '%';
        }

        $sql .= " ORDER BY id DESC";

        $stmt = $pdo->prepare($sql);
        foreach ($params as $k => $v) $stmt->bindValue($k, $v);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}
