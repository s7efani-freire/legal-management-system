<?php
declare(strict_types=1);

namespace App\Core;

final class Router
{
    /**
     * @var array<string, array{handler: mixed, middleware: array<int, callable>}>
     */
    private array $routes = [];

    public function get(string $path, $handler, array $middleware = []): void
    {
        $this->add('GET', $path, $handler, $middleware);
    }

    public function post(string $path, $handler, array $middleware = []): void
    {
        $this->add('POST', $path, $handler, $middleware);
    }

    public function put(string $path, $handler, array $middleware = []): void
    {
        $this->add('PUT', $path, $handler, $middleware);
    }

    public function delete(string $path, $handler, array $middleware = []): void
    {
        $this->add('DELETE', $path, $handler, $middleware);
    }

    public function add(string $method, string $path, $handler, array $middleware = []): void
    {
        $key = strtoupper($method) . ' ' . $path;

        $this->routes[$key] = [
            'handler'    => $handler,
            'middleware' => $middleware,
        ];
    }

    public function dispatch(Request $req): void
    {
        
        if (strtoupper($req->method) === 'OPTIONS') {
            Response::json(['ok' => true], 200);
            return;
        }

        $key = strtoupper($req->method) . ' ' . $req->path;

        if (!isset($this->routes[$key])) {
            Response::json(['error' => 'NOT_FOUND', 'message' => 'Route not found'], 404);
            return;
        }

        $route = $this->routes[$key];
        $middlewareStack = $route['middleware'];

        
        $finalHandler = function () use ($route, $req): void {
            $res = new Response();

            $callable = $this->normalizeHandler($route['handler']);

            
            call_user_func($callable, $req, $res);
        };

        
        $pipeline = array_reduce(
            array_reverse($middlewareStack),
            function (callable $next, callable $mw) use ($req): callable {
                return function () use ($mw, $req, $next): void {
                    $mw($req, $next);
                };
            },
            $finalHandler
        );

        $pipeline();
    }

private function normalizeHandler($handler): callable
{
    if (is_array($handler) && isset($handler[0], $handler[1]) && is_string($handler[0])) {
        $class = $handler[0];
        $method = $handler[1];

        try {
            if (!class_exists($class)) {
                throw new \RuntimeException("Classe não existe: {$class}");
            }
            
            $obj = new $class();
            
            if (!is_callable([$obj, $method])) {
                throw new \RuntimeException("Handler inválido: {$class}::{$method}");
            }

            return [$obj, $method];
        } catch (\Throwable $e) {
            error_log("Router error: " . $e->getMessage());
            throw new \RuntimeException("Handler inválido: " . $e->getMessage());
        }
    }

    if (!is_callable($handler)) {
        throw new \RuntimeException("Handler inválido para rota.");
    }

    return $handler;
}
}
