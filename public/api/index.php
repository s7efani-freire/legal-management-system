<?php
declare(strict_types=1);

session_start();

require __DIR__ . '/../../vendor/autoload.php';

use App\Core\Request;
use App\Core\Router;

use App\Controllers\CondominiumController;
use App\Controllers\UnitController;
use App\Controllers\ResidentController;
use App\Controllers\AuthController;

use App\Middleware\AuthMiddleware;

$router = new Router();
$req = new Request();

$auth = new AuthMiddleware();

// Rotas públicas (auth)
$router->post('/api/auth/register', [AuthController::class, 'register']);
$router->post('/api/auth/login',    [AuthController::class, 'login']);
$router->post('/api/auth/logout',   [AuthController::class, 'logout'], [$auth]);
$router->get('/api/auth/me',        [AuthController::class, 'me'],     [$auth]);

// Rotas protegidas
$router->get('/api/condominiums',  [CondominiumController::class, 'index'], [$auth]);
$router->post('/api/condominiums', [CondominiumController::class, 'store'], [$auth]);

$router->get('/api/units/options', [UnitController::class, 'options'], [$auth]);

$router->get('/api/residents',  [ResidentController::class, 'index'], [$auth]);
$router->post('/api/residents', [ResidentController::class, 'store'], [$auth]);


$router->dispatch($req);
