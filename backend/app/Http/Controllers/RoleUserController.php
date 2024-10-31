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
            $docenteData = $request->input('additional_data.docente', []);
            $directorData = $request->input('additional_data.escuela', []);

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
                
                return response()->json($existingDirector);
            }
            
            
            


   
            foreach ($role_ids as $role_id) {

                    
                    $rol = Role::find($role_id);

                    if ($rol->name == 'Director de Escuela') {
                        // Verifica si ya existe un director con el mismo id de usuario
                        $existingDirector = DirectorEscuela::where('id', $user_id)->first();
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
                        
                    } elseif ($rol->name == 'Docente') {
                        $existingDocente = Docente::where('id', $user_id)->first();
                        if (!$existingDocente) {
                            $docente = new Docente();
                            $docente->id = $user_id;
                            $docente->idEscuela = $docenteData['escuela'] ?? null;
                            $docente->save();
                        }else{
                            $existingDocente->idEscuela=$docenteData['escuela'];
                            $existingDocente->save();
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

// Procesar filiales si existen
            //        if (isset($docenteData['filiales']) && is_array($docenteData['filiales'])) {
            //            foreach ($docenteData['filiales'] as $filial) {
              //              $docentefilial = new DocenteFilial();
                    
                            // Asigna los valores correspondientes
                //            $docentefilial->idDocente = $user_id;
                //            $docentefilial->idFilial = $filial; // Asigna el id de filial actual
                //            $docentefilial->idCondicion = $docenteData['condicion'] ?? null;
                //            $docentefilial->idRegimen = $docenteData['regimen'] ?? null;
                //            $docentefilial->idCategoria = $docenteData['categoria'] ?? null;
                //            $docentefilial->estado = true;
                            // Guarda el registro en la base de datos
                //            $docentefilial->save();
                //        }
               //     }              

                    // Asociar el rol al usuario



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
