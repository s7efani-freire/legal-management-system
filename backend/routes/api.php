<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CondominiumController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PermissionController;

// Auth pública
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    Route::get('/condominiums',  [CondominiumController::class, 'index']);
    Route::post('/condominiums', [CondominiumController::class, 'store']);
    Route::delete('/condominiums/{id}', [CondominiumController::class, 'destroy']);

    Route::get('/residents',  [ResidentController::class, 'index']);
    Route::post('/residents', [ResidentController::class, 'store']);
    Route::delete('/residents/{id}', [ResidentController::class, 'destroy']);

    Route::get('/users',                    [UserController::class, 'index']);
    Route::post('/users/deactivate',        [UserController::class, 'deactivate']);
    Route::post('/users/permissions/set',   [UserController::class, 'setPermissions']);

    Route::get('/permissions', [PermissionController::class, 'index']);

    Route::get('/profile/me',        [ProfileController::class, 'me']);
    Route::put('/profile',           [ProfileController::class, 'update']);
    Route::put('/profile/password',  [ProfileController::class, 'updatePassword']);
    Route::post('/profile/photo',    [ProfileController::class, 'uploadPhoto']);
});