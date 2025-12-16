<?php
declare(strict_types=1);

namespace App\Core;

final class Router
{
    /**
     * @var array<string, array{handler: callable, middleware: array<int, callable>}>
     */
    private array $routes = [];

    /**
     * Aceita $handler como callable OU como [Classe::class, 'metodo']
     * e converte para callable antes de armazenar.
     */
    public function get(string $path, mixed $handler, array $middleware = []): void
    {
        $this->add('GET', $path, $handler, $middleware);
    }

    public function post(string $path, mixed $handler, array $middleware = []): void
    {
        $this->add('POST', $path, $handler, $middleware);
    }

    public function put(string $path, mixed $handler, array $middleware = []): void
    {
        $this->add('PUT', $path, $handler, $middleware);
    }

    public function delete(string $path, mixed $handler, array $middleware = []): void
    {
        $this->add('DELETE', $path, $handler, $middleware);
    }

    public function add(string $method, string $path, mixed $handler, array $middleware = []): void
    {
        $method = strtoupper($method);

        // 1) Resolve handler no formato [Controller::class, 'method'] para [new Controller(), 'method']
        $handler = $this->resolveHandler($handler, $method, $path);

        // 2) Resolve/valida middlewares (permite também [Middleware::class, '__invoke'] / instância / closure)
        $middleware = array_map(
            fn ($mw) => $this->resolveMiddleware($mw, $method, $path),
            $middleware
        );

        $key = $method . ' ' . $path;
        $this->routes[$key] = [
            'handler'    => $handler,
            'middleware' => $middleware,
        ];
    }

    public function dispatch(Request $req): void
    {
        // Preflight deve encerrar a requisição.
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
        $handler = $route['handler'];
        $middlewareStack = $route['middleware'];

        $res = new Response();

        /**
         * Pipeline:
         * - Middlewares: function(Request $req, Response $res, callable $next): void
         * - Handler final: function(Request $req, Response $res): void
         */
        $pipeline = array_reduce(
            array_reverse($middlewareStack),
            function (callable $next, callable $mw) use ($req, $res): callable {
                return function () use ($mw, $req, $res, $next): void {
                    $mw($req, $res, $next);
                };
            },
            function () use ($handler, $req, $res): void {
                $handler($req, $res);
            }
        );

        $pipeline();
    }

    private function resolveHandler(mixed $handler, string $method, string $path): callable
    {
        // Caso [Classe::class, 'metodo']
        if (is_array($handler) && isset($handler[0], $handler[1]) && is_string($handler[0])) {
            $class = $handler[0];
            $methodName = $handler[1];

            if (!class_exists($class)) {
                throw new \RuntimeException("Handler class not found: {$class} for {$method} {$path}");
            }

            $handler = [new $class(), $methodName];
        }

        if (!is_callable($handler)) {
            $type = gettype($handler);
            throw new \TypeError("Handler for {$method} {$path} is not callable. Given: {$type}");
        }

        return $handler;
    }

    private function resolveMiddleware(mixed $mw, string $method, string $path): callable
    {
        // Permite passar instância (ex: new AuthMiddleware())
        // ou classe-string (ex: AuthMiddleware::class) — nesse caso, instancia
        if (is_string($mw)) {
            if (!class_exists($mw)) {
                throw new \RuntimeException("Middleware class not found: {$mw} for {$method} {$path}");
            }
            $mw = new $mw();
        }

        // Permite [Classe::class, 'metodo'] também para middleware
        if (is_array($mw) && isset($mw[0], $mw[1]) && is_string($mw[0])) {
            $class = $mw[0];
            $methodName = $mw[1];

            if (!class_exists($class)) {
                throw new \RuntimeException("Middleware class not found: {$class} for {$method} {$path}");
            }
            $mw = [new $class(), $methodName];
        }

        if (!is_callable($mw)) {
            $type = gettype($mw);
            throw new \TypeError("Middleware for {$method} {$path} is not callable. Given: {$type}");
        }

        return $mw;
    }
}
