<?php

namespace App\Http\Controllers;
use App\Models\Role;
use Illuminate\Http\Request;

class RolPrueba extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return response()->json($roles);
    }
}
