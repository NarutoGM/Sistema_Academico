<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class RoleController extends Controller
{
    // GET /api/roles - Obtener todos los roles
    public function index()
    {
            $roles = Role::with('permisos')->get(); // Asegúrate de que la relación esté correctamente configurada
            
            return response()->json($roles);
    }

    public function rolesdisponibles()
    {
        $roles = Role::select('id', 'name')->get();
        return response()->json($roles);
    }
    

    // POST /api/roles - Crear un nuevo rol
    public function store(Request $request)
    {
        // Validación
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255'
                ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Crear rol
        $role = Role::create($request->all());
        return response()->json($role, 201);
    }

    // GET /api/roles/{id} - Obtener un rol por ID
    public function show($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        return response()->json($role);
    }

    // PUT /api/roles/{id} - Actualizar un rol por ID
    public function update(Request $request, $id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        // Validar los datos actualizados
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'guard_name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Actualizar rol
        $role->update($request->all());
        return response()->json($role);
    }

    // DELETE /api/roles/{id} - Eliminar un rol por ID
    public function destroy($id)
    {
        $role = Role::find($id);

        if (!$role) {
            return response()->json(['message' => 'Rol no encontrado'], 404);
        }

        // Eliminar rol
        $role->delete();
        return response()->json(['message' => 'Rol eliminado correctamente']);
    }
}
