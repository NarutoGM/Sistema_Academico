<?php  

namespace App\Models;  

use Illuminate\Database\Eloquent\Factories\HasFactory;  
use Illuminate\Database\Eloquent\Model;  

class Categoria extends Model  
{  
    use HasFactory;  

    protected $table = 'categorias'; // Nombre de la tabla  
    protected $primaryKey = 'idCategoria'; // Clave primaria  
    public $timestamps = true; // Usar timestamps  
    protected $fillable = ['nombreCategoria']; // Campos asignables  
}