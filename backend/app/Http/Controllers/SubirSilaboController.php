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
                    ->get()
                    ->map(function ($carga) {
                        $silabo = Silabo::where('idCargaDocente', $carga->idCargaDocente)
                            ->where('idFilial', $carga->idFilial)
                            ->where('idDocente', $carga->idDocente)
                            ->first();


                        if (!$silabo) {
                            $carga->silabo = null;
                        } else {
                            $carga->silabo = $silabo;

                            // Obtén las semanas relacionadas manualmente
                            $semanas = Semana::where('idCargaDocente', $silabo->idCargaDocente)
                            ->where('idFilial', $silabo->idFilial)
                            ->where('idDocente', $silabo->idDocente)
                            ->orderBy('idSemana')  // Ordena por idSemana de forma ascendente (predeterminado)
                            ->get();
            

                            // Agrega las semanas al silabo como un atributo
                            $carga->silabo->semanas = $semanas;
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
    
    public function silaboReusar(Request $request)
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
                    ->where('idCurso', $request->idCurso)
                    ->where('estado', 0)
                    ->get()
                    ->map(function ($carga) {
                        $silabo = Silabo::where('idCargaDocente', $carga->idCargaDocente)
                            ->where('idFilial', $carga->idFilial)
                            ->where('idDocente', $carga->idDocente)
                            ->first();

                        if (!$silabo) {
                            $carga->silabo = null;
                        } else {
                            $carga->silabo = $silabo;

                            // Obtén las semanas relacionadas manualmente
                            $semanas = Semana::where('idCargaDocente', $silabo->idCargaDocente)
                            ->where('idFilial', $silabo->idFilial)
                            ->where('idDocente', $silabo->idDocente)
                            ->orderBy('idSemana')  // Ordena por idSemana de forma ascendente (predeterminado)
                            ->get();
            

                            // Agrega las semanas al silabo como un atributo
                            $carga->silabo->semanas = $semanas;
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
                        'curso' => function ($query) {
                            $query->with(['departamento', 'facultad', 'area', 'regimenCurso', 'tipoCurso']);
                        },
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
                        })
                        ->map(function ($carga) {
                            $silabo = Silabo::where('idCargaDocente', $carga->idCargaDocente)
                                ->where('idFilial', $carga->idFilial)
                                ->where('idDocente', $carga->idDocente)
                                ->where('estado', '!=', 0)
                                ->first();


                                $carga->silabo=null;
                                if ($silabo) {
    
                                    $carga->silabo = $silabo;
                                    $semanas = Semana::where('idCargaDocente', $silabo->idCargaDocente)
                                    ->where('idFilial', $silabo->idFilial)
                                    ->where('idDocente', $silabo->idDocente)
                                    ->orderBy('idSemana')  // Ordena por idSemana de forma ascendente (predeterminado)
                                    ->get();
                    
                                 
                                    $carga->silabo->semanas = $semanas;
                                }
                            return $carga; // Omite las cargas sin sílabo
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

    public function reportesilabos()
    {
        $user = auth()->user();
        $userId = $user ? $user->id : null;
        if ($userId) {

            $directorescuela = DirectorEscuela::where('id', $userId)->first();
            if ($directorescuela) {
                if ($directorescuela) {





                    $cargadocente = CargaDocente::with([
                        'filial',
                        'semestreAcademico:idSemestreAcademico,nomSemestre,fTermino,fInicio,fLimiteSilabo', // Selecciona solo los campos necesarios
                        'curso' => function ($query) {
                            $query->with(['departamento', 'facultad', 'area', 'regimenCurso', 'tipoCurso']);
                        },
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
                        })
                        ->map(function ($carga) {
                            $silabo = Silabo::where('idCargaDocente', $carga->idCargaDocente)
                                ->where('idFilial', $carga->idFilial)
                                ->where('idDocente', $carga->idDocente)
                                ->first();



                                if ($silabo) {
    
                                    $carga->silabo = $silabo;
                                    $semanas = Semana::where('idCargaDocente', $silabo->idCargaDocente)
                                    ->where('idFilial', $silabo->idFilial)
                                    ->where('idDocente', $silabo->idDocente)
                                    ->orderBy('idSemana')  // Ordena por idSemana de forma ascendente (predeterminado)
                                    ->get();
                    

                                    if ($silabo->estado == 1 && $silabo->activo == true) {
                                        $carga->curso->estado_silabo = "Esperando aprobación";
                                    } elseif ($silabo->estado == 3 && $silabo->activo == true) {
                                        $carga->curso->estado_silabo = "Visado";
                                        $carga->curso->observaciones = $silabo->observaciones;
    
                                    } elseif ($silabo->estado == 2 && $silabo->activo == true) {
                                        $carga->curso->estado_silabo = "Rechazado";
                                        $carga->curso->observaciones = $silabo->observaciones;
    
                                    }
    
                                    $carga->silabo->semanas = $semanas;
                                }else {
                                    // Si no existe un sílabo
                                    $carga->curso->estado_silabo = "Sin envio de silabo";
                                }

                                $user = auth()->user();
                                $carga->name = $user->name;
                                $carga->lastname = $user->lastname;
    
                            return $carga; // Omite las cargas sin sílabo
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
    public function reportesilabos2()
    {
        $user = auth()->user();
        $userId = $user ? $user->id : null;
        if ($userId) {

            $directorescuela = DirectorEscuela::where('id', $userId)->first();
            if ($directorescuela) {
                if ($directorescuela) {





                    $cargadocente = CargaDocente::with([
                        'filial',
                        'semestreAcademico:idSemestreAcademico,nomSemestre,fTermino,fInicio,fLimiteSilabo', // Selecciona solo los campos necesarios
                        'curso' => function ($query) {
                            $query->with(['departamento', 'facultad', 'area', 'regimenCurso', 'tipoCurso']);
                        },
                        'escuela:idEscuela,name',
                    ])
                        ->where('idDirector', $directorescuela->idDirector)
                        ->where('idSemestreAcademico', 2)
                        ->where('estado', true)
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
                        })
                        ->map(function ($carga) {
                            $silabo = Silabo::where('idCargaDocente', $carga->idCargaDocente)
                                ->where('idFilial', $carga->idFilial)
                                ->where('idDocente', $carga->idDocente)
                                ->where('estado', '!=', 0)
                                ->first();


                                $carga->silabo=null;
                                if ($silabo) {
    
                                    $carga->silabo = $silabo;                                  
                                }
                            return $carga; // Omite las cargas sin sílabo
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
                    'semestreAcademico:idSemestreAcademico,nomSemestre,fTermino,fInicio,fLimiteSilabo', // Selecciona solo los campos necesarios
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
            // Log inicial para depuración
            Log::info("Datos recibidos: ", $request->all());

            // Validar los datos del request
            $validatedData = $request->validate([
                'idCargaDocente' => 'required|integer',
                'idFilial' => 'required|integer',
                'idDocente' => 'required|integer',
                'silabo.sumilla' => 'nullable|string',
                'silabo.unidadcompetencia' => 'nullable|string',
                'silabo.competenciasgenerales' => 'nullable|string',
                'silabo.resultados' => 'nullable|string',
                'silabo.capacidadesterminales1' => 'nullable|string',
                'silabo.capacidadesterminales2' => 'nullable|string',
                'silabo.capacidadesterminales3' => 'nullable|string',
                'silabo.resultadosaprendizajes1' => 'nullable|string',
                'silabo.resultadosaprendizajes2' => 'nullable|string',
                'silabo.resultadosaprendizajes3' => 'nullable|string',
                'silabo.sistemaevaluacion' => 'nullable|string',
                'silabo.infosistemaevaluacion' => 'nullable|string',
                'silabo.tutoria' => 'nullable|string',
                'silabo.referencias' => 'nullable|string',
                'silabo.semanas' => 'nullable|array',
                'silabo.semanas.*.organizacion' => 'nullable|string',
                'silabo.semanas.*.estrategias' => 'nullable|string',
                'silabo.semanas.*.evidencias' => 'nullable|string',
                'silabo.semanas.*.instrumentos' => 'nullable|string',
                'silabo.semanas.*.nomSem' => 'nullable|string',
            ]);




            // Buscar el sílabo existente
            $silabo = Silabo::where('idCargaDocente', $request->idCargaDocente)
                ->where('idFilial', $request->idFilial)
                ->where('idDocente', $request->idDocente)
                ->first();

            if ($silabo) {
                // Actualizar el registro existente
                Silabo::where('idCargaDocente', $request->idCargaDocente)
                    ->where('idFilial', $request->idFilial)
                    ->where('idDocente', $request->idDocente)
                    ->delete();


                    $silabo = Silabo::create(array_merge(
                        [
                            'idCargaDocente' => $request->idCargaDocente,
                            'idFilial' => $request->idFilial,
                            'idDocente' => $request->idDocente,
                            'idDirector' => $request->idDirector,
                            'activo' => true, // Valor booleano directamente
                            'estado' => 1 ,// Valor booleano directamente
                            'fEnvio' => Carbon::now() // Valor booleano directamente

                        ],
                        $validatedData['silabo']
                    ));


                $silaboData = $validatedData['silabo'];

                // Actualizar o crear 16 semanas académicas
                Semana::where('idCargaDocente', $request->idCargaDocente)
                    ->where('idFilial', $request->idFilial)
                    ->where('idDocente', $request->idDocente)
                    ->delete();

                if (!empty($silaboData['semanas']) && count($silaboData['semanas']) >= 16) {
                    for ($idSemana = 1; $idSemana <= 16; $idSemana++) {
                        $semanaData = $silaboData['semanas'][$idSemana - 1] ?? [];
                        Semana::create(array_merge([
                            'idSemana' => $idSemana,
                            'idCargaDocente' => $request->idCargaDocente,
                            'idFilial' => $request->idFilial,
                            'idDocente' => $request->idDocente,
                        ], $semanaData));
                    }
                }

                $message = 'El sílabo se actualizó correctamente.';
                Log::info("Sílabo actualizado: ", $silabo->toArray());
            } else {
                // Crear un nuevo registro si no existe
                $silabo = Silabo::create(array_merge(
                    [
                        'idCargaDocente' => $request->idCargaDocente,
                        'idFilial' => $request->idFilial,
                        'idDocente' => $request->idDocente,
                        'idDirector' => $request->idDirector,
                        'activo' => true, // Valor booleano directamente
                        'estado' => 1, // Valor booleano directamente
                        'fEnvio' => Carbon::now() // Valor booleano directamente

                    ],
                    $validatedData['silabo']
                ));


                $silaboData = $validatedData['silabo'];

                // Crear 16 semanas académicas
                if (!empty($silaboData['semanas']) && count($silaboData['semanas']) >= 16) {
                    for ($idSemana = 1; $idSemana <= 16; $idSemana++) {
                        $semanaData = $silaboData['semanas'][$idSemana - 1] ?? [];
                        Semana::create(array_merge([
                            'idSemana' => $idSemana,
                            'idCargaDocente' => $request->idCargaDocente,
                            'idFilial' => $request->idFilial,
                            'idDocente' => $request->idDocente,
                        ], $semanaData));
                    }
                }

                // Mensaje de éxito
                $message = 'El sílabo se creó correctamente, junto con sus 16 semanas académicas.';
                Log::info("Sílabo creado: ", $silabo->toArray());

                $message = 'El sílabo se creó correctamente. + sus 16 semanas academicas';
                Log::info("Sílabo creado: ", $silabo->toArray());
            }

            // Retornar respuesta exitosa
            return response()->json([
                'message' => $message,
                'silabo' => $silabo,
            ], 200);
        } catch (\Exception $e) {
            // Log del error
            Log::error('Error al procesar el sílabo: ' . $e->getMessage());
            Log::error('Detalles del error: ' . $e->getTraceAsString());

            // Retornar respuesta de error
            return response()->json([
                'message' => 'Hubo un error al procesar el sílabo.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function gestionarsilabodirector(Request $request)
    {
        try {
            // Validar la solicitud
            $validatedData = $request->validate([
                'idCargaDocente' => 'required|integer',
                'idFilial' => 'required|integer',
                'idDocente' => 'required|integer',
                'numero' => 'required|integer',
                'observaciones' => 'nullable|string',
            ]);
            $numero=$request->numero + 1;
            // Actualizar el sílabo directamente en la base de datos
            $updatedRows = Silabo::where('idCargaDocente', $validatedData['idCargaDocente'])
                ->where('idFilial', $validatedData['idFilial'])
                ->where('idDocente', $validatedData['idDocente'])
                ->update([
                    'estado' => $numero,
                    'observaciones' => $validatedData['observaciones'] ?? null,
                ]);
    
            // Verificar si se actualizó algún registro
            if ($updatedRows === 0) {
                return response()->json([
                    'message' => 'Sílabo no encontrado o no se realizaron cambios.',
                ], 404);
            }
    
            return response()->json([
                'message' => 'Sílabo actualizado correctamente.',
            ], 200);
        } catch (\Exception $e) {
            // Log del error
            Log::error('Error al procesar el sílabo: ' . $e->getMessage());
            Log::error('Detalles del error: ' . $e->getTraceAsString());
    
            // Retornar respuesta de error
            return response()->json([
                'message' => 'Hubo un error al procesar el sílabo.',
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
