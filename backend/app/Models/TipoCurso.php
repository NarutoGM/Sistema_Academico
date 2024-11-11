<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoCurso extends Model
{
    use HasFactory;

    // Especifica la tabla correspondiente en la base de datos
    protected $table = 'tipocurso';

    // Especifica la clave primaria de la tabla
    protected $primaryKey = 'idTipoCurso';

    // Indica que no se utilizarán timestamps (created_at, updated_at)
    public $timestamps = false;

    // Especifica los campos que pueden ser asignados masivamente
    protected $fillable = [
        'descripcion',
    ];
}
