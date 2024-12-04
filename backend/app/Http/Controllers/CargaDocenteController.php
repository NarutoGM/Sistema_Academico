<?php

namespace App\Http\Controllers;

use App\Models\CargaDocente;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class CargaDocenteController extends Controller
{
    public function getCursosAsignados($idDocente, $idFilial)
    {
        try {
            // Buscar los cursos asignados al docente en la filial
            $cursosAsignados = CargaDocente::with('curso') // Incluye el nombre del curso
                ->where('idDocente', $idDocente)
                ->where('idFilial', $idFilial)
                ->get();

            // Validar si el docente no tiene cursos asignados
            if ($cursosAsignados->isEmpty()) {
                return response()->json([], 200); // Devuelve una lista vacía
            }

            // Formatear los datos
            $resultado = $cursosAsignados->map(function ($carga) {
                return [
                    'idCurso' => $carga->idCurso,
                    'nombreCurso' => $carga->curso->name ?? 'Sin nombre',
                    'idMalla' => $carga->idMalla,
                    'idSemestreAcademico' => $carga->idSemestreAcademico,
                    'idEscuela' => $carga->idEscuela,
                    'idDirector' => $carga->idDirector,
                ];
            });

            return response()->json($resultado, 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener los cursos asignados: ' . $e->getMessage());
            return response()->json(['error' => 'Ocurrió un error al obtener los cursos asignados.'], 500);
        }
    }

    public function store(Request $request)
    {
        try {

            $data = $request->all();

            // Log de los datos recibidos
            Log::info('Datos recibidos en el backend:', $data);

            $data = $request->validate([
                '*.idFilial' => 'required|integer|exists:filial,idFilial',
                '*.idDocente' => 'required|integer|exists:docente,idDocente',
                '*.idSemestreAcademico' => 'required|integer|exists:semestreacademico,idSemestreAcademico',
                '*.idMalla' => 'required|integer|exists:malla,idMalla',
                '*.idCurso' => 'required|integer|exists:curso,idCurso',
                '*.idEscuela' => 'required|integer|exists:escuela,idEscuela',
                '*.idDirector' => 'nullable|integer|exists:directorescuela,idDirector',
                '*.estado' => 'nullable|boolean',
            ]);

            foreach ($data as $item) {
                // Log de cada curso antes de procesarlo
                Log::info('Procesando curso:', $item);


                CargaDocente::create($item); // Inserta cada curso asignado
            }

            Log::info('Cursos asignados correctamente.');
            return response()->json(['message' => 'Cursos asignados correctamente'], 201);
        } catch (\Exception $e) {
            Log::error('Error al guardar cursos asignados:', [
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Error al guardar los cursos asignados', 'details' => $e->getMessage()], 500);
        }
    }
}
