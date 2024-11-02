<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CursoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cursos = [
            ['name' => 'Introducción a la Ingeniería de Sistemas', 'creditos'=>2, 'hTeoricas'=>3, 'hPracticas'=>2, 'hLaboratorio'=>0, 'idTipoCurso'=>1, 'nGrupos'=>1, 'idDepartamento'=>7], //ING. SANTOS
            ['name' => 'Iantroducción a la Programación', 'creditos'=>3, 'hTeoricas'=>1, 'hPracticas'=>0, 'hLaboratorio'=>2, 'idTipoCurso'=>1, 'nGrupos'=>1, 'idDepartamento'=>7], //ING. ZORAIDA
            ['name' => 'Estadística General', 'creditos'=>4, 'hTeoricas'=>2, 'hPracticas'=>4, 'hLaboratorio'=>0, 'idTipoCurso'=>3, 'nGrupos'=>1, 'idDepartamento'=>2], //ING. CARLOS DANTER TAPIA
            ['name' => 'Programación Orientada a Objetos I', 'creditos'=>4, 'hTeoricas'=>2, 'hPracticas'=>0, 'hLaboratorio'=>4, 'idTipoCurso'=>1, 'nGrupos'=>1, 'idDepartamento'=>7], //ING. ZORAIDA
            ['name' => 'Taller de Manejo de Tic', 'creditos'=>1, 'hTeoricas'=>0, 'hPracticas'=>2, 'hLaboratorio'=>0, 'idTipoCurso'=>2, 'nGrupos'=>1, 'idDepartamento'=>7], //ING. MARCELINO
            ['name' => 'Estadística Aplicada', 'creditos'=>3, 'hTeoricas'=>1, 'hPracticas'=>2, 'hLaboratorio'=>2, 'idTipoCurso'=>3, 'nGrupos'=>1, 'idDepartamento'=>2], //ING. CARLOS DANTER TAPIA
            ['name' => 'Programación Orientada a Objetos II', 'creditos'=>4, 'hTeoricas'=>2, 'hPracticas'=>0, 'hLaboratorio'=>4, 'idTipoCurso'=>1, 'nGrupos'=>1, 'idDepartamento'=>7], //ING. ZORAIDA
            ['name' => 'Sistemas Digitales', 'creditos'=>3, 'hTeoricas'=>1, 'hPracticas'=>2, 'hLaboratorio'=>2, 'idTipoCurso'=>1, 'nGrupos'=>1, 'idDepartamento'=>7], //ING. ARELLANO
            ['name' => 'Estructura de Datos Orientada a Objetos', 'creditos'=>4, 'hTeoricas'=>2, 'hPracticas'=>1, 'hLaboratorio'=>3, 'idTipoCurso'=>1, 'nGrupos'=>1, 'idDepartamento'=>7], //ING. MARCELINO
            ['name' => 'Computación Gráfica y Visual', 'creditos'=>3, 'hTeoricas'=>1, 'hPracticas'=>1, 'hLaboratorio'=>3, 'idTipoCurso'=>2, 'nGrupos'=>1, 'idDepartamento'=>7], //ING. MARCELINO
            ['name' => 'Arquitectura y Organización de Computadoras', 'creditos'=>3, 'hTeoricas'=>1, 'hPracticas'=>2, 'hLaboratorio'=>2, 'idTipoCurso'=>1, 'nGrupos'=>1, 'idDepartamento'=>7], //ING. ARELLANO
            ['name' => 'Sistemas Inteligentes', 'creditos'=>3, 'hTeoricas'=>1, 'hPracticas'=>2, 'hLaboratorio'=>2, 'idTipoCurso'=>1, 'nGrupos'=>1, 'idDepartamento'=>7], //ING. MARCELINO
            ['name' => 'Redes y Comunicaciones I', 'creditos'=>3, 'hTeoricas'=>1, 'hPracticas'=>1, 'hLaboratorio'=>3, 'idTipoCurso'=>1, 'nGrupos'=>1, 'idDepartamento'=>7] //ING. ARELLANO
        ];

        // Insertar registros en la tabla cursos
        DB::table('curso')->insert($cursos);
    }
}
