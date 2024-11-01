<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relación muchos a muchos con Role 
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'RoleUser', 'user_id', 'role_id');
    }

    public function permisos()
    {
        return $this->belongsToMany(Permiso::class, 'RolPermiso', 'idRol', 'idPermiso'); // Asegúrate de que los nombres de columnas sean correctos
    }

    // app/Models/User.php
    public function docente()
    {
        return $this->hasOne(Docente::class, 'id', 'id');
    }

    // app/Models/User.php
    public function directorEscuela()
    {
        return $this->hasOne(DirectorEscuela::class, 'id', 'id');
    }
}
