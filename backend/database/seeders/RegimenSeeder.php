<?php  

namespace Database\Seeders;  

use Illuminate\Database\Seeder;  
use App\Models\Regimen;  

class RegimenSeeder extends Seeder  
{  
    /**  
     * Run the database seeds.  
     */  
    public function run(): void  
    {  
        Regimen::create(['nombreRegimen' => 'Docente Ordinario']);  
        Regimen::create(['nombreRegimen' => 'Docente Extraordinario']);  
        Regimen::create(['nombreRegimen' => 'Docente Contratado']);  
        Regimen::create(['nombreRegimen' => 'Docente a Tiempo Parcial']);  
        Regimen::create(['nombreRegimen' => 'Docente a Tiempo Completo']);  
    }  
}