<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $user = User::create([
            "name" => "Fernando ",
            "lastname" => "Pantoja",
            "dni" => "25252525",
            "direccion" => "Direccion1",
            "foto" => "foto",
            "telefono" => "958745214",
            "email" => "t1053300121@unitru.edu.pe",
            "password" => bcrypt("root")
        ]);
    }
}
