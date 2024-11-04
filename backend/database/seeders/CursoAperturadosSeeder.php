<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CursoAperturadosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // solo del semestre 2 registrados ya que es el semestre activo
    $cursosaperturados = [
        ['idSemestreAcademico'=>1, 'idMalla'=>35, 'idCurso'=>3316, 'idEscuela'=>35, 'estado'=>false],
        ['idSemestreAcademico'=>2, 'idMalla'=>35, 'idCurso'=>3314, 'idEscuela'=>35, 'estado'=>false],
        ['idSemestreAcademico'=>1, 'idMalla'=>35, 'idCurso'=>3315, 'idEscuela'=>35, 'estado'=>false],

        ['idSemestreAcademico'=>2, 'idMalla'=>35, 'idCurso'=>2051, 'idEscuela'=>35, 'estado'=>true],
        ['idSemestreAcademico'=>1, 'idMalla'=>35, 'idCurso'=>1888, 'idEscuela'=>35, 'estado'=>true],

        ['idSemestreAcademico'=>2, 'idMalla'=>35, 'idCurso'=>2142, 'idEscuela'=>35, 'estado'=>false],
        ['idSemestreAcademico'=>1, 'idMalla'=>35, 'idCurso'=>2145, 'idEscuela'=>35, 'estado'=>false],

        ['idSemestreAcademico'=>2, 'idMalla'=>35, 'idCurso'=>2654, 'idEscuela'=>35, 'estado'=>true],
        ['idSemestreAcademico'=>1, 'idMalla'=>35, 'idCurso'=>2655, 'idEscuela'=>35, 'estado'=>true],
        ['idSemestreAcademico'=>2, 'idMalla'=>35, 'idCurso'=>2656, 'idEscuela'=>35, 'estado'=>true],

        ['idSemestreAcademico'=>1, 'idMalla'=>35, 'idCurso'=>2693, 'idEscuela'=>35, 'estado'=>false],
        ['idSemestreAcademico'=>2, 'idMalla'=>35, 'idCurso'=>3126, 'idEscuela'=>35, 'estado'=>true],
        ['idSemestreAcademico'=>1, 'idMalla'=>35, 'idCurso'=>3448, 'idEscuela'=>35, 'estado'=>false],
        

    ];

            // Insertar registros en la tabla cursosaperturados
            DB::table('cursosaperturados')->insert($cursosaperturados);

    }
}
