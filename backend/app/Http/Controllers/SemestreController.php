<?php

namespace App\Http\Controllers;

use App\Models\SemestreAcademico;

class SemestreController extends Controller
{
    public function index()
    {
        try {
            $semestres = SemestreAcademico::all(['idSemestreAcademico',
             'nomSemestre', 'añoAcademico', 'numSemestre', 'fInicio', 'fTermino']);
            return response()->json($semestres, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los semestres académicos'], 500);
        }
    }
}