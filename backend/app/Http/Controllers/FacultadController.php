<?php

namespace App\Http\Controllers;

use App\Models\Facultad;
use Illuminate\Http\Request;

class FacultadController extends Controller
{
    /**
     * Muestra una lista de todas las facultades.
     */
    public function index()
    {
        $facultades = Facultad::all();
        return response()->json($facultades);
    }

    /**
     * Guarda una nueva facultad en la base de datos.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $facultad = Facultad::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Facultad creada exitosamente',
            'data' => $facultad
        ], 201);
    }

    /**
     * Muestra una facultad específica.
     */
    public function show($id)
    {
        $facultad = Facultad::find($id);

        if (!$facultad) {
            return response()->json(['message' => 'Facultad no encontrada'], 404);
        }

        return response()->json($facultad);
    }

    /**
     * Actualiza una facultad específica.
     */
    public function update(Request $request, $id)
    {
        $facultad = Facultad::find($id);

        if (!$facultad) {
            return response()->json(['message' => 'Facultad no encontrada'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $facultad->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Facultad actualizada exitosamente',
            'data' => $facultad
        ]);
    }

    /**
     * Elimina una facultad específica.
     */
    public function destroy($id)
    {
        $facultad = Facultad::find($id);

        if (!$facultad) {
            return response()->json(['message' => 'Facultad no encontrada'], 404);
        }

        $facultad->delete();

        return response()->json(['message' => 'Facultad eliminada exitosamente']);
    }
}
