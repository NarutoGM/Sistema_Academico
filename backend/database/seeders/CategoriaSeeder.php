<?php  

namespace Database\Seeders;  

use Illuminate\Database\Seeder;  
use App\Models\Categoria;  

class CategoriaSeeder extends Seeder  
{  
    /**  
     * Run the database seeds.  
     */  
    public function run(): void  
    {  
        Categoria::create(['nombreCategoria' => 'Tecnología']);  
        Categoria::create(['nombreCategoria' => 'Ciencia']);  
        Categoria::create(['nombreCategoria' => 'Arte']);  
        Categoria::create(['nombreCategoria' => 'Deportes']);  
        Categoria::create(['nombreCategoria' => 'Salud']);  
    }  
}