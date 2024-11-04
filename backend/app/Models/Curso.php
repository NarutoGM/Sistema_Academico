<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    use HasFactory;

    protected $table = 'curso';
    protected $primaryKey = 'idCurso';
    public $incrementing = false; // Desactivar auto-incremento si no se usa en idCurso
    protected $fillable = [
        'idCurso', 'name', 'creditos', 'hTeoricas', 'hPracticas', 'hRetroalimentacion',
        'hLaboratorio', 'nGrupos', 'prerequisitos', 'idDepartamento', 'idFacultad',
        'idArea', 'idRegimenCurso', 'idTipoCurso'
    ];
    public $timestamps = false;

    // Definir las relaciones si es necesario
  //  public function departamento()
  //  {
  //      return $this->belongsTo(DepartamentoAcademico::class, 'idDepartamento');
  //  }

    public function facultad()
    {
        return $this->belongsTo(Facultad::class, 'idFacultad');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'idArea');
    }

   // public function regimenCurso()
   // {
   //     return $this->belongsTo(RegimenCurso::class, 'idRegimenCurso');
  //  }

   // public function tipoCurso()
  //  {
   //     return $this->belongsTo(TipoCurso::class, 'idTipoCurso');
   // }
}
