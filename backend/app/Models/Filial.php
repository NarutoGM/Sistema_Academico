<?php  

namespace App\Models;  

use Illuminate\Database\Eloquent\Factories\HasFactory;  
use Illuminate\Database\Eloquent\Model;  

class Filial extends Model  
{  
    use HasFactory;  

    protected $table = 'filial'; // Nombre de la tabla en la base de datos  

    protected $primaryKey = 'idFilial'; // Clave primaria  

    protected $fillable = ['name']; // Campos que se pueden llenar  

    // app/Models/Filial.php
public function docentes()
{
    return $this->belongsToMany(Docente::class, 'docentefilial', 'idFilial', 'idDocente')
                ->withPivot('idCondicion', 'idRegimen', 'idCategoria', 'estado') // Campos adicionales
                ->withTimestamps();
}

}