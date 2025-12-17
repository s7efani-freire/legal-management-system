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
        if ($req->method === 'OPTIONS') {
            Response::json(['ok' => true], 200);
            return;
        }

        $key = $req->method . ' ' . $req->path;

        if (!isset($this->routes[$key])) {
            Response::json(['error' => 'NOT_FOUND', 'message' => 'Route not found'], 404);
            return;
        }

        $route = $this->routes[$key];
        $handler = $this->normalizeHandler($route['handler']);
        $middlewareStack = $route['middleware'];

        // Pipeline: middleware(Request $req, callable $next)
        $pipeline = array_reduce(
            array_reverse($middlewareStack),
            function (callable $next, callable $mw) use ($req): callable {
                return function () use ($mw, $req, $next): void {
                    $mw($req, $next);
                };
            },
            function () use ($handler, $req): void {
                call_user_func($handler, $req);
            }
        );

        $pipeline();
    }

    /**
     * Aceita:
     * - Closure/callable
     * - [Controller::class, 'method'] (instancia a classe)
     * - [new Controller(), 'method']
     *
     * @return callable
     */
    private function normalizeHandler($handler): callable
    {
        // Caso: [ClassName::class, 'method']
        if (is_array($handler) && isset($handler[0], $handler[1]) && is_string($handler[0])) {
            $class = $handler[0];
            $method = $handler[1];

            $obj = new $class();

            if (!is_callable([$obj, $method])) {
                throw new \RuntimeException("Handler inválido: {$class}::{$method}");
            }

            return [$obj, $method];
        }

        // Caso: callable direto (Closure, function, invokable object, etc)
        if (!is_callable($handler)) {
            throw new \RuntimeException("Handler inválido para rota.");
        }

        return $handler;
    }
}
