import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated  

// Definición de la URL de la API directamente  
const apiUrl = 'http://127.0.0.1:8000/api'; // Cambia esta URL a la que necesites  

// Función para obtener el token desde el almacenamiento  
const getToken = (): string | null => {  
  return localStorage.getItem('token'); // O sessionStorage, dependiendo de dónde almacenes el token  
};  

// Definición de la interfaz Condicion  
export interface Condicion {  
  idCondicion: number;  
  name: string; // Puedes agregar otros campos según la estructura de tu API  
}  

// Función para obtener todas las condiciones  
export const getCondiciones = async (): Promise<Condicion[]> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/condiciones`, {  
    method: 'GET',  
    headers: {  
      Authorization: `Bearer ${authData.token}`,  
      'Content-Type': 'application/json',  
    },  
  });  

  if (!response.ok) {  
    throw new Error('Error al obtener condiciones');  
  }  

  return response.json();  
};  

// Función para crear una nueva condición  
export const createCondicion = async (  
  condicionData: Omit<Condicion, 'idCondicion'>,  
): Promise<Condicion> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/condiciones`, {  
    method: 'POST',  
    headers: {  
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${authData.token}`,  
    },  
    body: JSON.stringify(condicionData),  
  });  

  if (!response.ok) {  
    const errorText = await response.text(); // Obtener el texto completo  
    console.error('Error al crear condición:', errorText);  
    throw new Error(`Error al crear condición: ${response.statusText}`);  
  }  

  return response.json();  
};  

// Función para actualizar una condición existente  
export const updateCondicion = async (  
  id: number,  
  condicionData: Omit<Condicion, 'idCondicion'>,  
): Promise<Condicion> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/condiciones/${id}`, {  
    method: 'PUT',  
    headers: {  
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${authData.token}`,  
    },  
    body: JSON.stringify(condicionData),  
  });  

  if (!response.ok) {  
    throw new Error('Error al actualizar condición');  
  }  

  return response.json();  
};  

// Función para eliminar una condición  
export const deleteCondicion = async (id: number): Promise<void> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    console.error('User is not authenticated or token is missing');  
    return; // Salir si no está autenticado  
  }  

  const response = await fetch(`${apiUrl}/condiciones/${id}`, {  
    method: 'DELETE',  
    headers: {  
      Authorization: `Bearer ${authData.token}`,  
    },  
  });  

  if (!response.ok) {  
    throw new Error('Error al eliminar condición');  
  }  
};