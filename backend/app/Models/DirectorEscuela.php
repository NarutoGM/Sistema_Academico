<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DirectorEscuela extends Model
{
    use HasFactory;

    // Especifica la tabla asociada al modelo
    protected $table = 'directorescuela';

    // Define la clave primaria de la tabla
    protected $primaryKey = 'idDirector';

    // Permitir que Eloquent maneje las marcas de tiempo automáticamente
    public $timestamps = true;

    // Definir los campos que son asignables
    protected $fillable = [
        'id',
        'idEscuela',
        'estado', // Añade estado como fillable
    ];

    // Casts para definir tipos
    protected $casts = [
        'estado' => 'boolean', // Asegura que estado sea tratado como booleano
    ];

    /**
     * Relación con el modelo User.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }

    /**
     * Relación con el modelo Escuela.
     */
    public function escuela()
    {
        return $this->belongsTo(Escuela::class, 'idEscuela', 'idEscuela');
    }
}
