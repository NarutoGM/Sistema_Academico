<?php

namespace App\Http\Controllers;

use App\Models\UnidadPersona;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class UnidadPersonaController extends Controller
{
    // GET: Obtener todos los registros
    public function index()
    {
        $unidadPersonas = UnidadPersona::all();
        return response()->json($unidadPersonas);
    }

    // GET: Obtener un registro específico por las tres claves primarias
    public function show($idPersona, $idUnidad, $idEspecialidad)
    {
        $unidadPersona = UnidadPersona::where('idPersona', $idPersona)
            ->where('idUnidad', $idUnidad)
            ->where('idEspecialidad', $idEspecialidad)
            ->first();

        if (!$unidadPersona) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }

        return response()->json($unidadPersona);
    }

    // POST: Crear un nuevo registro
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idPersona' => 'required|integer',
            'idUnidad' => 'required|integer',
            'idEspecialidad' => 'required|integer',
            'Activo' => 'required',
            'FechaInicio' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $unidadPersona = UnidadPersona::create($request->all());

        return response()->json($unidadPersona, 201);
    }

    public function update(Request $request, $idPersona, $idUnidad, $idEspecialidad)
    {
        // Buscar el registro
        $unidadPersona = UnidadPersona::where('idPersona', $idPersona)
            ->where('idUnidad', $idUnidad)
            ->where('idEspecialidad', $idEspecialidad)
            ->first();
    
        if (!$unidadPersona) {
            return response()->json(['message' => 'Registro no encontrado'], 404);
        }
    
        // Validar la entrada
        $validator = Validator::make($request->all(), [
            'Activo' => 'sometimes|required',
            'FechaInicio' => 'sometimes|required|date',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        // Actualizar manualmente los campos
        $unidadPersona->Activo = $request->input('Activo', $unidadPersona->Activo);
        $unidadPersona->FechaInicio = $request->input('FechaInicio', $unidadPersona->FechaInicio);
    
        // Guardar los cambios
        $unidadPersona->save();
    
        return response()->json($unidadPersona);
    }
    




    public function destroy($idPersona, $idUnidad, $idEspecialidad)
    {
        $unidadPersona = DB::table('UnidadPersona')
            ->where('idPersona', $idPersona)
            ->where('idUnidad', $idUnidad)
            ->where('idEspecialidad', $idEspecialidad)
            ->first();

        if (!$unidadPersona) {
            return response()->json(['message' => 'Asignación no encontrada'], 404);
        }

        DB::table('UnidadPersona')
        ->where('idPersona', $idPersona)
        ->where('idUnidad', $idUnidad)
        ->where('idEspecialidad', $idEspecialidad)
            ->delete();

        return response()->json(['message' => 'Asignación eliminada correctamente']);
    }
    
}
