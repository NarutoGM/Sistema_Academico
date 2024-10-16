<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unidad extends Model
{
    use HasFactory;

    protected $table = 'Unidad';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = ['unidad', 'estado'];

    public function responsables()
    {
        return $this->belongsToMany(Persona::class, 'unidad_persona', 'idUnidad', 'idPersona')
                    ->withPivot('Activo', 'FechaInicio');
    }
}