<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Escuela extends Model
{
    use HasFactory;

    // Especifica la tabla asociada al modelo
    protected $table = 'escuela';

    // Define la clave primaria de la tabla
    protected $primaryKey = 'idEscuela';

    // Permitir que Eloquent maneje las marcas de tiempo automáticamente
    public $timestamps = true;

    // Definir los campos que son asignables
    protected $fillable = [
        'name',
        'idFacultad',
        
    ];

    /**
     * Relación con el modelo Facultad.
     */
    public function facultad()
    {
        return $this->belongsTo(Facultad::class, 'idFacultad', 'idFacultad');
    }

    public function mallas()
    {
        return $this->hasMany(Malla::class, 'idEscuela', 'idEscuela');
    }
}
