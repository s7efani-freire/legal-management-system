<?php
declare(strict_types=1);

require __DIR__ . '/../../vendor/autoload.php';

use App\Core\Request;
use App\Core\Router;
use App\Controllers\CondominiumController;
use App\Controllers\UnitController;
use App\Controllers\ResidentController;

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




$router->dispatch($req);
