<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RolPermiso extends Model
{
    use HasFactory;

    protected $table = 'RolPermiso';

    public $timestamps = true;

    protected $fillable = [
        'idRol',
        'idPermiso',
        'estado',
    ];


    public function rol(): BelongsTo
    {
        return $this->belongsTo(Rol::class, 'idRol');
    }


    public function permiso(): BelongsTo
    {
        return $this->belongsTo(Permiso::class, 'idPermiso');
    }
}
