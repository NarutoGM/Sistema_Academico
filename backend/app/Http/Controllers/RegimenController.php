<?php  

namespace App\Http\Controllers;  

use App\Models\Regimen;  
use Illuminate\Http\Request;  

class RegimenController extends Controller  
{  
    // Listar todos los regimenes  
    public function index()  
    {  
        $regimenes = Regimen::all();  
        return response()->json($regimenes);  
    }  

    // Mostrar un régimen específico  
    public function show($id)  
    {  
        $regimen = Regimen::findOrFail($id);  
        return response()->json($regimen);  
    }  

    // Crear un nuevo régimen  
    public function store(Request $request)  
    {  
        $request->validate([  
            'nombreRegimen' => 'required|string|max:255',  
        ]);  

        $regimen = Regimen::create($request->all());  
        return response()->json($regimen, 201);  
    }  

    // Actualizar un régimen existente  
    public function update(Request $request, $id)  
    {  
        $request->validate([  
            'nombreRegimen' => 'required|string|max:255',  
        ]);  

        $regimen = Regimen::findOrFail($id);  
        $regimen->update($request->all());  

        return response()->json($regimen);  
    }  

    // Eliminar un régimen  
    public function destroy($id)  
    {  
        $regimen = Regimen::findOrFail($id);  
        $regimen->delete();  

        return response()->json(null, 204);  
    }  
}