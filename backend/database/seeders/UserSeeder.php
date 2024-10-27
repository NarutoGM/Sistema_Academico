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
        
    /**    $user = User::create([
            *      "name" => "George",
            *      "email" => "georgeacp@gmail.com",
            *     "password" => bcrypt("root")
            *  ]);
        */
        $user = User::create([
            "name" => "Luis Fernando",
            "lastname" => "Avila Reyes",
            "dni" => "71328707",
            "direccion" => "Direccion1",
            "foto" => "foto",
            "telefono" => "987456123",
            "email" => "t1013300721@unitru.edu.pe",
            "password" => bcrypt("root")
        ]);
    }
}
