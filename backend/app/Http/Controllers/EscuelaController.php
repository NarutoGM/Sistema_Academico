<?php

namespace App\Http\Controllers;

use App\Models\Escuela;
use App\Models\Malla;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EscuelaController extends Controller
{
    /**
     * Muestra una lista de todas las escuelas.
     */
    public function index()
    {
        $escuelas = Escuela::with('facultad:idFacultad,nomFacultad')->get(['idEscuela', 'name', 'idFacultad']);
        return response()->json($escuelas);
    }

    
    

    /**
     * Guarda una nueva escuela en la base de datos.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'idFacultad' => 'required|exists:facultad,idFacultad',
        ]);

        $escuela = Escuela::create([
            'name' => $request->name,
            'idFacultad' => $request->idFacultad,
        ]);

        return response()->json([
            'message' => 'Escuela creada exitosamente',
            'data' => $escuela
        ], 201);
    }

    /**
     * Muestra una escuela específica.
     */
    public function show($id)
    {
        $escuela = Escuela::with('facultad')->find($id);

        if (!$escuela) {
            return response()->json(['message' => 'Escuela no encontrada'], 404);
        }

        return response()->json($escuela);
    }

    /**
     * Actualiza una escuela específica.
     */
    public function update(Request $request, $id)
    {
        $escuela = Escuela::find($id);

        if (!$escuela) {
            return response()->json(['message' => 'Escuela no encontrada'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'idFacultad' => 'sometimes|exists:facultad,idFacultad',
        ]);

        $escuela->update($request->only(['name', 'idFacultad']));

        return response()->json([
            'message' => 'Escuela actualizada exitosamente',
            'data' => $escuela
        ]);
    }

    /**
     * Elimina una escuela específica.
     */
    public function destroy($id)
    {
        $escuela = Escuela::find($id);

        if (!$escuela) {
            return response()->json(['message' => 'Escuela no encontrada'], 404);
        }

        $escuela->delete();

        return response()->json(['message' => 'Escuela eliminada exitosamente']);
    }



    public function getMallaByEscuela($idEscuela)
    {
        try {
    
            // Verifica que la escuela exista
            $escuela = Escuela::findOrFail($idEscuela);
    
            // Ajusta la consulta para coincidir con la estructura de tu base de datos
            $malla = Malla::where('idEscuela', $idEscuela)
                ->where('año', '2018') // Usa 'año' como está en la base de datos
                ->first(['idMalla', 'año', 'estado']);
    
            if (!$malla) {
                return response()->json(['message' => 'No se encontró una malla para esta escuela en 2018.'], 404);
            }
    
            return response()->json($malla, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Escuela no encontrada.'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error interno en el servidor.'], 500);
        }
    }
    

}
