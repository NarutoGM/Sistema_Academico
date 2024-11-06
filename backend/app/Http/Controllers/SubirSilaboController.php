<?php

namespace App\Http\Controllers;

use App\Models\CargaDocente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\CursoAperturado;
use App\Models\DocenteFilial;
use App\Models\DirectorEscuela;
use App\Models\Docente;

class SubirSilaboController extends Controller
{
    /**
     * Muestra el formulario para subir el sílabo.
     */
    public function index()
    {
        $user = auth()->user();
        $userId = $user ? $user->id : null;

            // Verificar que el usuario esté autenticado y el ID no sea null
        if ($userId) {
        // Buscar el docente en el modelo Docente usando el userId
        $docente = Docente::where('id', $userId)->first();
     
        // Comprobar si el docente existe
        if ($docente) {

            $cargadocente = CargaDocente::with(['filial', 'docente', 'semestreAcademico', 'malla', 'curso', 'escuela', 'director'])
            ->where('idDocente', $docente->idDocente)
            ->where('estado', true)
            ->get();
        
        


            return response()->json([
                'cargadocente' => $cargadocente,
                'message' => 'Docente encontrado',
            ]);



        } else {
            return response()->json([
                'message' => 'Docente no encontrado',
            ], 404);
        }
        } else {
            return response()->json([
            'message' => 'Usuario no autenticado',
            ], 401);
        }

    }
}
