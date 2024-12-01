<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CursosAperturados;
use Illuminate\Support\Facades\Log; // Para registrar en los logs

class CursoAperturadosController extends Controller
{
    public function getCursosByMallaAndSemestre($idEscuela, $idMalla, $idSemestreAcademico)
    {
        try {
            // Validar si los parámetros son válidos
            if (!$idEscuela || !$idMalla || !$idSemestreAcademico) {
                return response()->json(['error' => 'Faltan parámetros requeridos.'], 400);
            }

            // Filtrar cursos por los parámetros
            $cursos = CursosAperturados::with('curso')
                ->where('idEscuela', $idEscuela)
                ->where('idMalla', $idMalla)
                ->where('idSemestreAcademico', $idSemestreAcademico)
                ->get();

            // Formatear los resultados para incluir solo los datos necesarios
            $resultado = $cursos->map(function ($cursoAperturado) {
                return [
                    'idCurso' => $cursoAperturado->idCurso,
                    'nombreCurso' => $cursoAperturado->curso->name ?? 'Sin nombre', // Relación con la tabla Cursos
                    'estado' => $cursoAperturado->estado,
                ];
            });

            // Si no se encontraron cursos
            if ($resultado->isEmpty()) {
                return response()->json(['message' => 'No se encontraron cursos para los filtros proporcionados.'], 404);
            }

            // Devolver los cursos en formato JSON
            return response()->json($resultado, 200);
        } catch (\Exception $e) {
            // Registrar el error en los logs
            Log::error('Error al obtener los cursos:', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Devolver un error genérico
            return response()->json([
                'error' => 'Ocurrió un error inesperado.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
