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
      public static function name(string $value): string
    {
        $value = trim(mb_strtolower($value, 'UTF-8'));
        return mb_convert_case($value, MB_CASE_TITLE, 'UTF-8');
    }

    public static function email(string $value): string
    {
        return mb_strtolower(trim($value), 'UTF-8');
    }
}
