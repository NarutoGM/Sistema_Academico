<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Role;
use App\Models\RoleUser;
use App\Models\Docente;
use App\Models\DirectorEscuela;
use App\Models\DocenteFilial;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class RoleUserController extends Controller
{
    public function index()
    {
        $roleUser = DB::table('RoleUser')->get();
        return response()->json($roleUser);
    }

    /////////////////////////////////////////////////////////
    public function guardarRoles(Request $request)
    {
        try {
            // Validar los datos de entrada
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'roles' => 'nullable|array',
                'roles.*.id' => 'nullable|exists:roles,id',
                'docente' => 'nullable|array', // Validación para los datos de docente
            ]);

            $user_id = $request->input('user_id');
            $roles = $request->input('roles', []);

            $directorData = $request->input('additional_data.escuela', []);

            $docenteData = $request->input('additional_data.docente', []);
            $filiales = $request->input('additional_data.docente.filiales.idFilial', []);
            $idCondicion = $request->input('additional_data.docente.condicion', []);
            $idCategoria = $request->input('additional_data.docente.categoria', []);
            $idRegimen = $request->input('additional_data.docente.regimen', []);
            $bandera1 = false;
            $bandera2 = false;

            if (
                isset($directorData['id']) && !empty($directorData['id'])
            ) {
                $bandera1 = true;
            }

            if (
                isset($docenteData['escuela']) && !empty($docenteData['escuela'])
            ) {
                $bandera2 = true;
            } 



            // Buscar el usuario
            $user = User::find($user_id);

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Extraer solo los IDs de roles de la entrada
            $role_ids = collect($roles)->pluck('id')->toArray();

            // Obtener los IDs de roles actuales
            $current_roles = $user->roles()->pluck('id')->toArray();

            // Eliminar los roles que ya no están en la lista de nuevos roles
            foreach ($current_roles as $current_role_id) {
                if (!in_array($current_role_id, $role_ids)) {
                    $user->roles()->detach($current_role_id);
                }
            }

            $existingDirector = DirectorEscuela::where('id', $user_id)->first();

            if ($existingDirector) {
                $existingDirector->estado = false;
                $existingDirector->save();
            }
            $existingDocente = Docente::where('id', $user_id)->first();
            if ($existingDocente) {
                 DocenteFilial::where('idDocente', $existingDocente->idDocente)->update(['estado' => false]);
            }



            foreach ($role_ids as $role_id) {

                $rol = Role::find($role_id);

                if ($rol->name == 'Director de Escuela' && $bandera1) {
                    // Verifica si ya existe un director con el mismo id de usuario
                    if (!$existingDirector) {

                        $director = new DirectorEscuela();
                        $director->id = $user_id;
                        $director->estado = true; // Forzar el valor booleano explícito
                        $director->idEscuela = $directorData['id'] ?? null;
                        $director->save();
                    } else {
                        $existingDirector->idEscuela = $directorData['id'];
                        $existingDirector->estado = true; // Forzar el valor booleano explícito
                        $existingDirector->save();
                    }
                } elseif ($rol->name == 'Docente' && $bandera2) {
                    if (!$existingDocente) {
                        $docente = new Docente();
                        $docente->id = $user_id;
                        $docente->idEscuela = $docenteData['escuela'] ?? null;
                        $docente->save();


                   //     Log::info('Valor de $filiales:', ['filiales' => $filiales]);
                        Log::info('Valor de $filiales:', ['filiales' => $filiales]);


                        foreach ($filiales as $filialId) {

                            // Si no existe, crea la relación
                            DocenteFilial::create([
                                'idDocente' => $docente->idDocente,
                                'idFilial' => $filialId,
                                'idRegimen' => $idCategoria,
                                'idCondicion' => $idCondicion,
                                'idCategoria' => $idCategoria,

                                'estado' => true
                            ]);
                        }
                    } else {
                        $existingDocente->idEscuela = $docenteData['escuela'];
                        $existingDocente->save();

                        Log::info('Valor de $filiales:', ['filiales' => $filiales]);

                
                        foreach ($filiales as $filialId) {

                            Log::info('Procesando filial:', ['filialId' => $filialId]);

                            // Verifica si ya existe la relación del docente con la filial
                            $docenteFilial = DocenteFilial::where('idDocente', $existingDocente->idDocente)
                                ->where('idFilial', $filialId)
                                ->first();

                            // Si no existe, crea la relación
                            if (!$docenteFilial) {

                                DocenteFilial::create([
                                    'idDocente' => $existingDocente->idDocente,
                                    'idFilial' => $filialId,
                                    'idRegimen' => $idRegimen,
                                    'idCondicion' => $idCondicion,
                                    'idCategoria' => $idCategoria,
                                    'estado' => true
                                ]);
                            } else {
                                // Actualizar utilizando el query builder en lugar de `save`
                                DocenteFilial::where('idDocente', $existingDocente->idDocente)
                                    ->where('idFilial', $filialId)
                                    ->update(['estado' => true]);
                            }
                        }
                    }
                }

                if (!$user->roles()->where('role_id', $role_id)->exists()) {
                    $user->roles()->attach($role_id);
                }
            }

            return response()->json(['message' => 'Roles guardados exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error guardando roles: ' . $e->getMessage(),
                'trace' => $e->getTrace()
            ], 500);
        }
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|exists:roles,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        DB::table('RoleUser')->insert([
            'role_id' => $request->input('role_id'),
            'user_id' => $request->input('user_id'),
            'status' => $request->input('status'),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Rol asignado al usuario exitosamente'], 201);
    }

    public function show($user_id, $role_id)
    {
        $roleUser = DB::table('RoleUser')
            ->where('user_id', $user_id)
            ->where('role_id', $role_id)
            ->first();

        if (!$roleUser) {
            return response()->json(['message' => 'Asignación no encontrada'], 404);
        }

        return response()->json($roleUser);
    }

    public function update(Request $request, $user_id, $role_id)
    {
        $roleUser = DB::table('RoleUser')
            ->where('user_id', $user_id)
            ->where('role_id', $role_id)
            ->first();

        if (!$roleUser) {
            return response()->json(['message' => 'Asignación no encontrada'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        DB::table('RoleUser')
            ->where('user_id', $user_id)
            ->where('role_id', $role_id)
            ->update([
                'status' => $request->input('status'),
                'updated_at' => now()
            ]);

        return response()->json(['message' => 'Asignación actualizada correctamente']);
    }

    public function destroy($user_id, $role_id)
    {
        $roleUser = DB::table('RoleUser')
            ->where('user_id', $user_id)
            ->where('role_id', $role_id)
            ->first();

        if (!$roleUser) {
            return response()->json(['message' => 'Asignación no encontrada'], 404);
        }

        DB::table('RoleUser')
            ->where('user_id', $user_id)
            ->where('role_id', $role_id)
            ->delete();

        return response()->json(['message' => 'Asignación eliminada correctamente']);
    }
}
