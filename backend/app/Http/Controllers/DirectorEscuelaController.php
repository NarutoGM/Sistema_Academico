<?php

namespace App\Http\Controllers;
use App\Models\DirectorEscuela;
use Illuminate\Http\Request;

class DirectorEscuelaController extends Controller
{
    public function index()
    {
        try {
            // Obtener todos los directores con su usuario relacionado
            $directores = DirectorEscuela::with('idDirector, users:id, estado')
                ->get();

            // Opcional: Dar formato a los datos si es necesario
            $response = $directores->map(function ($director) {
                return [
                    'idDirector' => $director->idDirector,
                    'idUsuario' => $director->id, // ID de la tabla 'users'
                    'idEscuela' => $director->idEscuela,
                    'estado' => $director->estado,
                ];
            });

            return response()->json($response, 200);
        } catch (\Exception $e) {
            // Loguear el error para depuración

            return response()->json([
                'error' => 'Error al obtener los directores',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

}
