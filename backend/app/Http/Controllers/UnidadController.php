<?php

namespace App\Http\Controllers;

use App\Models\Unidad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UnidadController extends Controller
{
    // GET /api/unidades - Obtener todas las unidades
    public function index()
    {
        $unidades = Unidad::all();
        return response()->json($unidades);
    }

public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'unidad' => 'required|string|max:100'    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $unidad = Unidad::create($validator->validated()); // Usar datos validados
    
    return response()->json(['message' => 'Unidad creada exitosamente.']);
}


    public function show($id)
    {
        $unidad = Unidad::find($id);

        if (!$unidad) {
            return response()->json(['message' => 'Unidad no encontrada'], 404);
        }

        return response()->json($unidad);
    }

public function update(Request $request, $id)
{
    $unidad = Unidad::find($id);
    if (!$unidad) {
        return response()->json(['message' => 'Unidad no encontrada'], 404);
    }

    $validator = Validator::make($request->all(), [
        'unidad' => 'required|string|max:100',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $unidad->fill($request->all());
    $unidad->save();

    return response()->json(['message' => 'Unidad actualizada exitosamente.']);
}



    public function destroy($id)
    {
        $unidad = Unidad::find($id);

        if (!$unidad) {
            return response()->json(['message' => 'Unidad no encontrada'], 404);
        }

        $unidad->delete();

        return response()->json(['message' => 'Unidad eliminada correctamente']);
    }
}
