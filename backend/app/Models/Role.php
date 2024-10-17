<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $table = "roles";
    protected $primaryKey = "id";
    public $timestamps = true;
    protected $fillable = ['name'];

    public function permisos()
    {
        return $this->belongsToMany(Permiso::class, 'RolPermiso', 'idRol', 'idPermiso'); // Asegúrate de que los nombres de columnas sean correctos
    }
        // Relación muchos a muchos con User
        public function users()
        {
            return $this->belongsToMany(User::class, 'role_user', 'role_id', 'user_id');
        }
}
