<?php

namespace App\Http\Controllers;

use App\Models\CargaDocente;
use App\Models\DirectorEscuela;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

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

                            $carga->curso->documento="";

                        }else{

                            $carga->curso->documento=$silabo->documento;

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

                        if ($silabo) {


                            if ($silabo->activo == false) {
                                $carga->curso->estado_silabo = "Inactivo";
                            }elseif ($silabo->estado == 1 && $silabo->activo == true) {
                                $carga->curso->estado_silabo = "En espera de aprobación";
                            } elseif ($silabo->estado == 3 && $silabo->activo == true) {
                                $carga->curso->estado_silabo = "Aprobado";
                            } elseif ($silabo->estado == 2 && $silabo->activo == true) {
                                $carga->curso->estado_silabo = "Rechazado";
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







    public function gestionarsilabo(Request $request)
    {
        try {
            // Validar los datos entrantes
            $request->validate([
                'idCargaDocente' => 'required|integer',
                'idDocente' => 'required|integer',
                'idFilial' => 'required|integer',
                'documento' => 'nullable|string',
                'idDirector' => 'required|integer',
            ]);
    
            // Crear el registro en la base de datos
            $silabo = Silabo::create([
                'idCargaDocente' => $request->idCargaDocente,
                'idDocente' => $request->idDocente,
                'idFilial' => $request->idFilial,
                'documento' => $request->documento,
                'activo' => 1,
                'estado' => 0,
                'idDirector' => $request->idDirector,
            ]);
    
            // Retornar una respuesta de éxito
            return response()->json([
                'message' => 'El sílabo se creó correctamente.',
                'silabo' => $silabo,
            ], 201);
    
        } catch (\Exception $e) {
            // Retornar una respuesta de error si algo sale mal
            return response()->json([
                'message' => 'Hubo un error al crear el sílabo.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    







    
    
}
