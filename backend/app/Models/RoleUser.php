<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleUser extends Model
{
    use HasFactory;

    protected $table = 'RoleUser';

    public $timestamps = false; // Si no tienes campos created_at o updated_at

    protected $fillable = [
        'idUser',
        'idRol',
        'dateCreation',
        'status',
    ];

    /**
     * Relación con el modelo User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idUser');
    }

    /**
     * Relación con el modelo Rol.
     */
    public function rol(): BelongsTo
    {
        return $this->belongsTo(Rol::class, 'idRol');
    }
}
