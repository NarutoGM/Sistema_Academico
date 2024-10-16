<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use App\Models\Role;
use App\Models\Unidad;
use App\Models\Tramite;
use App\Models\TramiteActividad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TramitesController extends Controller
{
    // GET /api/tramites - Obtener todas las unidades
    public function index()
    {
    $tramites = Tramite::all();
    return response()->json($tramites);
    }
    public function indexasesor()
    {
        try {
            // Obtener todas las actividades con idRol = 3
            $actividades = Actividad::where('idRol', 3)->get();
    
            // Inicializar un array para almacenar los resultados
            $tramiteActividades = [];
    
            // Iterar sobre cada actividad y obtener los TramiteActividad correspondientes
            foreach ($actividades as $actividad) {
                // Obtener los TramiteActividad y cargar la relación TramiteActividadResuelta
                $tramiteActividades[$actividad->id] = TramiteActividad::with('TramiteActividadResuelta')
                    ->where('idActividad', $actividad->id)
                    ->get();
            }
    
            return response()->json([
                'tramite_actividades' => $tramiteActividades
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener los trámites: ' . $e->getMessage()
            ], 500);
        }
    }
    
    

public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'unidad' => 'required|string|max:100'    
    ]);

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
