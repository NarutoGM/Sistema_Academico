<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SemestreAcademico extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'semestreacademico';

    // Clave primaria personalizada
    protected $primaryKey = 'idSemestreAcademico';

    // Desactiva los timestamps (created_at, updated_at)
    public $timestamps = false;

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'nomSemestre',
        'añoAcademico',
        'numSemestre',
        'fInicio',
        'fTermino'
    ];
}
