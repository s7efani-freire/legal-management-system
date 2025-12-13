<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\ResidentialUnit;

final class UnitService {
  public static function makeUniqueCode(string $condoType, array $u): string {
    $block  = Normalize::text($u['block'] ?? null);
    $tower  = Normalize::text($u['tower'] ?? null);
    $floor  = Normalize::text($u['floor'] ?? null);
    $street = Normalize::text($u['street'] ?? null);
    $num    = Normalize::text($u['unit_number'] ?? null);

    switch ($condoType) {
      case 'APTO_BLOCO':
        return "BLOCK {$block} - FLOOR {$floor} - APT {$num}";
      case 'APTO_SIMPLES':
        return "FLOOR {$floor} - APT {$num}";
      case 'CASAS_RUA':
        return "STREET {$street} - HOUSE {$num}";
      case 'CASAS_SIMPLES':
        return "HOUSE {$num}";
      default:
        $parts = [];
        if ($tower)  $parts[] = "TOWER {$tower}";
        if ($block)  $parts[] = "BLOCK {$block}";
        if ($floor)  $parts[] = "FLOOR {$floor}";
        if ($street) $parts[] = "STREET {$street}";
        if ($num)    $parts[] = "NO {$num}";
        return implode(' - ', $parts);
    }
  }

  public static function getOrCreate(int $condoId, string $condoType, array $u, int $createdBy): int {
    $uniqueCode = self::makeUniqueCode($condoType, $u);

    $existing = ResidentialUnit::findByUniqueCode($condoId, $uniqueCode);
    if ($existing) return (int)$existing['id'];

    return ResidentialUnit::create([
      'condominium_id' => $condoId,
      'block' => Normalize::text($u['block'] ?? null),
      'tower' => Normalize::text($u['tower'] ?? null),
      'floor' => Normalize::text($u['floor'] ?? null),
      'street' => Normalize::text($u['street'] ?? null),
      'number' => is_numeric($u['unit_number'] ?? null) ? (int)$u['unit_number'] : null,
      'unique_code' => $uniqueCode,
      'created_by' => $createdBy,
    ]);
  }
}
