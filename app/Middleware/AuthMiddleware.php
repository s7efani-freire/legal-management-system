<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Core\Request;
use App\Core\Response;

final class AuthMiddleware
{
    public function __invoke(Request $req, Response $res, callable $next): void
    {
        if (empty($_SESSION['user_id'])) {
            $res->json(['ok' => false, 'message' => 'Não autenticado'], 401);
            return;
        }

        $next();
    }
}
