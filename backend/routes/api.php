<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoleUserController;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\RolPermisoController;


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

    Route::post('/login', [AuthController::class, 'authenticate'])
        ->name('login');



Route::middleware(['auth:sanctum'])->group(function () {

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});



Route::get('/users', [UserController::class, 'index']);         
Route::post('/users', [UserController::class, 'store']);       
Route::get('/users/{id}', [UserController::class, 'show']);    
Route::put('/users/{id}', [UserController::class, 'update']);   
Route::delete('/users/{id}', [UserController::class, 'destroy']); 

Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);
Route::get('/roles/{id}', [RoleController::class, 'show']);
Route::put('/roles/{id}', [RoleController::class, 'update']);
Route::delete('/roles/{id}', [RoleController::class, 'destroy']);




Route::get('role-user', [RoleUserController::class, 'index']);
Route::post('role-user', [RoleUserController::class, 'store']);
Route::get('role-user/{user_id}/{role_id}', [RoleUserController::class, 'show']);
Route::put('role-user/{user_id}/{role_id}', [RoleUserController::class, 'update']);
Route::delete('role-user/{user_id}/{role_id}', [RoleUserController::class, 'destroy']);


Route::get('/permisos', [PermisoController::class, 'index']); // Obtener todos los permisos
Route::get('/permisosdisponibles', [PermisoController::class, 'permisosdisponibles']); // Obtener todos los permisos con estado 1
Route::get('/rolesdisponibles', [RoleController::class, 'rolesdisponibles']); // Obtener todos los permisos con estado 1


Route::post('/permisoscrear', [PermisoController::class, 'store']); // Crear un nuevo permiso

Route::get('/permisos/{id}', [PermisoController::class, 'show']); // Obtener un permiso por ID
Route::put('/permisos/{id}', [PermisoController::class, 'update']); // Actualizar un permiso por ID
Route::delete('/permisos/{id}', [PermisoController::class, 'destroy']); // Eliminar un permiso por ID
Route::get('/permisos/activos', [PermisoController::class, 'activos']); // Obtener permisos activos

Route::get('/rol-permiso', [RolPermisoController::class, 'index']); // Obtener todas las asignaciones
Route::post('/rol-permiso', [RolPermisoController::class, 'store']); // Crear una nueva asignación
Route::get('/rol-permiso/{idRol}/{idPermiso}', [RolPermisoController::class, 'show']); // Obtener una asignación específica
Route::put('/rol-permiso/{idRol}/{idPermiso}', [RolPermisoController::class, 'update']); // Actualizar una asignación
Route::delete('/rol-permiso/{idRol}/{idPermiso}', [RolPermisoController::class, 'destroy']); // Eliminar una asignación

Route::post('/roles/guardar-permisos', [RolPermisoController::class, 'guardarPermisos']);

Route::post('/roles/guardar-roles', [RoleUserController::class, 'guardarRoles']);



});