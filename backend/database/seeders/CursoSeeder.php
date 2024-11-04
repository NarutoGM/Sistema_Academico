<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CursoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cursos = [
            ['idCurso' => 3316, 'name' => 'Introducción a la Ingeniería de Sistemas', 'creditos' => 2, 'hTeoricas' => 3, 'hPracticas' => 2, 'hLaboratorio' => 0, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 1, 'nGrupos' => 0, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 3314, 'name' => 'Introducción a la programación', 'creditos' => 3, 'hTeoricas' => 1, 'hPracticas' => 0, 'hLaboratorio' => 2, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 1, 'nGrupos' => 3, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 3315, 'name' => 'Introducción a la programación Avanzada', 'creditos' => 3, 'hTeoricas' => 1, 'hPracticas' => 0, 'hLaboratorio' => 2, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 1, 'nGrupos' => 3, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 2051, 'name' => 'Programación Orientada a Objetos I', 'creditos' => 4, 'hTeoricas' => 2, 'hPracticas' => 0, 'hLaboratorio' => 4, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 1, 'nGrupos' => 3, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 1888, 'name' => 'Taller de Manejo de Tic', 'creditos' => 1, 'hTeoricas' => 0, 'hPracticas' => 2, 'hLaboratorio' => 0, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 2, 'nGrupos' => 3, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 3],
            ['idCurso' => 2142, 'name' => 'Estadística Aplicada', 'creditos' => 3, 'hTeoricas' => 1, 'hPracticas' => 2, 'hLaboratorio' => 2, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 3, 'nGrupos' => 1, 'idDepartamento' => 2, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 2145, 'name' => 'Programación Orientada a Objetos II', 'creditos' => 4, 'hTeoricas' => 2, 'hPracticas' => 0, 'hLaboratorio' => 4, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 1, 'nGrupos' => 1, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 2654, 'name' => 'Sistemas Digitales', 'creditos' => 3, 'hTeoricas' => 1, 'hPracticas' => 2, 'hLaboratorio' => 2, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 1, 'nGrupos' => 1, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 2655, 'name' => 'Estructura de Datos Orientada a Objetos', 'creditos' => 4, 'hTeoricas' => 2, 'hPracticas' => 1, 'hLaboratorio' => 3, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 1, 'nGrupos' => 3, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 2656, 'name' => 'Computación Gráfica y Visual', 'creditos' => 3, 'hTeoricas' => 1, 'hPracticas' => 1, 'hLaboratorio' => 3, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 2, 'nGrupos' => 3, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 2693, 'name' => 'Arquitectura y Organización de Computadoras', 'creditos' => 3, 'hTeoricas' => 1, 'hPracticas' => 2, 'hLaboratorio' => 2, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 1, 'nGrupos' => 3, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 3126, 'name' => 'Sistemas Inteligentes', 'creditos' => 3, 'hTeoricas' => 1, 'hPracticas' => 2, 'hLaboratorio' => 2, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 1, 'nGrupos' => 3, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1],
            ['idCurso' => 3448, 'name' => 'Redes y Comunicaciones I', 'creditos' => 3, 'hTeoricas' => 1, 'hPracticas' => 1, 'hLaboratorio' => 3, 'hRetroalimentacion' => 1, 'prerequisitos' => null, 'idTipoCurso' => 1, 'nGrupos' => 3, 'idDepartamento' => 7, 'idFacultad' => 11, 'idArea' => 1, 'idRegimenCurso' => 1]
        ];
        
        // Arellano,Santos,Zoraida,Tapia,Agreda...

        // Insertar registros en la tabla cursos
        DB::table('curso')->insert($cursos);
    }
}
