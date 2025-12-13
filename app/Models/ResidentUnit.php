<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

final class ResidentUnit {
  public static function unitHasActiveResident(int $unitId): bool {
    $pdo = Database::pdo();
    $stmt = $pdo->prepare(
      "SELECT 1 FROM resident_units
       WHERE unit_id = :uid AND end_date IS NULL
       LIMIT 1"
    );
    $stmt->execute(['uid' => $unitId]);
    return (bool)$stmt->fetchColumn();
  }

  public static function link(int $residentId, int $unitId): void {
    $pdo = Database::pdo();
    $stmt = $pdo->prepare(
      "INSERT INTO resident_units (resident_id, unit_id, start_date, end_date)
       VALUES (:rid, :uid, NOW(), NULL)"
    );
    $stmt->execute(['rid' => $residentId, 'uid' => $unitId]);
  }
}
