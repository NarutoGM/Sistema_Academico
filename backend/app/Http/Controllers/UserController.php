<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Condicion;
use App\Models\DocenteFilial;
use App\Models\Escuela;
use App\Models\Filial;
use App\Models\Regimen;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    // GET /api/users - Obtener todos los usuarios
    public function index()
    {
        $users = User::with('roles')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'lastname' => $user->lastname,
                'telefono' => $user->telefono,
                'roles' => $user->roles, // Esto incluye toda la info de los roles
                'foto' => $user->foto, // Esto incluye toda la info de los roles
                'direccion' => $user->direccion, // Esto incluye toda la info de los roles
                'email' => $user->email

            ];
        });

        return response()->json($users);
    }
    // GET /api/users - Obtener todos los usuarios
    public function administrarusuarios()
    {
        // Obtener todos los usuarios con sus roles y la información adicional requerida.
        $users = User::with('roles', 'docente', 'directorEscuela')->get()->map(function ($user) {
            // Inicializar variables para cada usuario.
            $filialId = collect(); // Inicializar como colección vacía
            $filialInfo = null;

            // Si el usuario tiene un docente asociado, obtener la información correspondiente.
            if ($user->docente) {
                $filialId = DocenteFilial::where('idDocente', $user->docente->idDocente)
                    ->where('estado', true)
                    ->pluck('idFilial');

                $filialInfo = DocenteFilial::where('idDocente', $user->docente->idDocente)
                    ->first(['idRegimen', 'idCategoria', 'idCondicion']);
            }

            // Retornar la información del usuario en el formato deseado.
            return [
                'id' => $user->id,
                'name' => $user->name,
                'lastname' => $user->lastname,
                'roles' => $user->roles,
                'email' => $user->email,
                'docente' => !$filialId->isEmpty() ? $user->docente : null,
                'directorEscuela' => $user->directorEscuela && $user->directorEscuela->estado === true ? $user->directorEscuela : null,
                'filialId' => $filialId,
                'filialInfo' => !$filialId->isEmpty() ? $filialInfo : null,
            ];
        });

        // Obtener los datos adicionales necesarios para la respuesta.
        $roles = Role::select('id', 'name')->get();
        $condiciones = Condicion::select('idCondicion', 'nombreCondicion')->get();
        $regimenes = Regimen::select('idRegimen', 'nombreRegimen')->get();
        $categorias = Categoria::select('idCategoria', 'nombreCategoria')->get();
        $filiales = Filial::select('idFilial', 'name')->get();
        $escuelas = Escuela::select('idEscuela', 'name')->get();

        // Retornar la respuesta JSON.
        return response()->json([
            'users' => $users,
            'roles' => $roles,
            'condiciones' => $condiciones,
            'regimenes' => $regimenes,
            'categorias' => $categorias,
            'filiales' => $filiales,
            'escuelas' => $escuelas,
        ]);
    }



    public function store(Request $request)
    {
        try {
            // Validar los datos
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'dni' => 'required|string|max:10|unique:users,dni',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:4',
            ]);
    
            // Crear el usuario
            $user = User::create([
                'name' => $validatedData['name'],
                'lastname' => $validatedData['lastname'],
                'dni' => $validatedData['dni'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
            ]);
    
            return response()->json(['message' => 'Usuario creado exitosamente'], 201);
    
        } catch (ValidationException $e) {
            // Devuelve un JSON con los errores de validación
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }
    }






    // GET /api/users/{id} - Obtener un usuario por ID
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($user);
    }

    // PUT /api/users/{id} - Actualizar un usuario por ID
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Validación de los datos de entrada
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Actualizar el usuario
        $user->name = $request->input('name', $user->name);
        $user->email = $request->input('email', $user->email);

        if ($request->has('password')) {
            $user->password = Hash::make($request->input('password')); // Hashear la nueva contraseña
        }

        $user->save();

        return response()->json($user);
    }

    // DELETE /api/users/{id} - Eliminar un usuario por ID
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}
