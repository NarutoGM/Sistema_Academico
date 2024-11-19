<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'horario';

    // Clave primaria compuesta
    protected $primaryKey = ['idSemestreAcademico', 'idFilial', 'idEscuela'];
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    public $timestamps = false; // Desactiva los timestamps (created_at, updated_at)

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'idSemestreAcademico',
        'idFilial',
        'idEscuela',
        'documento',
        'estado',
        'observaciones',
        'idDirector'
    ];

    // Relación con el modelo CargaDocente
    public function semestreacademico()
    {
        return $this->belongsTo(SemestreAcademico::class, 'idSemestreAcademico', 'idSemestreAcademico');
    }

    // Relación con el modelo Filial
    public function filial()
    {
        return $this->belongsTo(Filial::class, 'idFilial', 'idFilial');
    }

    // Relación con el modelo Escuela
    public function escuela()
    {
        return $this->belongsTo(Escuela::class, 'idEscuela', 'idEscuela');
    }

    // Relación con el modelo DirectorEscuela
    public function director()
    {
        return $this->belongsTo(DirectorEscuela::class, 'idDirector', 'idDirector');
    }
}
