<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocenteFilial extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'docentefilial';

    // Definir la clave primaria compuesta
    protected $primaryKey = ['idFilial', 'idDocente'];
    public $incrementing = false; // Indica que no es autoincremental

    // Definir los campos que pueden ser asignados masivamente
    protected $fillable = [
        'idFilial',
        'idDocente',
        'idCondicion',
        'idRegimen',
        'idCategoria',
    ];

    // Relaciones con otros modelos

    public function filial()
    {
        return $this->belongsTo(Filial::class, 'idFilial');
    }

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'idDocente');
    }

    public function condicion()
    {
        return $this->belongsTo(Condicion::class, 'idCondicion');
    }

    public function regimen()
    {
        return $this->belongsTo(Regimen::class, 'idRegimen');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'idCategoria');
    }
}
