<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SemestreAcademicoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semestresacademicos = [
            ['nomSemestre'=>'2024-I', 'añoAcademico'=>'2024', 'numSemestre'=>'I', 'fInicio'=>'2024-05-06 00:00:0','fTermino'=>'2024-08-30 00:00:00'],
            ['nomSemestre'=>'2024-II', 'añoAcademico'=>'2024', 'numSemestre'=>'II', 'fInicio'=>'2024-09-09 00:00:0','fTermino'=>'2024-12-27 00:00:00']
        ];

        // Insertar registros en la tabla semestreacademico
        DB::table('semestreacademico')->insert($semestresacademicos);
    }
}
