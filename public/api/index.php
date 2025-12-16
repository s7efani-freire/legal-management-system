<?php
declare(strict_types=1);

require __DIR__ . '/../../vendor/autoload.php';

use App\Core\Request;
use App\Core\Router;
use App\Controllers\CondominiumController;
use App\Controllers\UnitController;
use App\Controllers\ResidentController;
// use App\Controllers\AuthController;


$router = new Router();
$req = new Request();

// Condominiums
$router->get('/api/condominiums', [CondominiumController::class, 'index']);
$router->post('/api/condominiums', [CondominiumController::class, 'store']);

// Unit autocomplete options
$router->get('/api/units/options', [UnitController::class, 'options']);

// Residents
$router->get('/api/residents', [ResidentController::class, 'index']);
$router->post('/api/residents', [ResidentController::class, 'store']);

// $router->post('/api/auth/register', [AuthController::class, 'register']);
// $router->post('/api/auth/login',    [AuthController::class, 'login']);
// $router->post('/api/auth/logout',   [AuthController::class, 'logout']);
// $router->get('/api/auth/me',        [AuthController::class, 'me']);





$router->dispatch($req);
