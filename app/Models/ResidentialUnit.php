<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

final class ResidentialUnit {
  public static function findByUniqueCode(int $condoId, string $uniqueCode): ?array {
    $pdo = Database::pdo();
    $stmt = $pdo->prepare(
      "SELECT * FROM residential_units
       WHERE condominium_id = :cid AND unique_code = :uc
       LIMIT 1"
    );
    $stmt->execute(['cid' => $condoId, 'uc' => $uniqueCode]);
    $row = $stmt->fetch();
    return $row ?: null;
  }

  public static function create(array $data): int {
    $pdo = Database::pdo();
    $sql = "INSERT INTO residential_units
      (condominium_id, block, floor, number, street, tower, unique_code, created_by)
      VALUES
      (:condominium_id, :block, :floor, :number, :street, :tower, :unique_code, :created_by)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($data);
    return (int)$pdo->lastInsertId();
  }

  public static function options(int $condoId): array {
    $pdo = Database::pdo();

    $queries = [
      'block'  => "SELECT DISTINCT block AS v FROM residential_units WHERE condominium_id = :cid AND block IS NOT NULL AND block <> '' ORDER BY block",
      'floor'  => "SELECT DISTINCT floor AS v FROM residential_units WHERE condominium_id = :cid AND floor IS NOT NULL AND floor <> '' ORDER BY floor",
      'street' => "SELECT DISTINCT street AS v FROM residential_units WHERE condominium_id = :cid AND street IS NOT NULL AND street <> '' ORDER BY street",
      'tower'  => "SELECT DISTINCT tower AS v FROM residential_units WHERE condominium_id = :cid AND tower IS NOT NULL AND tower <> '' ORDER BY tower",
      'number' => "SELECT DISTINCT number AS v FROM residential_units WHERE condominium_id = :cid AND number IS NOT NULL ORDER BY number",
    ];

    $out = [];
    foreach ($queries as $key => $sql) {
      $stmt = $pdo->prepare($sql);
      $stmt->execute(['cid' => $condoId]);
      $rows = $stmt->fetchAll();
      $out[$key] = array_map(fn($r) => (string)$r['v'], $rows);
    }
    return $out;
  }
}
