<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\UnidadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoleUserController;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\RolPermisoController;
use App\Http\Controllers\EspecialidadController;
use App\Http\Controllers\UnidadPersonaController;
use App\Http\Controllers\TramitesController;


use App\Http\Controllers\ResponsableController;
use App\Http\Controllers\RolPrueba;
use App\Http\Controllers\FileUploadController;
use App\Models\Tramite;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('guest')->group(function () {
    Route::post('/login', [AuthController::class, 'authenticate'])
        ->name('login');
});



Route::middleware(['auth:sanctum'])->group(function () {

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::apiResource('personas', PersonaController::class);
Route::apiResource('/unidades', UnidadController::class);

// Obtener las unidades de una persona
Route::get('/personas/{id}/unidades', [PersonaController::class, 'getUnidades']);

// Asociar una unidad a una persona
Route::post('/personas/{id}/unidades', [PersonaController::class, 'addUnidad']);

// Desasociar una unidad de una persona
Route::delete('/personas/{id}/unidades/{idUnidad}', [PersonaController::class, 'removeUnidad']);

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


Route::post('/permisos', [PermisoController::class, 'store']); // Crear un nuevo permiso
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



Route::get('/responsables', [ResponsableController::class, 'index']); // Obtener todos los responsables
Route::post('/responsables', [ResponsableController::class, 'store']); // Crear un nuevo responsable
Route::get('/responsables/{id}', [ResponsableController::class, 'show']); // Mostrar un responsable específico
Route::post('/responsables/{id}', [ResponsableController::class, 'update'])->name('api.responsables.update');
Route::delete('/responsables/{id}', [ResponsableController::class, 'destroy']); // Eliminar un responsable



//rutas unidades
Route::get('/unidades', [UnidadController::class, 'index']);
Route::post('/unidades', [UnidadController::class, 'store']);
Route::get('/unidades/{id}', [UnidadController::class, 'show']);
Route::put('/unidades/{id}', [UnidadController::class, 'update']);
Route::delete('/unidades/{id}', [UnidadController::class, 'destroy']);


//especialidad
Route::get('/especialidades', [EspecialidadController::class, 'index']);
Route::post('/especialidades', [EspecialidadController::class, 'store']);
Route::get('/especialidades/{id}', [EspecialidadController::class, 'show']);
Route::put('/especialidades/{id}', [EspecialidadController::class, 'update']);
Route::delete('/especialidades/{id}', [EspecialidadController::class, 'destroy']);


Route::get('/personas', [PersonaController::class, 'index']);
Route::post('/personas', [PersonaController::class, 'store']);
Route::get('/personas/{id}/{idEspecialidad}', [PersonaController::class, 'show']);
Route::post('/personas/{id}/{idEspecialidad}', [PersonaController::class, 'update']);
Route::delete('/personas/{id}/{idEspecialidad}', [PersonaController::class, 'destroy']);



Route::get('unidad-personas', [UnidadPersonaController::class, 'index']);
Route::get('unidad-personas/{idPersona}/{idUnidad}/{idEspecialidad}', [UnidadPersonaController::class, 'show']);
Route::post('unidad-personas', [UnidadPersonaController::class, 'store']);
Route::put('unidad-personas/{idPersona}/{idUnidad}/{idEspecialidad}', [UnidadPersonaController::class, 'update']);
Route::delete('unidad-personas/{idPersona}/{idUnidad}/{idEspecialidad}', [UnidadPersonaController::class, 'destroy']);

//rutas tramites
Route::get('/tramites', [TramitesController::class, 'index']);
Route::post('/tramites', [TramitesController::class, 'store']);
Route::get('/tramites/{id}', [TramitesController::class, 'show']);
Route::put('/tramites/{id}', [TramitesController::class, 'update']);
Route::delete('/tramites/{id}', [TramitesController::class, 'destroy']);

Route::get('/tramitesasesor', [TramitesController::class, 'indexasesor']);



});