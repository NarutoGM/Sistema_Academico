<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FilialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('filial')->insert([
            ['name' => 'Filial Trujillo'],
            ['name' => 'Filial Huamachuco'],
            ['name' => 'Filial Valle Jequetepeque'],
            ['name' => 'Filial Santiago de Chuco']
        ]);
    }
}
