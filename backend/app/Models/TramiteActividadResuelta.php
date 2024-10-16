<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TramiteActividadResuelta extends Model
{
    use HasFactory;

    protected $table = 'TramiteActividadResuelta';

    protected $primaryKey = ['idTramite', 'idActividad', 'idResultado'];

    public $incrementing = false; // porque la clave primaria no es un único campo
    protected $keyType = 'string'; // o 'int', dependiendo de tus necesidades

    protected $fillable = [
        'idTramite',
        'idActividad',
        'idResultado',
        'activo',
        'idProducto',
        'documento',
        'fechaInicio',
        'fechaPrograma',
        'fechaEjecucion',
    ];

    public function tramite()
    {
        return $this->belongsTo(Tramite::class, 'idTramite');
    }

    public function actividad()
    {
        return $this->belongsTo(Actividad::class, 'idActividad');
    }

  //  public function resultado()
   // {
  //      return $this->belongsTo(Resultado::class, 'idResultado');
  //  }
}
