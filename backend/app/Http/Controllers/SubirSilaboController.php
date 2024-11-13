<?php

namespace App\Http\Controllers;

use App\Models\CargaDocente;
use App\Models\DirectorEscuela;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Models\Docente;
use App\Models\PlanCursoAcademico;
use App\Models\Silabo;

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

                $cargadocente = CargaDocente::with([
                    'filial',
                    'semestreAcademico:idSemestreAcademico,nomSemestre,fTermino,fInicio', // Selecciona solo los campos necesarios
                    'curso' => function ($query) {
                        $query->with(['departamento', 'facultad', 'area', 'regimenCurso', 'tipoCurso']);
                    },
                    'escuela:idEscuela,name',
                ])
                    ->where('idDocente', $docente->idDocente)
                    ->where('estado', true)
                    ->get()
                    ->map(function ($carga) {
                        $silabo = Silabo::where('idCargaDocente', $carga->idCargaDocente)
                            ->where('idFilial', $carga->idFilial)
                            ->where('idDocente', $carga->idDocente)
                            
                            ->first();
                        if (!$silabo){
                            $carga->curso->estado_silabo = "Aún falta generar esquema";
                        }else{
                        if ($silabo->activo==false) {
                            $carga->curso->estado_silabo = "Inactivo";
                        } elseif ($silabo->estado==0 && $silabo->activo=true) {
                            $carga->curso->estado_silabo = "Confirmar envio de silabo";
                        } elseif ($silabo->estado==1 && $silabo->activo=true) {
                            $carga->curso->estado_silabo = "En espera de aprobación";
                        } elseif ($silabo->estado==2 && $silabo->activo=true) {
                            $carga->curso->estado_silabo = "Confirmar envio de silabo";
                        } elseif ($silabo->estado==3 && $silabo->activo=true) {
                            $carga->curso->estado_silabo = "Aprobado";
                        }
                    }
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
                    })
                    ->map(function ($carga) {
                        $user = auth()->user();

                        $carga->nomdocente = $user->name;
                        $carga->apedocente = $user->lastname;
                        $carga->email = $user->email;

                        return $carga;
                    });





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

    public function versilabos()
    {
        $user = auth()->user();
        $userId = $user ? $user->id : null;
        if ($userId) {

            $directorescuela = DirectorEscuela::where('id', $userId)->first();
            if ($directorescuela) {
                if ($directorescuela) {

                    $silabo = Silabo::where('idDirector', $directorescuela->idDirector)
                        ->whereIn('estado', [1, 0])
                        ->get();
                    


                } else {
                    return response()->json([
                        'message' => 'Docente no encontrado',
                    ], 404);
                }
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
