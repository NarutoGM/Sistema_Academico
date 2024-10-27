<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Facultad;

class FacultadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $facultades = [
            'Facultad de Ciencias Agropecuarias',
            'Facultad de Ciencias Biológicas',
            'Facultad de Ciencias Económicas',
            'Facultad de Ciencias Físicas y Matemáticas',
            'Facultad de Ciencias Sociales',
            'Facultad de Derecho y Ciencias Políticas',
            'Facultad de Educación y Ciencias de la Comunicación',
            'Facultad de Enfermería',
            'Facultad de Estomatología',
            'Facultad de Farmacia y Bioquímica',
            'Facultad de Ingeniería',
            'Facultad de Ingeniería Química',
            'Facultad de Medicina',
        ];

        foreach ($facultades as $nombre) {
            Facultad::create(['nomFacultad' => $nombre]);
        }
    }
}
