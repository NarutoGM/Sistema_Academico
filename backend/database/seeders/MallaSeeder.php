<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MallaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mallas = [
        ];

        for ($i = 1; $i <= 43; $i++) {
            $mallas[] = [
                'idMalla' => $i,
                'idEscuela' => 0 + $i, // Inicia desde 30 hasta 43
                'año' => '2018',
                'estado' => true
            ];
        }
        // Insertar registros en la tabla malla
        DB::table('malla')->insert($mallas);
    }
}
