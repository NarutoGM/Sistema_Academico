<?php  

namespace App\Models;  

use Illuminate\Database\Eloquent\Factories\HasFactory;  
use Illuminate\Database\Eloquent\Model;  

class Condicion extends Model  
{  
    use HasFactory;  

    // Si el nombre de la tabla no es plural de acuerdo a la convención de Laravel, especifica el nombre  
    protected $table = 'condicion';  

    // Si deseas definir la clave primaria  
    protected $primaryKey = 'idCondicion';  

    // Si no usas timestamps, puedes desactivarlos  
    public $timestamps = true;  

    // Especifica los campos que son asignables en masa  
    protected $fillable = ['nombreCondicion'];  
}