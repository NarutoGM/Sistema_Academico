<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlanCursoAcademicoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $planescursosacademicos = [
            ['idCurso'=>3316, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'I', 'estado'=>true],
            ['idCurso'=>3314, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'I', 'estado'=>true],
            ['idCurso'=>3315, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'I', 'estado'=>true],

            ['idCurso'=>2051, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'II', 'estado'=>true],
            ['idCurso'=>1888, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'II', 'estado'=>true],

            ['idCurso'=>2142, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'III', 'estado'=>true],
            ['idCurso'=>2145, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'III', 'estado'=>true],

            ['idCurso'=>2654, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'IV', 'estado'=>true],
            ['idCurso'=>2655, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'IV', 'estado'=>true],
            ['idCurso'=>2656, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'IV', 'estado'=>true],

            ['idCurso'=>2693, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'V', 'estado'=>true],

            ['idCurso'=>3126, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'VI', 'estado'=>true],

            ['idCurso'=>3448, 'idMalla'=>35, 'idEscuela'=>35,  'ciclo'=>'VII', 'estado'=>true],
        ];

        // Insertar registros en la tabla malla
        DB::table('plancursoacademico')->insert($planescursosacademicos);
    }
}
