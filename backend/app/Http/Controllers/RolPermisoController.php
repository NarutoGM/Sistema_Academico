<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\RolPermiso;
use App\Models\Role;

use Illuminate\Support\Facades\Validator;

class RolPermisoController extends Controller
{
    public function index()
    {
        $rolPermiso = RolPermiso::all();
        return response()->json($rolPermiso);
    }

    public function guardarPermisos(Request $request)
    {
        try {
            $request->validate([
                'rol_id' => 'required|exists:roles,id',
                'permisos' => 'nullable|array',
                'permisos.*.id' => 'nullable|exists:permiso,id',
            ]);
    
            $rolId = $request->input('rol_id');
            $permisos = $request->input('permisos', []);
    
            $rol = Role::find($rolId);
    
            if (!$rol) {
                return response()->json(['message' => 'Rol no encontrado'], 404);
            }
    
            // Eliminar todos los permisos existentes para el rol
            RolPermiso::where('idRol', $rolId)->delete();
    
            // Obtener la fecha y hora actual
            $now = now();
    
            // Si hay permisos, crea nuevos
            if (!empty($permisos)) {
                foreach ($permisos as $permiso) {
                    RolPermiso::create([
                        'idRol' => $rolId,
                        'idPermiso' => $permiso['id'],
                        'estado' => 1, // Asignar el valor por defecto para estado
                        'created_at' => '2024-10-10 19:36:54.7020', // Usa la fecha y hora actual
                        'updated_at' => '2024-10-10 19:36:54.7020', // Usa la fecha y hora actual
                    ]);
                }
            }
    
            return response()->json(['message' => 'Permisos guardados exitosamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error guardando permisos: ' . $e->getMessage()], 500);
        }
    }
    
    

    
    
    

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idRol' => 'required|exists:roles,id',
            'idPermiso' => 'required|exists:Permiso,id',
            'estado' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $rolPermiso = RolPermiso::create([
            'idRol' => $request->input('idRol'),
            'idPermiso' => $request->input('idPermiso'),
            'estado' => $request->input('estado')
        ]);

        return response()->json(['message' => 'Permiso asignado al rol exitosamente'], 201);
    }

    public function show($idRol, $idPermiso)
    {
        $rolPermiso = DB::table('RolPermiso')
            ->where('idRol', $idRol)
            ->where('idPermiso', $idPermiso)
            ->first();

        if (!$rolPermiso) {
            return response()->json(['message' => 'Asignación no encontrada'], 404);
        }

        return response()->json($rolPermiso);

    }

    public function update(Request $request, $idRol, $idPermiso)
    {
        $rolPermiso = DB::table('RolPermiso')
           ->where('idRol', $idRol)
           ->where('idPermiso', $idPermiso)
           ->first();

        if (!$rolPermiso) {
            return response()->json(['message' => 'Asignación no encontrada'], 404);
        }

        $validator = Validator::make($request->all(), [
            'estado' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        DB::table('RolPermiso')
            ->where('idRol', $idRol)
            ->where('idPermiso', $idPermiso)
            ->update([
                'estado' => $request->input('estado'),
                'updated_at' => now()
            ]);

        return response()->json(['message' => 'Asignación actualizada correctamente']);
    }

    public function destroy($idRol, $idPermiso)
    {
        $rolPermiso = DB::table('RolPermiso')
           ->where('idRol', $idRol)
           ->where('idPermiso', $idPermiso)
            ->first();

        if (!$rolPermiso) {
            return response()->json(['message' => 'Asignación no encontrada'], 404);
        }

        DB::table('RolPermiso')
          ->where('idRol', $idRol)
          ->where('idPermiso', $idPermiso)
            ->delete();

        return response()->json(['message' => 'Asignación eliminada correctamente']);
    }
}
