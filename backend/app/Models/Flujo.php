<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class flujo extends Model
{
    use HasFactory;

    protected $table = 'flujo'; // Nombre de la tabla

    protected $primaryKey = 'idFlujo'; // Definir la clave primaria

    public $incrementing = true; // Indica que es auto-incremental

    protected $fillable = [
        'Flujo',
        'PlazoTotal',
        'idProducto',
        'Formato',
    ];

}