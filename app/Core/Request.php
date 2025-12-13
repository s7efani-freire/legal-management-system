<?php
declare(strict_types=1);

namespace App\Core;

final class Request {
  public string $method;
  public string $path;
  public array $query;

  public function __construct() {
    $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    $this->path = parse_url($uri, PHP_URL_PATH) ?: '/';
    $this->query = $_GET ?? [];
  }

  public function json(): array {
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
  }

  public function queryInt(string $key, int $default = 0): int {
    $v = $this->query[$key] ?? null;
    if ($v === null) return $default;
    return (int)$v;
  }

  public function query(): array
{
    return $_GET ?? [];
}

}
