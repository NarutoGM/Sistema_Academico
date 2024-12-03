<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asignacion extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'asignacion';

    // Desactiva la clave primaria predeterminada de Laravel
    protected $primaryKey = null;

    public $incrementing = false; // No es autoincremental
    public $timestamps = false; // Desactiva los timestamps (created_at, updated_at)

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'idAsignacion',
        'idCargaDocente',
        'idFilial',
        'idDocente',
        'grupo',
        'tipoSesion',
        'nombreAula',
        'dia',
        'horaInicio',
        'horaFin',
    ];
}
