<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartamentoAcademicoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departamentos = [
            ['nomDepartamento' => 'Administración'],
            ['nomDepartamento' => 'Estadística'],
            ['nomDepartamento' => 'Ingeniería Industrial'],
            ['nomDepartamento' => 'Física'],
            ['nomDepartamento' => 'Matemática'],
            ['nomDepartamento' => 'Ciencias Psicológicas'],
            ['nomDepartamento' => 'Ingeniería de Sistemas'],
            ['nomDepartamento' => 'Ingeniería Química'],
        ];

        // Insertar registros en la tabla departamentoacademico
        DB::table('departamentoacademico')->insert($departamentos);
    }
}
