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
            "name" => "Guliana",
            "lastname" => "Lulichac",
            "dni" => "77777777",
            "direccion" => "Direccion1",
            "foto" => "foto",
            "telefono" => "938578576",
            "email" => "t033300220@unitru.edu.pe",
            "password" => bcrypt("root")
        ]);
    }
}
