<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Especialidad extends Model
{
    use HasFactory;

    protected $table = 'Especialidad';

    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'Descripcion',
        'AsesorFree',
        'idResponsableArea',
        'idResponsableSecretaria',
    ];
}
