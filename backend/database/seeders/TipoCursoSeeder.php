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
            ['descripcion' => 'Especialidad', 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Electivo', 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'General', 'created_at' => now(), 'updated_at' => now()],
        ];

        // Insertar los tipos de curso en la tabla tipocurso
        DB::table('tipocurso')->insert($tiposCurso);
    }
}
