<?php  

namespace Database\Seeders;  

use Illuminate\Database\Seeder;  
use App\Models\Condicion;  

class CondicionSeeder extends Seeder  
{  
    /**  
     * Run the database seeds.  
     */  
    public function run(): void  
    {  
        Condicion::create(['nombreCondicion' => 'A tiempo completo']);  
        Condicion::create(['nombreCondicion' => 'Medio tiempo']);  
        Condicion::create(['nombreCondicion' => 'Por contrato']);  
    }  
}