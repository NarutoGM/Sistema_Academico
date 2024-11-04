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
        
        // $user = User::create([
        //     "name" => "Fernando ",
        //     "lastname" => "Pantoja",
        //     "dni" => "25252525",
        //     "direccion" => "Direccion1",
        //     "foto" => "foto",
        //     "telefono" => "958745214",
        //     "email" => "t1053300121@unitru.edu.pe",
        //     "password" => bcrypt("root")
        // ]);

      //  $user = User::create([
      //      "name" => "George",
      //      "lastname" => "Castle",
      //      "dni" => "87654321",
      //      "direccion" => "Direccion2",
      //      "foto" => "foto",
      //      "telefono" => "958745214",
      //      "email" => "georgeacp@gmail.com",
      //      "password" => bcrypt("root")
      //  ]);

     //    $user = User::create([
       //      "name" => "MARCELINO",
      //       "lastname" => "TORRES VILLANUEVA",
        //     "dni" => "47584155",
       //      "direccion" => "Direccion2",
        //     "foto" => "foto",
        //     "telefono" => "988457845",
        //     "email" => "mtorres@unitru.edu.pe",
       //      "password" => bcrypt("root")
       //  ]);


     //    $user = User::create([
      //       "name" => "CESAR",
       //      "lastname" => "ARELLANO SALAZAR",
       //      "dni" => "74153625",
       //      "direccion" => "Direccion2",
       //      "foto" => "foto",
       //      "telefono" => "988457845",
       //      "email" => "carellano@unitru.edu.pe",
       //      "password" => bcrypt("root")
        // ]);
 //
 
   //      $user = User::create([
     //        "name" => "JUAN PEDRO",
     //        "lastname" => "SANTOS FERNANDEZ",
      //       "dni" => "47251495",
      //       "direccion" => "Direccion2",
      //       "foto" => "foto",
      //       "telefono" => "988457845",
      //       "email" => "jsantos@unitru.edu.pe",
       //      "password" => bcrypt("root")
       // ]);

     //   $user = User::create([
     //       "name" => "DAVID",
     //       "lastname" => "AGREDA",
     //       "dni" => "41257651",
     //       "direccion" => "Direccion2",
     //       "foto" => "foto",
       //     "telefono" => "988457845",
      //      "email" => "davidagreda@unitru.edu.pe",
      //      "password" => bcrypt("root")
     //   ]);
      //  $user = User::create([
     //       "name" => "ZORAIDA",
      //      "lastname" => "MELGAREJO",
     //       "dni" => "45124578",
      //      "direccion" => "Direccion2",
      //      "foto" => "foto",
      //      "telefono" => "988457845",
      //      "email" => "zoraidamergarejo@unitru.edu.pe",
      //      "password" => bcrypt("root")
      //  ]);

        $user = User::create([
            "name" => "CARLOS DANTER",
            "lastname" => "TAPIA SANCHEZ",
            "dni" => "25361449",
            "direccion" => "Direccion2",
            "foto" => "foto",
            "telefono" => "988457845",
            "email" => "cdantertapia@unitru.edu.pe",
            "password" => bcrypt("root")
        ]);

    }
}
