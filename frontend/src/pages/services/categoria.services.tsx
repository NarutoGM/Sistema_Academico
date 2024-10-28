import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated  

// Definición de la URL de la API  
const apiUrl = 'http://127.0.0.1:8000/api'; // Cambia esta URL según tu configuración  

// Definición de la interfaz Categoria  
export interface Categoria {  
  idCategoria: number;  
  name: string; // Agrega otros campos según la estructura de tu API  
}  

// Función para obtener todas las categorías  
export const getCategorias = async (): Promise<Categoria[]> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/categorias`, {  
    method: 'GET',  
    headers: {  
      Authorization: `Bearer ${authData.token}`,  
      'Content-Type': 'application/json',  
    },  
  });  

  if (!response.ok) {  
    throw new Error('Error al obtener categorías');  
  }  

  return response.json();  
};  

// Función para crear una nueva categoría  
export const createCategoria = async (  
  categoriaData: Omit<Categoria, 'idCategoria'>,  
): Promise<Categoria> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/categorias`, {  
    method: 'POST',  
    headers: {  
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${authData.token}`,  
    },  
    body: JSON.stringify(categoriaData),  
  });  

  if (!response.ok) {  
    const errorText = await response.text(); // Obtener el texto completo en caso de error  
    console.error('Error al crear categoría:', errorText);  
    throw new Error(`Error al crear categoría: ${response.statusText}`);  
  }  

  return response.json();  
};  

// Función para actualizar una categoría existente  
export const updateCategoria = async (  
  id: number,  
  categoriaData: Omit<Categoria, 'idCategoria'>,  
): Promise<Categoria> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/categorias/${id}`, {  
    method: 'PUT',  
    headers: {  
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${authData.token}`,  
    },  
    body: JSON.stringify(categoriaData),  
  });  

  if (!response.ok) {  
    throw new Error('Error al actualizar categoría');  
  }  

  return response.json();  
};  

// Función para eliminar una categoría  
export const deleteCategoria = async (id: number): Promise<void> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    console.error('User is not authenticated or token is missing');  
    return; // Salir si no está autenticado  
  }  

  const response = await fetch(`${apiUrl}/categorias/${id}`, {  
    method: 'DELETE',  
    headers: {  
      Authorization: `Bearer ${authData.token}`,  
    },  
  });  

  if (!response.ok) {  
    throw new Error('Error al eliminar categoría');  
  }  
};