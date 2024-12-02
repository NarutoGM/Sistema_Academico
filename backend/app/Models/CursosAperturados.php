<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CursosAperturados extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'cursosaperturados';

    // Clave primaria compuesta
    protected $primaryKey = ['idSemestreAcademico', 'idMalla', 'idCurso', 'idEscuela'];
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    public $timestamps = false; // Desactiva los timestamps (created_at, updated_at)

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'idSemestreAcademico',
        'idMalla',
        'idCurso',
        'idEscuela',
        'estado'
    ];

    // Relación con el modelo SemestreAcademico
    public function semestreAcademico()
    {
        return $this->belongsTo(SemestreAcademico::class, 'idSemestreAcademico', 'idSemestreAcademico');
    }

    // Relación con el modelo Malla
    public function malla()
    {
        return $this->belongsTo(Malla::class, 'idMalla', 'idMalla');
    }

    // Relación con el modelo Curso
    public function curso()
    {
        return $this->belongsTo(Curso::class, 'idCurso', 'idCurso');
    }

    // Relación con el modelo Escuela
    public function escuela()
    {
        return $this->belongsTo(Escuela::class, 'idEscuela', 'idEscuela');
    }
}
