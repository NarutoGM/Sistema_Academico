<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Silabo extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'silabo';

    // Clave primaria compuesta
    protected $primaryKey = ['idCargaDocente', 'idFilial', 'idDocente'];
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    public $timestamps = false; // Desactiva los timestamps (created_at, updated_at)

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'idCargaDocente',
        'idFilial',
        'idDocente',
        'documento',
        'estado',
        'observaciones',
        'idDirector'
    ];

    // Relación con el modelo CargaDocente
    public function cargaDocente()
    {
        return $this->belongsTo(CargaDocente::class, 'idCargaDocente', 'idCargaDocente');
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

    // Relación con el modelo DirectorEscuela
    public function director()
    {
        return $this->belongsTo(DirectorEscuela::class, 'idDirector', 'idDirector');
    }
}
