<?php  

namespace Database\Seeders;  

use Illuminate\Database\Seeder;  
use App\Models\Area;  

class AreaSeeder extends Seeder  
{  
    /**  
     * Run the database seeds.  
     */  
    public function run(): void  
    {  
        Area::create(['nomArea' => 'Estudios de Especialidad']);  
    }  
}