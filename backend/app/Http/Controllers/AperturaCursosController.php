<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\CursoAperturado;
use App\Models\User;

use App\Models\DirectorEscuela;
use App\Models\CargaDocente;
use App\Models\Escuela;
use App\Models\Malla;
use App\Models\Docente;
use App\Models\Silabo;
use Carbon\Carbon;

use Illuminate\Support\Facades\Validator;

class AperturaCursosController extends Controller
{

    public function index()
    {
        $user = auth()->user();
        $userId = $user ? $user->id : null;

        // Verificar si el usuario está autenticado
        if ($userId) {
            $docente = Docente::where('id', $userId)->first();

            if ($docente) {
                // Obtener los cursos disponibles para apertura
                $aperturaCursos = CursoAperturado::with([
                    'semestreAcademico:idSemestreAcademico,nomSemestre,fTermino,fInicio',
                    'curso:idCurso,nombreCurso,creditos',
                    'escuela:idEscuela,name',
                    'malla:idMalla,nombreMalla',
                ])
                ->where('idDocente', $docente->idDocente)
                ->get()
                ->map(function ($curso) {
                    // Evaluar el estado del curso para apertura
                    if (!$curso->estado) {
                        $curso->estado_apertura = "Pendiente de aprobación";
                    } elseif ($curso->estado == 1) {
                        $curso->estado_apertura = "En proceso";
                    } elseif ($curso->estado == 2) {
                        $curso->estado_apertura = "Aprobado";
                    } elseif ($curso->estado == 3) {
                        $curso->estado_apertura = "Cerrado";
                    }

                    return $curso;
                });

                return response()->json([
                    'aperturaCursos' => $aperturaCursos,
                    'message' => 'Datos cargados correctamente',
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
