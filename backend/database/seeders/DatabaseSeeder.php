<?php

namespace Database\Seeders;

use App\Models\Condicion;
use App\Models\Facultad;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserSeeder::class);
        $this->call(DepartamentoAcademicoSeeder::class);
        $this->call(FacultadSeeder::class);
        $this->call(EscuelaSeeder::class);
        $this->call(CategoriaSeeder::class);
        $this->call(CondicionSeeder::class);
        $this->call(FilialSeeder::class);
        $this->call(RegimenSeeder::class);
        $this->call(TipoCursoSeeder::class);

    }
}
