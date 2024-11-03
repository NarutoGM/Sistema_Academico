<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoCursoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiposCurso = [
            ['descripcion' => 'Especialidad'],
            ['descripcion' => 'Electivo'],
            ['descripcion' => 'General'],
        ];

        // Insertar los tipos de curso en la tabla tipocurso
        DB::table('tipocurso')->insert($tiposCurso);
    }
}
