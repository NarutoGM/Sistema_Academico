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
            ['idMalla'=>1, 'idCurso'=>1, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'I', 'estado'=>true],
            ['idMalla'=>1, 'idCurso'=>2, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'I', 'estado'=>true],
            ['idMalla'=>1, 'idCurso'=>3, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'I', 'estado'=>true],

            ['idMalla'=>1, 'idCurso'=>4, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'II', 'estado'=>true],
            ['idMalla'=>1, 'idCurso'=>5, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'II', 'estado'=>true],

            ['idMalla'=>1, 'idCurso'=>6, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'III', 'estado'=>true],
            ['idMalla'=>1, 'idCurso'=>7, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'III', 'estado'=>true],

            ['idMalla'=>1, 'idCurso'=>8, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'IV', 'estado'=>true],
            ['idMalla'=>1, 'idCurso'=>9, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'IV', 'estado'=>true],
            ['idMalla'=>1, 'idCurso'=>10, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'IV', 'estado'=>true],

            ['idMalla'=>1, 'idCurso'=>11, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'V', 'estado'=>true],

            ['idMalla'=>1, 'idCurso'=>12, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'VI', 'estado'=>true],

            ['idMalla'=>1, 'idCurso'=>13, 'idEscuela'=>35, 'periodo'=>'2024', 'ciclo'=>'VII', 'estado'=>true],
        ];

        // Insertar registros en la tabla malla
        DB::table('plancursoacademico')->insert($planescursosacademicos);
    }
}
