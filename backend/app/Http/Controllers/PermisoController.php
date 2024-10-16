<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Permiso;
use Illuminate\Support\Facades\Validator;


class PermisoController extends Controller
{
    public function index()
    {
        $permisos = Permiso::all();
        return response()->json($permisos);
    }
    public function permisosdisponibles()
    {
        $permisos = Permiso::where('estado', 1)->get();
        return response()->json($permisos);
    }
    

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'descripcion' => 'required|string|max:255',
            'estado' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $permiso = Permiso::create($request->all());
        return response()->json($permiso, 201); // 201 = Created
    }

    public function show($id)
    {
        $permiso = Permiso::find($id);

        if (!$permiso) {
            return response()->json(['message' => 'Permiso no encontrado'], 404);
        }

        return response()->json($permiso);
    }

    public function update(Request $request, $id)
    {
        $permiso = Permiso::find($id);

        if (!$permiso) {
            return response()->json(['message' => 'Permiso no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'descripcion' => 'required|string|max:255',
            'estado' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $permiso->update($request->all());

        return response()->json($permiso);
    }

    public function destroy($id)
    {
        $permiso = Permiso::find($id);

        if (!$permiso) {
            return response()->json(['message' => 'Permiso no encontrado'], 404);
        }

        $permiso->delete();

        return response()->json(['message' => 'Permiso eliminado correctamente']);
    }

    public function activos()
    {
        $permisosActivos = Permiso::activos()->get();
        return response()->json($permisosActivos);
    }
}
