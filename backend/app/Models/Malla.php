<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Malla extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'malla';

    // Clave primaria compuesta
    protected $primaryKey = ['idMalla', 'idEscuela'];
    public $incrementing = false; // Indica que la clave primaria no es autoincremental
    public $timestamps = false; // Desactiva los timestamps (created_at, updated_at)

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'idMalla',
        'idEscuela',
        'año',
        'estado'
    ];

    // Define la relación con el modelo Escuela
    public function escuela()
    {
        return $this->belongsTo(Escuela::class, 'idEscuela', 'idEscuela');
    }
}
