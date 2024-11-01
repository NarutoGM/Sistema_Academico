<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Condicion;
use App\Models\DirectorEscuela;
use App\Models\Docente;
use App\Models\DocenteFilial;
use App\Models\Escuela;
use App\Models\Filial;
use App\Models\Regimen;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

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
            $filialId = '';
            $filialInfo = '';
    
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
                'docente' => $user->docente,
                'directorEscuela' => $user->directorEscuela,
                'filialId' => $filialId,
                'filialInfo' => $filialInfo,
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
    

    // POST /api/users - Crear un nuevo usuario
    public function store(Request $request)
    {
        try {
            // Validar los datos de entrada
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string|max:255',
                'email' => 'required|email|max:255|unique:users,email',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'password' => 'required|string|min:8',
            ]);

            // Manejar la subida de la foto, si existe
            $fotoUrl = null; // Inicializar la variable para la URL de la foto
            if ($request->hasFile('foto')) {
                // Guardar la foto en el directorio 'fotos'
                $fotoPath = $request->file('foto')->store('fotos', 'public'); // Cambiado
                $fotoUrl = \Storage::url($fotoPath); // Obtener la URL de la imagen guardada
            }

            // Crear la persona con los datos validados
            $user = new User();
            $user->name = $validatedData['name'];
            $user->telefono = $validatedData['telefono'];
            $user->direccion = $validatedData['direccion'];
            $user->email = $validatedData['email'];
            $user->foto = $fotoUrl; // Cambiar a 'foto' y guardar la URL de la foto
            $user->password = bcrypt($validatedData['password']);

            $user->save(); // Guardar la persona en la base de datos

            return response()->json([
                'message' => 'Persona creada exitosamente',
                'persona' => $user,
            ], 201);
        } catch (\Exception $e) {
            // Si ocurre un error, devuelve una respuesta en JSON
            return response()->json([
                'error' => 'Error al crear la persona',
                'message' => $e->getMessage(),
            ], 500);
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
