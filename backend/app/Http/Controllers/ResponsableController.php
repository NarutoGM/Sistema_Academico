<?php

namespace App\Http\Controllers;

use App\Models\Responsable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash; 

class ResponsableController extends Controller
{

    public function index()
    {
        $responsables = Responsable::select(
            'id',
            'nombres',
            'apellidos',
            'idRol',
            'idUnidad',
            'firmadigital',
            'clavedigital'
        )
        ->with(['rol:id,name', 'Unidad:id,unidad']) 
        ->get();

        $responsables = $responsables->map(function ($responsable) {
            return [
                'id' => $responsable->id,
                'nombres' => $responsable->nombres,
                'apellidos' => $responsable->apellidos,
                'idRol' => $responsable->idRol,
                'rol' => $responsable->rol->name,
                'idUnidad' => $responsable->idUnidad,
                'unidad' => $responsable->unidad->unidad,
                'firmadigital' => asset('storage/' . $responsable->firmadigital), // Devolvemos la URL completa
                'clavedigital' => $responsable->clavedigital,
            ];
        });

        return response()->json($responsables);
    }

    
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'apellidos' => 'required|string|max:100',
        'nombres' => 'required|string|max:100',
        'idRol' => 'required|exists:roles,id',
        'idUnidad' => 'required|exists:Unidad,id',
        'firmadigital' => 'nullable|image|mimes:jpeg,png,jpg,gif', // Validación para la firma digital
        'clavedigital' => 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $data = $request->all();

    // Encripta la clave digital antes de guardarla
    if (isset($data['clavedigital'])) {
        $data['clavedigital'] = Hash::make($data['clavedigital']);
    }

    if ($request->hasFile('firmadigital')) {
        $file = $request->file('firmadigital');
        $filePath = $file->store('firmas', 'public'); 
        $data['firmadigital'] = $filePath; 
    }

    $responsable = Responsable::create($data);

    return response()->json($responsable, 201);
}



public function show($id)
{
    $responsable = Responsable::with(['rol:id,name', 'unidad:id,unidad'])->find($id);

    if (!$responsable) {
        return response()->json(['message' => 'Responsable no encontrado'], 404);
    }

    // Formateamos el responsable para que tenga la misma estructura que en el método index
    $responsableFormatted = [
        'id' => $responsable->id,
        'nombres' => $responsable->nombres,
        'apellidos' => $responsable->apellidos,
        'idRol' => $responsable->idRol,
        'rol' => $responsable->rol->name,
        'idUnidad' => $responsable->idUnidad,
        'unidad' => $responsable->unidad->unidad,
        'firmadigital' => asset('storage/' . $responsable->firmadigital), // Devolvemos la URL completa
        'clavedigital' => $responsable->clavedigital,
    ];

    return response()->json($responsableFormatted);
}



 public function update(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'apellidos' => 'required|string|max:100',
        'nombres' => 'required|string|max:100',
        'idRol' => 'required|exists:roles,id',
        'idUnidad' => 'required|exists:Unidad,id',
        'firmadigital' => 'nullable|image|mimes:jpeg,png,jpg,gif', // Validación para la firma digital
        'clavedigital' => 'nullable|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $responsable = Responsable::find($id);
    
    if (!$responsable) {
        return response()->json(['error' => 'Responsable no encontrado'], 404);
    }

    $data = $request->except(['firmadigital']); 

    if ($request->hasFile('firmadigital')) {
        $file = $request->file('firmadigital');
        $filePath = $file->store('firmas', 'public');
        $data['firmadigital'] = $filePath;
    }

    $responsable->update($data);

    return response()->json($responsable, 200);
}

    
    
public function destroy($id)
    {
        $responsable = Responsable::find($id);

        if (!$responsable) {
            return response()->json(['message' => 'Responsable no encontrado'], 404);
        }

        if ($responsable->firmadigital) {
            Storage::disk('public')->delete($responsable->firmadigital);
        }

        $responsable->delete();

        return response()->json(['message' => 'Responsable eliminado correctamente']);
    }
}
