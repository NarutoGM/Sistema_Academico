<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semana extends Model
{
    use HasFactory;

    protected $table = 'semana';
    protected $primaryKey = null;
    public $incrementing = false; // No es autoincremental    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'idSemana',
        'idCargaDocente',
        'idFilial',
        'idDocente',
        'organizacion',
        'estrategias',
        'evidencias',
        'instrumentos',
        'nomSem',
    ];

    public function cargaDocente()
    {
        return $this->belongsTo(CargaDocente::class, 'idCargaDocente', 'idCargaDocente');
    }

    public function filial()
    {
        return $this->belongsTo(Filial::class, 'idFilial', 'idFilial');
    }

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'idDocente', 'idDocente');
    }

    // Relación inversa con Silabo
    public function silabo()
    {
        return $this->belongsTo(Silabo::class, [
            'idCargaDocente', 'idFilial', 'idDocente'
        ], [
            'idCargaDocente', 'idFilial', 'idDocente'
        ]);
    }
}
