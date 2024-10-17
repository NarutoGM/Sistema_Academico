<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function authenticate(LoginRequest $request)
    {
        try {
            $request->authenticate();
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        }
    
        $user = User::where('email', $request->email)->first();
        $rol = $user->roles()->first();
    
        return response()->json([
            'token' => $user->createToken("login-token-".$user->id)->plainTextToken,
            'role' => $rol ? $rol->name : null,
            'name' => $user->name,
            'email' => $user->email,
            'id' => $user->id,

        ]);
    }
    
}
