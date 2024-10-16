<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolPermiso extends Model
{
    use HasFactory;

    protected $table = 'RolPermiso';

    // Indica que no hay columna 'id' autoincremental
    protected $primaryKey = null;
    public $incrementing = false;

    // Permitir timestamps automáticos
    public $timestamps = true;

    protected $fillable = [
        'idRol',
        'idPermiso',
        'estado',
    ];

    public function rol()
    {
        return $this->belongsTo(Role::class, 'idRol');
    }

    public function permiso()
    {
        return $this->belongsTo(Permiso::class, 'idPermiso');
    }
}
