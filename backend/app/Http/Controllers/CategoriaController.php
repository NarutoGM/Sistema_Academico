<?php  

namespace App\Http\Controllers;  

use App\Models\Categoria;  
use Illuminate\Http\Request;  

class CategoriaController extends Controller  
{  
    // Listar todas las categorías  
    public function index()  
    {  
        $categorias = Categoria::all();  
        return response()->json($categorias);  
    }  

    // Mostrar una categoría específica  
    public function show($id)  
    {  
        $categoria = Categoria::findOrFail($id);  
        return response()->json($categoria);  
    }  

    // Crear una nueva categoría  
    public function store(Request $request)  
    {  
        $request->validate([  
            'nombreCategoria' => 'required|string|max:255',  
        ]);  

        $categoria = Categoria::create($request->all());  
        return response()->json($categoria, 201);  
    }  

    // Actualizar una categoría existente  
    public function update(Request $request, $id)  
    {  
        $request->validate([  
            'nombreCategoria' => 'required|string|max:255',  
        ]);  

        $categoria = Categoria::findOrFail($id);  
        $categoria->update($request->all());  

        return response()->json($categoria);  
    }  

    // Eliminar una categoría  
    public function destroy($id)  
    {  
        $categoria = Categoria::findOrFail($id);  
        $categoria->delete();  

        return response()->json(null, 204);  
    }  
}