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
        // Preflight deve encerrar
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

        $middlewareStack = $route['middleware'];

        // Handler final: sempre chama (Request, Response)
        $finalHandler = function () use ($route, $req): void {
            $res = new Response();

            $callable = $this->normalizeHandler($route['handler']);

            // chama controller/handler com (Request, Response)
            call_user_func($callable, $req, $res);
        };

        // Pipeline: middleware(Request $req, callable $next): void
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

    /**
     * Normaliza handler para callable válido.
     *
     * Aceita:
     * - Closure/callable
     * - [Controller::class, 'method'] (instancia)
     * - [new Controller(), 'method']
     *
     * @return callable
     */
    private function normalizeHandler($handler): callable
    {
        // [ClassName::class, 'method']
        if (is_array($handler) && isset($handler[0], $handler[1]) && is_string($handler[0])) {
            $class = $handler[0];
            $method = $handler[1];

            $obj = new $class();

            if (!is_callable([$obj, $method])) {
                throw new \RuntimeException("Handler inválido: {$class}::{$method}");
            }

            return [$obj, $method];
        }

        // callable direto (Closure, invokable, etc)
        if (!is_callable($handler)) {
            throw new \RuntimeException("Handler inválido para rota.");
        }

        return $handler;
    }
}
