<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CargaDocente extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'cargadocente';

    // Clave primaria compuesta
    protected $primaryKey = ['idCargaDocente', 'idFilial', 'idDocente'];
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    public $timestamps = false; // Desactiva los timestamps (created_at, updated_at)

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'idCargaDocente',
        'idFilial',
        'idDocente',
        'fAsignacion',
        'estado',
        'grupo',
        'idSemestreAcademico',
        'idMalla',
        'idCurso',
        'idEscuela',
        'idDirector'
    ];

    // Sobrescribir el método para claves compuestas
    protected function setKeysForSaveQuery($query)
    {
        $keys = $this->getKeyName();
        if (!is_array($keys)) {
            return parent::setKeysForSaveQuery($query);
        }

        foreach ($keys as $key) {
            $query->where($key, '=', $this->getAttribute($key));
        }

        return $query;
    }
    
    // Relación con el modelo Filial
    public function filial()
    {
        return $this->belongsTo(Filial::class, 'idFilial', 'idFilial');
    }

    // Relación con el modelo Docente
    public function docente()
    {
        return $this->belongsTo(Docente::class, 'idDocente', 'idDocente');
    }

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

    // Relación con el modelo DirectorEscuela
    public function director()
    {
        return $this->belongsTo(DirectorEscuela::class, 'idDirector', 'idDirector');
    }

}
