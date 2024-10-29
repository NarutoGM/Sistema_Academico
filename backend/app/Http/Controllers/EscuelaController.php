<?php

namespace App\Http\Controllers;

use App\Models\Escuela;
use Illuminate\Http\Request;

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
}
