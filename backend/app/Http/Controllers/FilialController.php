<?php  

namespace App\Http\Controllers;  

use App\Models\Filial;  
use Illuminate\Http\Request;  

class FilialController extends Controller  
{  
    // Listar todas las filiales  
    public function index()  
    {  
        $filiales = Filial::all();  
        return response()->json($filiales);  
    }  

    // Mostrar una filial específica  
    public function show($id)  
    {  
        $filial = Filial::findOrFail($id);  
        return response()->json($filial);  
    }  

    // Crear una nueva filial  
    public function store(Request $request)  
    {  
        $request->validate([  
            'name' => 'required|string|max:255',  
        ]);  

        $filial = Filial::create($request->all());  
        return response()->json($filial, 201);  
    }  

    // Actualizar una filial existente  
    public function update(Request $request, $id)  
    {  
        $request->validate([  
            'name' => 'required|string|max:255',  
        ]);  

        $filial = Filial::findOrFail($id);  
        $filial->update($request->all());  

        return response()->json($filial);  
    }  

    // Eliminar una filial  
    public function destroy($id)  
    {  
        $filial = Filial::findOrFail($id);  
        $filial->delete();  

        return response()->json(null, 204);  
    }  
}