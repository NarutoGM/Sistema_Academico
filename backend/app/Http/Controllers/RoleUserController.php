<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Role;
use App\Models\RoleUser;
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
        ]);

        $user_id = $request->input('user_id');
        $roles = $request->input('roles', []);

        // Buscar el usuario
        $user = User::find($user_id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Extraer solo los IDs de roles de la entrada
        $role_ids = collect($roles)->pluck('id')->toArray();

        // Sincronizar los roles del usuario con los nuevos roles (elimina los roles anteriores)
        $user->roles()->sync($role_ids);

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
