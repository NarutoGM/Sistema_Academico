<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Responsable extends Model
{
    use HasFactory;

    protected $table = 'Responsable';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'apellidos', 
        'nombres', 
        'idRol', 
        'idUnidad', 
        'firmadigital', 
        'clavedigital',
    ];

    public function rol()
    {
        return $this->belongsTo(Role::class, 'idRol');
    }

    public function unidad()
    {
        return $this->belongsTo(Unidad::class, 'idUnidad');
    }
}