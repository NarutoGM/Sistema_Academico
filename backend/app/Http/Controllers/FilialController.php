<?php

namespace App\Http\Controllers;

use App\Models\Filial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class FilialController extends Controller
{
    public function index()
    {
        $filiales = Filial::select('idFilial', 'name')->get();
        return response()->json($filiales);
    }

    public function getDocentes($idFilial)
    {
        try {
            Log::info("ID de filial recibido: $idFilial");

            $filial = Filial::findOrFail($idFilial);
            Log::info("Filial encontrada: ", ['filial' => $filial]);

            // Carga la relación 'user' junto con los docentes
            $docentes = $filial->docentes()->with('user')->get();
            Log::info("Docentes con relación 'user' cargados: ", ['docentes' => $docentes]);

            // Formatea los datos de los docentes
            $docentes = $docentes->map(function ($docente) {
                Log::info("Procesando docente: ", [
                    'id' => $docente->idDocente,
                    'nombre' => $docente->user->name ?? 'Sin nombre',
                    'apellido' => $docente->user->lastname ?? 'Sin apellido'
                ]);
                return [
                    'id' => $docente->idDocente,
                    'nombre' => $docente->user->name ?? 'Sin nombre', // Si no hay nombre, usa 'Sin nombre'
                    'apellido' => $docente->user->lastname ?? 'Sin apellido', // Si no hay apellido, usa 'Sin apellido'
                ];
            });

            Log::info("Docentes procesados para la respuesta final: ", ['docentes' => $docentes]);

            return response()->json($docentes, 200);
        } catch (\Exception $e) {
            Log::error('Error en getDocentes:', ['exception' => $e]);
            return response()->json(['error' => 'Error interno en el servidor'], 500);
        }
    }



    // Mostrar una filial específica  
    public function show($id)
    {
        $filial = Filial::findOrFail($id);
        return response()->json($filial);
    }

    // Crear una nueva filial  
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $filial = Filial::create($request->all());
        return response()->json($filial, 201);
    }

    // Actualizar una filial existente  
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $filial = Filial::findOrFail($id);
        $filial->update($request->all());

        return response()->json($filial);
    }

    // Eliminar una filial  
    public function destroy($id)
    {
        $filial = Filial::findOrFail($id);
        $filial->delete();

        return response()->json(null, 204);
    }
}
