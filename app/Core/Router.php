<?php
declare(strict_types=1);

namespace App\Core;

final class Router {
  /** @var array<string, callable> */
  private array $routes = [];

  public function get(string $path, callable $handler): void { $this->add('GET', $path, $handler); }
  public function post(string $path, callable $handler): void { $this->add('POST', $path, $handler); }

  public function add(string $method, string $path, callable $handler): void {
    $key = strtoupper($method) . ' ' . $path;
    $this->routes[$key] = $handler;
  }

  public function dispatch(Request $req): void {
    if ($req->method === 'OPTIONS') {
      Response::json(['ok' => true], 200);
    }

    $key = $req->method . ' ' . $req->path;
    if (!isset($this->routes[$key])) {
      Response::json(['error' => 'NOT_FOUND', 'message' => 'Route not found'], 404);
    }

    ($this->routes[$key])($req);
  }
}
