<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'horario';

    // Desactiva la clave primaria por defecto de Laravel
    protected $primaryKey = null;
    public $incrementing = false;
    public $timestamps = false;

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'idSemestreAcademico',
        'idFilial',
        'idEscuela',
        'documento',
        'estado',
        'observaciones',
        'idDirector',
    ];

    // Deshabilitar atributos adicionales para evitar conflictos en las consultas
    protected $attributes = [];

    // Relaciones

    public function semestreacademico()
    {
        return $this->belongsTo(SemestreAcademico::class, 'idSemestreAcademico', 'idSemestreAcademico');
    }

    public function filial()
    {
        return $this->belongsTo(Filial::class, 'idFilial', 'idFilial');
    }

    public function escuela()
    {
        return $this->belongsTo(Escuela::class, 'idEscuela', 'idEscuela');
    }

    public function director()
    {
        return $this->belongsTo(DirectorEscuela::class, 'idDirector', 'idDirector');
    }
}
