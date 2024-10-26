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
            "name" => "Fernando Olivert",
            "lastname" => "Pantoja Payajo",
            "dni" => "75845214",
            "direccion" => "Direccion1",
            "foto" => "foto",
            "email" => "t1053300121@unitru.edu.pe",
            "password" => bcrypt("root")
        ]);
    }
}
