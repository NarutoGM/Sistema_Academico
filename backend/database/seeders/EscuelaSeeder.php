<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Escuela;

class EscuelaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $escuelas = [
            // Facultad de Ciencias Agropecuarias (ID = 1)
            ['name' => 'Agronomía', 'idFacultad' => 1],
            ['name' => 'Zootecnia', 'idFacultad' => 1],

            // Facultad de Ciencias Biológicas (ID = 2)
            ['name' => 'Ciencias Biológicas', 'idFacultad' => 2],
            ['name' => 'Biología Pesquera', 'idFacultad' => 2],
            ['name' => 'Microbiología y Parasitología', 'idFacultad' => 2],

            // Facultad de Ciencias Económicas (ID = 3)
            ['name' => 'Economía', 'idFacultad' => 3],
            ['name' => 'Administración', 'idFacultad' => 3],
            ['name' => 'Contabilidad y Finanzas', 'idFacultad' => 3],

            // Facultad de Ciencias Físicas y Matemáticas (ID = 4)
            ['name' => 'Física', 'idFacultad' => 4],
            ['name' => 'Matemáticas', 'idFacultad' => 4],
            ['name' => 'Estadística', 'idFacultad' => 4],

            // Facultad de Ciencias Sociales (ID = 5)
            ['name' => 'Antropología', 'idFacultad' => 5],
            ['name' => 'Arqueología', 'idFacultad' => 5],
            ['name' => 'Trabajo Social', 'idFacultad' => 5],
            ['name' => 'Turismo', 'idFacultad' => 5],

            // Facultad de Derecho y Ciencias Políticas (ID = 6)
            ['name' => 'Derecho', 'idFacultad' => 6],
            ['name' => 'Ciencias Políticas y Gobernabilidad', 'idFacultad' => 6],

            // Facultad de Educación y Ciencias de la Comunicación (ID = 7)
            ['name' => 'Ciencias de la Comunicación', 'idFacultad' => 7],
            ['name' => 'Educación Inicial', 'idFacultad' => 7],
            ['name' => 'Educación Primaria', 'idFacultad' => 7],
            ['name' => 'Educación Secundaria: Mención en Idiomas', 'idFacultad' => 7],
            ['name' => 'Educación Secundaria: Mención en Ciencias Matemáticas', 'idFacultad' => 7],
            ['name' => 'Educación Secundaria: Mención en Lengua y Literatura', 'idFacultad' => 7],
            ['name' => 'Educación Secundaria: Mención en Ciencias Naturales, Física, Química y Biología', 'idFacultad' => 7],
            ['name' => 'Educación Secundaria: Mención en Filosofía, Psicología y Ciencias Sociales', 'idFacultad' => 7],
            ['name' => 'Educación Secundaria: Mención en Historia y Geografía', 'idFacultad' => 7],

            // Facultad de Enfermería (ID = 8)
            ['name' => 'Enfermería', 'idFacultad' => 8],

            // Facultad de Estomatología (ID = 9)
            ['name' => 'Estomatología', 'idFacultad' => 9],

            // Facultad de Farmacia y Bioquímica (ID = 10)
            ['name' => 'Farmacia y Bioquímica', 'idFacultad' => 10],

            // Facultad de Ingeniería (ID = 11)
            ['name' => 'Ingeniería Civil', 'idFacultad' => 11],
            ['name' => 'Ingeniería Agrícola', 'idFacultad' => 11],
            ['name' => 'Ingeniería Agroindustrial', 'idFacultad' => 11],
            ['name' => 'Ingeniería Ambiental', 'idFacultad' => 11],
            ['name' => 'Ingeniería de Materiales', 'idFacultad' => 11],
            ['name' => 'Ingeniería de Sistemas', 'idFacultad' => 11],
            ['name' => 'Ingeniería Industrial', 'idFacultad' => 11],
            ['name' => 'Ingeniería Mecánica', 'idFacultad' => 11],
            ['name' => 'Ingeniería Mecatrónica', 'idFacultad' => 11],
            ['name' => 'Ingeniería Metalúrgica', 'idFacultad' => 11],
            ['name' => 'Ingeniería de Minas', 'idFacultad' => 11],
            ['name' => 'Informática', 'idFacultad' => 11], // Agregado Informática

            // Facultad de Ingeniería Química (ID = 12)
            ['name' => 'Ingeniería Química', 'idFacultad' => 12],

            // Facultad de Medicina (ID = 13)
            ['name' => 'Medicina', 'idFacultad' => 13],
        ];

        foreach ($escuelas as $escuela) {
            Escuela::create($escuela);
        }
    }
}
