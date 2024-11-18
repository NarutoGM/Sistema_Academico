<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartamentoAcademico extends Model
{
    use HasFactory;

    // Especifica la tabla correspondiente en la base de datos
    protected $table = 'departamentoacademico';

    // Especifica la clave primaria de la tabla
    protected $primaryKey = 'idDepartamento';

    // Indica que no se utilizarán timestamps (created_at, updated_at)
    public $timestamps = false;

    // Especifica los campos que pueden ser asignados masivamente
    protected $fillable = [
        'nomDepartamento',
    ];
}
