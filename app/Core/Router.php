<?php

namespace App\Core;

use Exception;

class Router
{
    private static $routes = [];

    // Métodos HTTP suportados
    public static function get(string $uri, array $handler)
    {
        self::addRoute('GET', $uri, $handler);
    }

    public static function post(string $uri, array $handler)
    {
        self::addRoute('POST', $uri, $handler);
    }

    public static function put(string $uri, array $handler)
    {
        self::addRoute('PUT', $uri, $handler);
    }

    public static function delete(string $uri, array $handler)
    {
        self::addRoute('DELETE', $uri, $handler);
    }

    // Método central de registro de rotas
    private static function addRoute(string $method, string $uri, array $handler)
    {
        $pattern = preg_replace('/\{([a-zA-Z0-9_-]+)\}/', '([a-zA-Z0-9_-]+)', $uri);
        $pattern = '#^' . $pattern . '$#';

        self::$routes[] = [
            'method' => $method,
            'pattern' => $pattern,
            'handler' => $handler
        ];
    }

    // Despacha as rotas
    public static function dispatch()
    {
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $requestMethod = $_SERVER['REQUEST_METHOD'];

        // Suporte para method override via POST (_method)
        if ($requestMethod === 'POST' && isset($_POST['_method'])) {
            $override = strtoupper($_POST['_method']);
            if (in_array($override, ['PUT', 'DELETE', 'PATCH'])) {
                $requestMethod = $override;
            }
        }

        // Ajusta o base path para ambientes com subdiretório
        $basePath = '/gestao-corporativa/public';
        if (strpos($requestUri, $basePath) === 0) {
            $requestUri = substr($requestUri, strlen($basePath));
        }

        // Garante que URI vazia seja tratada como raiz
        if (empty($requestUri)) {
            $requestUri = '/';
        }

        // Remove barra final para consistência
        if ($requestUri !== '/' && substr($requestUri, -1) === '/') {
            $requestUri = rtrim($requestUri, '/');
        }

        foreach (self::$routes as $route) {
            if ($route['method'] === $requestMethod && preg_match($route['pattern'], $requestUri, $matches)) {
                array_shift($matches); // Remove o match completo, mantém apenas os grupos
                
                $handler = $route['handler'];
                $controllerClass = $handler[0];
                $controllerMethod = $handler[1];

                // Adiciona namespace padrão se não estiver especificado
                if (!class_exists($controllerClass)) {
                    $controllerClass = 'App\\Controllers\\' . $controllerClass;
                }

                if (!class_exists($controllerClass)) {
                    throw new Exception("Controller '{$controllerClass}' não encontrado.");
                }

                $controller = new $controllerClass();

                if (!method_exists($controller, $controllerMethod)) {
                    throw new Exception("Método '{$controllerMethod}' não encontrado em '{$controllerClass}'.");
                }

                // Chama o método do controller com os parâmetros da rota
                call_user_func_array([$controller, $controllerMethod], $matches);
                return;
            }
        }

        // Rota não encontrada - 404
        self::handleNotFound($requestUri, $requestMethod);
    }

    // Manipula rotas não encontradas
    private static function handleNotFound(string $uri, string $method)
    {
        http_response_code(404);
        
        // Se for uma requisição API, retorna JSON
        if (strpos($uri, '/api/') === 0) {
            header('Content-Type: application/json');
            echo json_encode([
                'error' => true,
                'message' => "Rota não encontrada: {$method} {$uri}",
                'code' => 404
            ]);
            return;
        }

        // Caso contrário, lança exceção (para tratamento pelo framework)
        throw new Exception("Erro 404: Rota não encontrada para '{$method} {$uri}'");
    }

    // Método útil para debug: lista todas as rotas registradas
    public static function getRoutes(): array
    {
        return self::$routes;
    }

    // Método para verificar se uma rota existe (útil para testes)
    public static function hasRoute(string $method, string $uri): bool
    {
        foreach (self::$routes as $route) {
            if ($route['method'] === $method && preg_match($route['pattern'], $uri)) {
                return true;
            }
        }
        return false;
    }
}