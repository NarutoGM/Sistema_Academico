<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Validator;

class RoleUserController extends Controller
{
    public function index()
    {
        $roleUser = DB::table('RoleUser')->get();
        return response()->json($roleUser);
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
