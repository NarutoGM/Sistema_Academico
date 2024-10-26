<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facultad extends Model
{
    use HasFactory;

    // Especifica la tabla asociada al modelo
    protected $table = 'facultad';

    // Define la clave primaria de la tabla
    protected $primaryKey = 'idFacultad';

    // Permitir que Eloquent maneje las marcas de tiempo automáticamente
    public $timestamps = true;

    // Definir los campos que son asignables
    protected $fillable = [
        'nomFacultad',
    ];
}
