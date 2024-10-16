<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permiso extends Model
{
    use HasFactory;

    protected $table = 'Permiso';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'descripcion',
        'estado',
    ];

    public function scopeActivos($query)
    {
        return $query->where('estado', true);
    }
}
