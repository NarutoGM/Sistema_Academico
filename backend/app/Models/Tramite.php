<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tramite extends Model
{
    use HasFactory;

    // Nombre de la tabla asociada
    protected $table = 'tramite';

    // Clave primaria
    protected $primaryKey = 'idTramite';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'FechaHoraPresentacion',
        'FechaHoraEntregaProg',
        'FechaHoraEntregaReal',
        'idPersona',
        'idUnidad',
        'idFlujo',
        'Observaciones',
        'idProducto',
    ];

    // Definir la relación con el modelo Persona
    public function persona()
    {
        return $this->belongsTo(Persona::class, 'idPersona');
    }

    // Definir la relación con el modelo Unidad
    public function unidad()
    {
        return $this->belongsTo(Unidad::class, 'idUnidad');
    }

    // Definir la relación con el modelo Flujo
    public function flujo()
    {
        return $this->belongsTo(Flujo::class, 'idFlujo');
    }


}