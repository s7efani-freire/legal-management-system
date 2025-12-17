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
use App\Controllers\ProfileController;
use App\Controllers\UsersController;
use App\Controllers\PermissionsController;

use App\Middleware\AuthMiddleware;

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$router = new Router();
$req = new Request();

$auth = new AuthMiddleware();

$router->post('/api/auth/register', [AuthController::class, 'register']);
$router->post('/api/auth/login',    [AuthController::class, 'login']);
$router->post('/api/auth/logout',   [AuthController::class, 'logout'], [$auth]);
$router->get('/api/auth/me',        [AuthController::class, 'me'],     [$auth]);

$router->get('/api/condominiums',  [CondominiumController::class, 'index'], [$auth]);
$router->post('/api/condominiums', [CondominiumController::class, 'store'], [$auth]);

$router->get('/api/units/options', [UnitController::class, 'options'], [$auth]);

$router->get('/api/residents',  [ResidentController::class, 'index'], [$auth]);
$router->post('/api/residents', [ResidentController::class, 'store'], [$auth]);

$router->get('/api/profile/me', [ProfileController::class, 'me'], [$auth]);
$router->post('/api/profile/photo', [ProfileController::class, 'uploadPhoto'], [$auth]);
$router->put('/api/profile', [ProfileController::class, 'updateProfile'], [$auth]);
$router->put('/api/profile/password', [ProfileController::class, 'changePassword'], [$auth]);

$router->post('/api/profile/test-upload', [ProfileController::class, 'testUpload']);

$router->get('/api/users', [UsersController::class, 'index'], [$auth]);
$router->post('/api/users/deactivate', [UsersController::class, 'destroy'], [$auth]);
$router->get('/api/permissions', [PermissionsController::class, 'index'], [$auth]);
$router->post('/api/users/permissions/set', [UsersController::class, 'setPermissions'], [$auth]);

$router->dispatch($req);
