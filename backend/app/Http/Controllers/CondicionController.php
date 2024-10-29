<?php  

namespace App\Http\Controllers;  

use App\Models\Condicion;  
use Illuminate\Http\Request;  

class CondicionController extends Controller  
{  
    // Listar todas las condiciones  
    public function index()  
    {  
        $condiciones = Condicion::select('idCondicion', 'nombreCondicion')->get();  
        return response()->json($condiciones);  
    } 

    // Mostrar un condición específico  
    public function show($id)  
    {  
        $condicion = Condicion::findOrFail($id);  
        return response()->json($condicion);  
    }  

    // Crear una nueva condición  
    public function store(Request $request)  
    {  
        $request->validate([  
            'nombreCondicion' => 'required|string|max:255',  
        ]);  

        $condicion = Condicion::create($request->all());  
        return response()->json($condicion, 201);  
    }  

    // Actualizar una condición existente  
    public function update(Request $request, $id)  
    {  
        $request->validate([  
            'nombreCondicion' => 'required|string|max:255',  
        ]);  

        $condicion = Condicion::findOrFail($id);  
        $condicion->update($request->all());  

        return response()->json($condicion);  
    }  

    // Eliminar una condición  
    public function destroy($id)  
    {  
        $condicion = Condicion::findOrFail($id);  
        $condicion->delete();  

        return response()->json(null, 204);  
    }  
}