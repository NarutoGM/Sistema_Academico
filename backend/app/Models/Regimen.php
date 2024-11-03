<?php  

namespace App\Models;  

use Illuminate\Database\Eloquent\Factories\HasFactory;  
use Illuminate\Database\Eloquent\Model;  

class Regimen extends Model  
{  
    use HasFactory;  

    protected $table = 'regimen'; // Nombre de la tabla  
    protected $primaryKey = 'idRegimen'; // Clave primaria  
    public $timestamps = false; // Usar timestamps  
    protected $fillable = ['nombreRegimen']; // Campos asignables  
}