<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TramiteActividad extends Model
{
    use HasFactory;

    protected $table = 'TramiteActividad'; // Define la tabla si no sigue la convención

    protected $fillable = [
        'idTramite',
        'idActividad',
        'idResponsable',
        'FechaIngreso',
        'FechaSalida',
        'PlazoEstandard',
        'PlazoReal',
        'Observacion',
        'Resultado',
        'Archivo',
    ];

    // Definir relaciones
    public function tramite()
    {
        return $this->belongsTo(Tramite::class, 'idTramite');
    }
    
    public function TramiteActividadResuelta()
    {
        return $this->hasMany(TramiteActividadResuelta::class, 'idActividad', 'idActividad');
    }

    public function actividad()
    {
        return $this->belongsTo(Actividad::class, 'idActividad');
    }

    public function responsable()
    {
        return $this->belongsTo(Responsable::class, 'idResponsable');
    }
}
