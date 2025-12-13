<?php
declare(strict_types=1);

namespace App\Services;

final class Normalize {
  public static function text(?string $value): ?string {
    if ($value === null) return null;
    $v = trim($value);
    if ($v === '') return null;

    $v = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $v);
    $v = strtoupper($v);
    $v = preg_replace('/\s+/', ' ', $v);

    if (preg_match('/^\d+$/', $v)) {
      $v = (string) intval($v, 10); // "02" -> "2"
    }
    return $v;
  }
}
