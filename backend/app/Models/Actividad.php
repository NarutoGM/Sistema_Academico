<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    use HasFactory;

    protected $table = 'Actividad'; // Define la tabla si no sigue la convención

    protected $fillable = [
        'Actividad',
        'ConRequisito',
        'ConResultado',
        'plazo',
        'orden',
        'idFlujo',
        'idRol',
    ];

    // Definir las relaciones
    public function flujo()
    {
        return $this->belongsTo(Flujo::class, 'idFlujo');
    }

    public function rol()
    {
        return $this->belongsTo(Role::class, 'idRol');
    }

    public function tramiteActividades()
{
    return $this->hasMany(TramiteActividad::class, 'idActividad');
}
}
