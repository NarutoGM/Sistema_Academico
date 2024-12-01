<?php

namespace App\Http\Controllers;

use App\Models\CargaDocente;
use App\Models\DirectorEscuela;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

use App\Models\Docente;
use App\Models\Horario;
use App\Models\PlanCursoAcademico;
use App\Models\Semana;
use App\Models\Silabo;

class HorariosController extends Controller
{
    /**
     * Muestra el formulario para subir el sílabo.
     */


    public function verhorarios()
    {
        $user = auth()->user();
        $userId = $user ? $user->id : null;
        if ($userId) {

            $directorescuela = DirectorEscuela::where('id', $userId)->first();
            if ($directorescuela) {
                if ($directorescuela) {





                    $cargadocente = CargaDocente::with([
                        'filial',
                        'semestreAcademico:idSemestreAcademico,nomSemestre,fTermino,fInicio', // Selecciona solo los campos necesarios
                        'curso',
                        'escuela:idEscuela,name',
                    ])
                        ->where('idDirector', $directorescuela->idDirector)
                        ->get()
                        ->map(function ($carga) {

                            $docente = Docente::where('idDocente', $carga->idDocente)
                                ->where('idDocente', $carga->idDocente)
                                ->first();

                            $docenteuser = User::where('id', $docente->id)
                                ->first();

                            $carga->nomdocente = $docenteuser->name;
                            $carga->apedocente = $docenteuser->lastname;

                            return $carga;
                        })
                        ->map(function ($carga) {
                            $plancursoacademico = PlanCursoAcademico::where('idMalla', $carga->idMalla)
                                ->where('idCurso', $carga->idCurso)
                                ->where('idEscuela', $carga->idEscuela)
                                ->first();
    
                            // Verificar si existe el PlanCursoAcademico y asignar el ciclo
                            if ($plancursoacademico) {
                                $carga->ciclo = $plancursoacademico->ciclo;
                                $carga->prerequisitos = $plancursoacademico->prerequisitos;
                            }
    
                            return $carga;
                        });





                    return response()->json([
                        'cargadocente' => $cargadocente,
                        'message' => 'Docente encontrado',
                    ]);
                } else {
                    return response()->json([
                        'message' => 'Director de escuela no encontrado',
                    ], 404);
                }
            } else {
                return response()->json([
                    'message' => 'Director de escuela no encontrado',
                ], 404);
            }
        } else {
            return response()->json([
                'message' => 'Usuario no autenticado',
            ], 401);
        }
    }

}
