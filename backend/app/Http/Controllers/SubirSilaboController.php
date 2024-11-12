<?php

namespace App\Http\Controllers;

use App\Models\CargaDocente;
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
                'curso' => function($query) {
                    $query->with(['departamento', 'facultad', 'area', 'regimenCurso', 'tipoCurso']);
                },
                'escuela:idEscuela,name',
            ])
            ->where('idDocente', $docente->idDocente)
            ->where('estado', true)
            ->get()
            ->map(function($carga) {
                $silabo = Silabo::where('idCargaDocente', $carga->idCargaDocente)
                                ->where('idFilial', $carga->idFilial)
                                ->where('idDocente', $carga->idDocente)
                                ->first();
                
                // Determinar el estado del sílabo
                if (!$silabo) {
                    $carga->curso->estado_silabo = "Aún falta generar esquema";
                } elseif (is_null($silabo->estado) && !is_null($silabo->fEnvio)) {
                    $carga->curso->estado_silabo = "En Espera de aprobación";
                } elseif (is_null($silabo->estado)) {
                    $carga->curso->estado_silabo = "Confirmar envio de silabo";
                } elseif ($silabo->estado == 0) {
                    $carga->curso->estado_silabo = "Rechazado";
                } elseif ($silabo->estado == 1) {
                    $carga->curso->estado_silabo = "Aprobado";
                }
        
                return $carga;
            })
            ->map(function($carga) {
                $plancursoacademico = PlanCursoAcademico::where('idMalla', $carga->idMalla)
                                    ->where('idCurso', $carga->idCurso)
                                    ->where('idEscuela', $carga->idEscuela)
                                    ->first();
                
                // Verificar si existe el PlanCursoAcademico y asignar el ciclo
                if ($plancursoacademico) {
                    $carga->ciclo = $plancursoacademico->ciclo;
                } else {
                    $carga->ciclo = "Ciclo no encontrado";
                }
        
                return $carga;
            })
            ->map(function($carga) {
                $user = auth()->user();

                $carga->nomdocente = $user->name;
                $carga->apedocente = $user->lastname;              
            
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
}
