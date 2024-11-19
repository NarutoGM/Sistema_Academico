<?php

namespace App\Http\Controllers;

use App\Models\CargaDocente;
use App\Models\DirectorEscuela;
use App\Models\Escuela;
use App\Models\Facultad;
use App\Models\Horario;
use App\Models\PlanCursoAcademico;
use App\Models\Regimen;
use App\Models\SemestreAcademico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HorarioController extends Controller
{
    // Listar todos los regimenes  
    public function index()
    {
        $user = auth()->user();
        $userId = $user ? $user->id : null;
    
        if (!$userId) {
            return response()->json([
                'message' => 'Usuario no autenticado',
            ], 401);
        }
    
    
        $directorescuela = DirectorEscuela::where('id', $userId)->first();
    
        if (!$directorescuela) {
            return response()->json([
                'message' => 'Director de escuela no encontrado',
            ], 404);
        }
    
    
      

            $cargadocentes = CargaDocente::with([
                'filial',
                'curso' => function ($query) {
                    $query->with(['departamento']);
                },
                'escuela:idEscuela,name',
            ])->where('idEscuela', $directorescuela->idEscuela)
                ->where('estado', 1)
                ->get()
                ->map(function ($carga) {
                    $user = auth()->user();

                    $carga->nomdocente = $user->name;
                    $carga->apedocente = $user->lastname;

                    return $carga;
                });

    
        if ($cargadocentes->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron cargas docentes para esta escuela',
            ], 404);
        }
    
    
        $idSemestreAcademico = $cargadocentes->first()->idSemestreAcademico;
        $escuela = Escuela::with('facultad')->where('idEscuela', $directorescuela->idEscuela)->first();


        $semestreAcademico = SemestreAcademico::where('idSemestreAcademico', $idSemestreAcademico)->first();
    
        if (!$semestreAcademico) {
            return response()->json([
                'message' => 'Semestre académico no encontrado',
            ], 404);
        }
    
    
        $ciclos = [];
        if ($semestreAcademico->numSemestre === "I") {
            $ciclos = ['I', 'III', 'V', 'VII', 'IX']; // Ciclos impares
        } elseif ($semestreAcademico->numSemestre === "II") {
            $ciclos = ['II', 'IV', 'VI', 'VIII', 'X']; // Ciclos pares
        }
    
    
        $cursosPorCiclo = [];
        foreach ($ciclos as $ciclo) {
            $cursosPorCiclo[$ciclo] = [];
        }
    
    
        foreach ($cargadocentes as $cargadocente) {
    
            $cursoAcademicos = PlanCursoAcademico::where('idEscuela', $cargadocente->idEscuela)
                ->where('idMalla', $cargadocente->idMalla)
                ->where('idCurso', $cargadocente->idCurso)
                ->first();
    
            if (!$cursoAcademicos) {
                Log::warning('Curso no encontrado en PlanCursoAcademico', [
                    'idEscuela' => $cargadocente->idEscuela,
                    'idMalla' => $cargadocente->idMalla,
                    'idCurso' => $cargadocente->idCurso,
                ]);
                continue;
            }
    
            $cicloRomano = $cursoAcademicos->ciclo;
    
            if (!isset($cursosPorCiclo[$cicloRomano])) {
                Log::warning('Ciclo no encontrado en los ciclos permitidos', [
                    'ciclo' => $cicloRomano,
                ]);
                continue;
            }
    
            $cursosPorCiclo[$cicloRomano][] = $cargadocente;
        }
    
    
        return response()->json([
            'cargadocente' => $cursosPorCiclo,
            'semestreAcademico' => $semestreAcademico,
            'escuela' => $escuela,
            'message' => 'Datos procesados exitosamente',
        ]);
    }
    
    public function listarhorarios()
    {
        $user = auth()->user();
        $userId = $user ? $user->id : null;
    
        if (!$userId) {
            return response()->json([
                'message' => 'Usuario no autenticado',
            ], 401);
        }
    
    
        $directorescuela = DirectorEscuela::where('id', $userId)->first();
    
        if (!$directorescuela) {
            return response()->json([
                'message' => 'Director de escuela no encontrado',
            ], 404);
        }
    
        $horarios = Horario::with(['semestreacademico', 'filial'])->get();

    
        return response()->json([
            'horario' => $horarios,
            'message' => 'Datos procesados exitosamente',
        ]);
    } 
    
    
}
