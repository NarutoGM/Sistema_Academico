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
        ['idSemestreAcademico'=>2, 'idMalla'=>1, 'idCurso'=>4, 'idEscuela'=>35, 'estado'=>true],
        ['idSemestreAcademico'=>2, 'idMalla'=>1, 'idCurso'=>5, 'idEscuela'=>35, 'estado'=>true],
    
        ['idSemestreAcademico'=>2, 'idMalla'=>1, 'idCurso'=>8, 'idEscuela'=>35, 'estado'=>true],
        ['idSemestreAcademico'=>2, 'idMalla'=>1, 'idCurso'=>9, 'idEscuela'=>35, 'estado'=>true],
        ['idSemestreAcademico'=>2, 'idMalla'=>1, 'idCurso'=>10, 'idEscuela'=>35, 'estado'=>true],

        ['idSemestreAcademico'=>2, 'idMalla'=>1, 'idCurso'=>12, 'idEscuela'=>35, 'estado'=>true],
    ];

            // Insertar registros en la tabla cursosaperturados
            DB::table('cursosaperturados')->insert($cursosaperturados);

    }
}
