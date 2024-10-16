<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnidadPersona extends Model
{
    use HasFactory;

    protected $table = 'UnidadPersona';

    public $timestamps = true;

    // Indicar que no existe una clave primaria estándar en la tabla
    protected $primaryKey = null;

    // Indicar que no se utiliza un campo autoincremental
    public $incrementing = false;

    protected $fillable = [
        'idPersona',
        'idUnidad',
        'idEspecialidad',
        'Activo',
        'FechaInicio',
    ];

}
