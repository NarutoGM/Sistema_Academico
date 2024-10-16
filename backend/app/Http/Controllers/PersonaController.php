<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PersonaController extends Controller
{
    public function index()
    {
        $personas = Persona::select(
            'id',
            'idEspecialidad',
            'Nombres',
            'Apellidos',
            'DocIdentidad',
            'TipoDocIdentidad',
            'FechaNacim',
            'Email',
            'Celular',
            'Direccion',
            'Foto',
            'idUser',
        )
        ->with([ 'Especialidad:id,Descripcion']) 
        ->get();

        $personas = $personas->map(function ($persona) {
            return [
                'id' => $persona->id,
                'idEspecialidad' => $persona->idEspecialidad,
                'Nombres' => $persona->Nombres,
                'Apellidos' => $persona->Apellidos,
                'DocIdentidad' => $persona->DocIdentidad,
                'TipoDocIdentidad' => $persona->TipoDocIdentidad,
                'FechaNacim' => $persona->FechaNacim,
                'Email' => $persona->Email,
                'Celular' => $persona->Celular,
                'Direccion' => $persona->Direccion,
                'Foto' => asset('storage/' . $persona->Foto), // Devolvemos la URL completa
                'idUser' => $persona->idUser,
            ];
        });

        return response()->json($personas);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'idEspecialidad' => 'required|exists:Especialidad,id',
            'Nombres' => 'required|string|max:255',
            'Apellidos' => 'required|string|max:255',
            'DocIdentidad' => 'required|string|max:20',
            'TipoDocIdentidad' => 'required|string|max:50',
            'FechaNacim' => 'required|date_format:d-m-Y',
            'Email' => 'required|email|unique:users,email', // Asegurarse que el email es único
            'Celular' => 'nullable|string|max:15',
            'Direccion' => 'nullable|string|max:255',
            'Foto' => 'nullable|image|mimes:jpeg,png,jpg,gif', // Validación para la imagen
            'Password' => 'required|string|min:8', // Validación de la contraseña
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        $data = $request->all();
    
        // Manejar la carga de la imagen
        if ($request->hasFile('Foto')) {
            $file = $request->file('Foto');
            $filePath = $file->store('perfiles', 'public'); // Guarda la imagen en 'storage/app/public/perfiles'
            $data['Foto'] = $filePath; // Guarda la ruta de la imagen
        }
    
        // Crear el usuario asociado
        $user = User::create([
            'name' => $data['Nombres'] . ' ' . $data['Apellidos'], // Combina nombres y apellidos
            'email' => $data['Email'],
            'password' => bcrypt($data['Password']), // Usa la contraseña ingresada por el usuario
        ]);
    
        // Guardar el ID del usuario en los datos de la persona
        $data['idUser'] = $user->id;
    
        // Crear la persona
        $persona = Persona::create($data);
    
        return response()->json(['message' => 'Persona y usuario creados exitosamente', 'data' => $persona], 201); // 201 = Created
    }
    

    public function show($id, $idEspecialidad)
    {
        $persona = DB::table('Persona')
            ->where('id', $id)
            ->where('idEspecialidad', $idEspecialidad)
            ->first();

        if (!$persona) {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }

        return response()->json($persona);
    }

    public function update(Request $request, $id, $idEspecialidad)
    {
        $persona = DB::table('Persona')
            ->where('id', $id)
            ->where('idEspecialidad', $idEspecialidad)
            ->first();

        if (!$persona) {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }

        $validator = Validator::make($request->all(), [
            'idEspecialidad' => 'required|exists:Especialidad,id',
            'Nombres' => 'required|string|max:255',
            'Apellidos' => 'required|string|max:255',
            'DocIdentidad' => 'required|string|max:20',
            'TipoDocIdentidad' => 'required|string|max:50',
            'FechaNacim' => 'required|date_format:d-m-Y',
            'Email' => 'required|email',
            'Celular' => 'nullable|string|max:15',
            'Direccion' => 'nullable|string|max:255',
            'Foto' => 'nullable|image|mimes:jpeg,png,jpg,gif', // Validación para la imagen
            'idUser' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->except(['Foto']); 

        if ($request->hasFile('Foto')) {
            $file = $request->file('Foto');
            $filePath = $file->store('perfiles', 'public'); 
            $data['Foto'] = $filePath;


            if ($persona->Foto) {
                Storage::disk('public')->delete($persona->Foto);
            }
        }

        DB::table('Persona')
            ->where('id', $id)
            ->where('idEspecialidad', $idEspecialidad)
            ->update(array_merge($data, ['updated_at' => now()]));

        return response()->json(['message' => 'Persona actualizada correctamente']);
    }

    public function destroy($id, $idEspecialidad)
    {
        $persona = DB::table('Persona')
            ->where('id', $id)
            ->where('idEspecialidad', $idEspecialidad)
            ->first();

        if (!$persona) {
            return response()->json(['message' => 'Persona no encontrada'], 404);
        }

        // Eliminar la imagen asociada si existe
        if ($persona->Foto) {
            Storage::disk('public')->delete($persona->Foto);
        }

        DB::table('Persona')
            ->where('id', $id)
            ->where('idEspecialidad', $idEspecialidad)
            ->delete();

        return response()->json(['message' => 'Persona eliminada correctamente']);
    }
}
