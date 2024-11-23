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


                        if (!$silabo) {
                            $carga->curso->estado_silabo = "No hay silabo";

                            $carga->curso->documento = "";
                        } else {
                            $carga->curso->observaciones = $silabo->observaciones;

                            $carga->curso->documento = $silabo->documento;

                            if ($silabo->activo == false) {
                                $carga->curso->estado_silabo = "Inactivo";
                            } elseif ($silabo->estado == 0 && $silabo->activo = true) {
                                $carga->curso->estado_silabo = "Confirmar envio de silabo";
                            } elseif ($silabo->estado == 1 && $silabo->activo = true) {
                                $carga->curso->estado_silabo = "En espera de aprobación";
                            } elseif ($silabo->estado == 2 && $silabo->activo = true) {
                                $carga->curso->estado_silabo = "Rechazado";
                            } elseif ($silabo->estado == 3 && $silabo->activo = true) {
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
                        $carga->profesion = $user->profesion;

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





                    $cargadocente = CargaDocente::with([
                        'filial',
                        'semestreAcademico:idSemestreAcademico,nomSemestre,fTermino,fInicio', // Selecciona solo los campos necesarios
                        'curso',
                        'escuela:idEscuela,name',
                    ])
                        ->where('idDirector', $directorescuela->idDirector)
                        ->get()
                        ->map(function ($carga) {
                            $silabo = Silabo::where('idCargaDocente', $carga->idCargaDocente)
                                ->where('idFilial', $carga->idFilial)
                                ->where('idDocente', $carga->idDocente)
                                ->where('estado', '!=', 0)
                                ->first();
                            $carga->curso->documento = "";

                            if ($silabo) {

                                $carga->curso->documento = $silabo->documento;

                                if ($silabo->activo == false) {
                                    $carga->curso->estado_silabo = "Inactivo";
                                } elseif ($silabo->estado == 1 && $silabo->activo == true) {
                                    $carga->curso->estado_silabo = "En espera de aprobación";
                                } elseif ($silabo->estado == 3 && $silabo->activo == true) {
                                    $carga->curso->estado_silabo = "Aprobado";
                                    $carga->curso->observaciones = $silabo->observaciones;

                                } elseif ($silabo->estado == 2 && $silabo->activo == true) {
                                    $carga->curso->estado_silabo = "Rechazado";
                                    
                                    $carga->curso->observaciones = $silabo->observaciones;

                                }
                                return $carga; // Solo devuelve las cargas con un sílabo
                            }

                            return null; // Omite las cargas sin sílabo
                        })
                        ->filter() // Filtra para eliminar las cargas nulas (sin sílabo)
                        ->map(function ($carga) {

                            $docente = Docente::where('idDocente', $carga->idDocente)
                                ->where('idDocente', $carga->idDocente)
                                ->first();

                            $docenteuser = User::where('id', $docente->id)
                                ->first();

                            $carga->nomdocente = $docenteuser->name;
                            $carga->apedocente = $docenteuser->lastname;

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

    public function infohorario()
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
                        if (!$silabo) {
                            $carga->curso->estado_silabo = "Aún falta generar esquema";
                        } else {

                            if ($silabo->activo == false) {
                                $carga->curso->estado_silabo = "Inactivo";
                            } elseif ($silabo->estado == 0 && $silabo->activo = true) {
                                $carga->curso->estado_silabo = "Confirmar envio de silabo";
                            } elseif ($silabo->estado == 1 && $silabo->activo = true) {
                                $carga->curso->estado_silabo = "En espera de aprobación";
                            } elseif ($silabo->estado == 2 && $silabo->activo = true) {
                                $carga->curso->estado_silabo = "Confirmar envio de silabo";
                            } elseif ($silabo->estado == 3 && $silabo->activo = true) {
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








    public function gestionarsilabo(Request $request)
    {
        try {
            // Log para verificar el número recibido
            Log::info('Recibido número: ' . $request->numero);

            // Verificar si el número es 1 y procesar el contenido HTML
            if ($request->numero == 1) {
                // Log para verificar que hemos entrado en el caso número 1
                Log::info('Procesando contenido HTML para número: 1');

                // Verificar si se ha recibido el contenido HTML
                if ($request->has('documentoHtml')) {
                    $htmlContent = $request->input('documentoHtml');

                    // Log para verificar el contenido HTML que se está recibiendo
                    Log::info('Contenido HTML recibido: ' . substr($htmlContent, 0, 100)); // Solo mostramos los primeros 100 caracteres para evitar exceso de log
                    
                    $conditions = [
                        'idCargaDocente' => $request->idCargaDocente,
                        'idDocente' => $request->idDocente,
                        'idFilial' => $request->idFilial,
                    ];
                
                    // Guardar o actualizar el registro
                    $silabo = Silabo::updateOrCreate(
                        $conditions, // Condiciones para buscar
                        [ // Valores para crear o actualizar
                            'documento' =>  $htmlContent,
                            'activo' => 1, // Puedes cambiar estos valores si es necesario
                            'estado' => 1,
                            'idDirector' => $request->idDirector,
                        ]
                    );


            

                    // Log para confirmar que el sílabo se ha creado correctamente
                    Log::info('Sílabo creado con ID: ' . $silabo->id);

                    // Retornar una respuesta de éxito
                    return response()->json([
                        'message' => 'El sílabo se creó correctamente.',
                        'silabo' => $silabo,
                    ], 201);
                } else {
                    Log::warning('No se ha recibido un documento HTML');
                    return response()->json([
                        'message' => 'No se ha recibido un documento HTML.',
                    ], 400);
                }
            }

            // Procesar los otros casos de número
            if ($request->numero == 11) {
                // Rechazar el sílabo
                Log::info('Rechazando sílabo con ID de carga docente: ' . $request->idCargaDocente);

                Silabo::where('idCargaDocente', $request->idCargaDocente)
                    ->where('idFilial', $request->idFilial)
                    ->where('idDocente', $request->idDocente)
                    ->update([
                        'estado' => 2,
                        'observaciones' => $request->observaciones,
                    ]);

                return response()->json([
                    'message' => 'El sílabo se rechazó correctamente.',
                ], 201);
            }

            if ($request->numero == 12) {
                // Aprobar el sílabo
                Log::info('Aprobando sílabo con ID de carga docente: ' . $request->idCargaDocente);

                Silabo::where('idCargaDocente', $request->idCargaDocente)
                    ->where('idFilial', $request->idFilial)
                    ->where('idDocente', $request->idDocente)
                    ->update([
                        'estado' => 3,
                        'observaciones' => $request->observaciones,
                    ]);

                return response()->json([
                    'message' => 'El sílabo se aprobó correctamente.',
                ], 201);
            }
        } catch (\Exception $e) {
            // Log del error
            Log::error('Error al crear el sílabo: ' . $e->getMessage());
            Log::error('Detalles del error: ' . $e->getTraceAsString());

            // Retornar una respuesta de error si algo sale mal
            return response()->json([
                'message' => 'Hubo un error al crear el sílabo.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function gestionarhorarios(Request $request)
    {
        try {
            // Log de entrada del Request
            Log::info('Request recibido en gestionarhorarios:', $request->all());

            // Validar los datos de entrada
            $validatedData = $request->validate([
                'idSemestreAcademico' => 'required|integer',
                'idFilial' => 'required|integer',
                'idEscuela' => 'required|integer',
                'documento' => 'nullable|string',
            ]);

            // Log de IDs proporcionados
            Log::info('IDs proporcionados:', [
                'idSemestreAcademico' => $validatedData['idSemestreAcademico'],
                'idFilial' => $validatedData['idFilial'],
                'idEscuela' => $validatedData['idEscuela'],
            ]);

            // Buscar horario existente usando las claves primarias compuestas
            $horario = Horario::where('idSemestreAcademico', $validatedData['idSemestreAcademico'])
                ->where('idFilial', $validatedData['idFilial'])
                ->where('idEscuela', $validatedData['idEscuela'])
                ->first();

            // Log del horario encontrado o no encontrado
            if ($horario) {
                Log::info('Horario encontrado:', $horario->toArray());
            } else {
                Log::warning('No se encontró el horario con los IDs proporcionados:', [
                    'idSemestreAcademico' => $validatedData['idSemestreAcademico'],
                    'idFilial' => $validatedData['idFilial'],
                    'idEscuela' => $validatedData['idEscuela'],
                ]);
            }

            if ($horario) {
                // Si el registro existe, realiza la actualización
                $horario->update([
                    'documento' => $validatedData['documento'] ?? null,
                ]);

                // Log después de la actualización
                Log::info('Horario actualizado con éxito:', $horario->toArray());

                return response()->json([
                    'message' => 'El horario se actualizó correctamente.',
                    'horario' => $horario,
                ], 200);
            } else {
                // Si no existe, retornar una respuesta indicando que no se encontró
                return response()->json([
                    'message' => 'No se encontró el horario especificado.',
                ], 404);
            }
        } catch (\Exception $e) {
            // Log del error capturado
            Log::error('Error al gestionar horarios:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Hubo un error al gestionar los horarios.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
