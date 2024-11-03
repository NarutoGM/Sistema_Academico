<?php  

namespace Database\Seeders;  

use Illuminate\Database\Seeder;  
use App\Models\RegimenCurso;  

class RegimenCursoSeeder extends Seeder  
{  
    /**  
     * Run the database seeds.  
     */  
    public function run(): void  
    {  
        RegimenCurso::create(['nomRegimen' => 'Obligatorio']);  
        RegimenCurso::create(['nomRegimen' => 'Electivos']);  
        RegimenCurso::create(['nomRegimen' => 'Optativos']);  
    }  
}