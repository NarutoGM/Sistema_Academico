<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Silabo extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'silabo';

    // Desactiva la clave primaria predeterminada de Laravel
    protected $primaryKey = null;
    public $incrementing = false; // No es autoincremental
    public $timestamps = false; // Desactiva los timestamps (created_at, updated_at)

    // Define los atributos que se pueden asignar de forma masiva
    protected $fillable = [
        'idCargaDocente',
        'idFilial',
        'idDocente',
        'documento',
        'estado',
        'activo',
        'observaciones',
        'idDirector',
        'fEnvio',
    ];

    // Relaciones

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

    public function director()
    {
        return $this->belongsTo(DirectorEscuela::class, 'idDirector', 'idDirector');
    }

    public function semana()
    {
        return $this->hasMany(Semana::class, 'idCargaDocente', 'idCargaDocente')
                    ->where('idFilial', $this->idFilial)
                    ->where('idDocente', $this->idDocente);
    }
    
    

}
