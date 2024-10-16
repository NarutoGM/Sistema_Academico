<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    protected $table = 'Persona';

    protected $fillable = [
        'idEspecialidad',
        'Nombres',
        'Apellidos',
        'DocIdentidad',
        'TipoDocIdentidad',
        'FechaNacim',
        'Email',
        'Celular',
        'Direccion',
        'Foto',
        'idUser',
    ];

    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'idEspecialidad');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario');
    }
}
