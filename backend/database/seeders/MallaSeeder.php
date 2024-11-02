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
            ['idMalla'=>1, 'idEscuela'=>30, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>31, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>32, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>33, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>34, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>35, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>36, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>37, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>38, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>39, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>40, 'año'=>'2018', 'estado'=>true],
            ['idMalla'=>1, 'idEscuela'=>41, 'año'=>'2018', 'estado'=>true],
        ];

        // Insertar registros en la tabla malla
        DB::table('malla')->insert($mallas);
    }
}
