<?php
declare(strict_types=1);

namespace App\Middlewares;

class CorsMiddleware
{
    public function handle(): void
    {
                $allowedOrigin = 'http://localhost:5173';
        
                $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
                $origin = $requestOrigin && $requestOrigin === $allowedOrigin 
            ? $requestOrigin 
            : $allowedOrigin;
        
                header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
        header('Access-Control-Expose-Headers: Content-Length, Content-Range');
        header('Access-Control-Max-Age: 86400');         
                if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}