<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Docente extends Model
{
    use HasFactory;

    // Especifica la tabla asociada al modelo
    protected $table = 'docente';

    // Define la clave primaria de la tabla
    protected $primaryKey = 'idDocente';
    public $incrementing = true;

    // Permitir que Eloquent maneje las marcas de tiempo automáticamente
    public $timestamps = false;

    // Definir los campos que son asignables
    protected $fillable = [
        'id',
        'idEscuela',
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

    // app/Models/Docente.php
    public function filiales()
    {
        return $this->belongsToMany(Filial::class, 'docentefilial', 'idDocente', 'idFilial')
            ->withPivot('idCondicion', 'idRegimen', 'idCategoria', 'estado') // Campos adicionales
            ->withTimestamps();
    }
}
