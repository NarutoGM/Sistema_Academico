<?php  

namespace App\Models;  

use Illuminate\Database\Eloquent\Factories\HasFactory;  
use Illuminate\Database\Eloquent\Model;  

class Area extends Model  
{  
    use HasFactory;  

    protected $table = 'area'; // Nombre de la tabla  
    protected $primaryKey = 'idArea'; // Clave primaria  
    public $timestamps = false; // Usar timestamps  
    protected $fillable = ['nomArea']; // Campos asignables  
}