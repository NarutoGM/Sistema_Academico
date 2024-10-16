<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Especialidad;
use Illuminate\Support\Facades\Validator;

class EspecialidadController extends Controller
{
    // Listar todas las especialidades
    public function index()
    {
        $especialidades = Especialidad::all();
        return response()->json($especialidades);
    }

    // Registrar una nueva especialidad
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Descripcion' => 'required|string|max:255',
            'AsesorFree' => 'required|boolean',
            'idResponsableArea' => 'required|integer',
            'idResponsableSecretaria' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $especialidad = Especialidad::create($request->all());
        return response()->json($especialidad, 201); // 201 = Created
    }

    // Mostrar una especialidad específica por su ID
    public function show($id)
    {
        $especialidad = Especialidad::find($id);

        if (!$especialidad) {
            return response()->json(['message' => 'Especialidad no encontrada'], 404);
        }

        return response()->json($especialidad);
    }

    // Actualizar una especialidad existente
    public function update(Request $request, $id)
    {
        $especialidad = Especialidad::find($id);

        if (!$especialidad) {
            return response()->json(['message' => 'Especialidad no encontrada'], 404);
        }

        $validator = Validator::make($request->all(), [
            'Descripcion' => 'required|string|max:255',
            'AsesorFree' => 'required|boolean',
            'idResponsableArea' => 'required|integer',
            'idResponsableSecretaria' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $especialidad->update($request->all());
        return response()->json($especialidad);
    }

    // Eliminar una especialidad
    public function destroy($id)
    {
        $especialidad = Especialidad::find($id);

        if (!$especialidad) {
            return response()->json(['message' => 'Especialidad no encontrada'], 404);
        }

        $especialidad->delete();
        return response()->json(['message' => 'Especialidad eliminada correctamente']);
    }
}
