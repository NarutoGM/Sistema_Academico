<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EscuelaController;
use App\Http\Controllers\FacultadController;
use App\Http\Controllers\AperturaCursosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoleUserController;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\RolPermisoController;

use App\Http\Controllers\CondicionController;  
use App\Http\Controllers\RegimenController;  
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CursoAperturadoController;

use App\Http\Controllers\SubirSilaboController;
use App\Http\Controllers\FilialController;
use App\Http\Controllers\DirectorEscuelaController;
use App\Http\Controllers\SemestreController;
use App\Http\Controllers\CursoAperturadosController;
use App\Http\Controllers\CargaDocenteController;




use App\Http\Controllers\HorarioController;
use App\Http\Controllers\HorariosController;

use App\Http\Controllers\TokenController;
use App\Models\Horario;

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
Route::get('/administrarusuarios', [UserController::class, 'administrarusuarios']); // Obtener todos los permisos con estado 1

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

Route::get('/aperturacursos',[AperturaCursosController::class, 'index']);


Route::apiResource('escuelas', EscuelaController::class);
Route::apiResource('facultades', FacultadController::class);

Route::get('/generate-token', [TokenController::class, 'generateAccessToken']);
Route::get('/miscursos', [SubirSilaboController::class, 'index']); 
Route::get('/versilabos', [SubirSilaboController::class, 'versilabos']); 
Route::get('/reportesilabos', [SubirSilaboController::class, 'reportesilabos']); 
Route::post('/silaboReusar', [SubirSilaboController::class, 'silaboReusar']); //silabos reutilizables

Route::apiResource('condiciones', CondicionController::class);  
Route::apiResource('regimenes', RegimenController::class);  
Route::apiResource('categorias', CategoriaController::class);


Route::apiResource('filiales', FilialController::class);  
Route::get('/filiales/{idFilial}/docentes', [FilialController::class, 'getDocentes']);
Route::get('/escuelas/{idEscuela}/malla', [EscuelaController::class, 'getMallaByEscuela']);
Route::apiResource('/semestreacademico', SemestreController::class);
Route::get('/cursosAperturados/{idEscuela}/{idMalla}/{idSemestreAcademico}', [CursoAperturadosController ::class, 'getCursosByMallaAndSemestre']);
Route::get('/cargadocente/{idDocente}/{idFilial}/asignados',[CargaDocenteController::class, 'getCursosAsignados']);
Route::post('/cargadocente', [CargaDocenteController::class, 'store']);
Route::post('gestionarsilabo', [SubirSilaboController::class, 'gestionarsilabo']);
Route::get('/obtenerMisPermisos', [UserController::class, 'obtenerMisPermisos']); // Obtener todos los permisos
Route::post('/gestionarhorarios', [SubirSilaboController::class, 'gestionarhorarios']);
Route::post('gestionarsilabodirector', [SubirSilaboController::class, 'gestionarsilabodirector']);




Route::get('/verhorarios', [HorariosController::class, 'verhorarios']);
Route::post('/guardar-horarios', [HorariosController::class, 'guardarHorarios']);
Route::get('/cursosFiltrados', [HorariosController::class, 'obtenerCursosFiltrados']);





});