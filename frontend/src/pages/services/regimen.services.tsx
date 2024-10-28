import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated  

// Definición de la URL de la API directamente  
const apiUrl = 'http://127.0.0.1:8000/api'; // Cambia esta URL a la que necesites  

// Función para obtener el token desde el almacenamiento  
const getToken = (): string | null => {  
  return localStorage.getItem('token'); // O sessionStorage, dependiendo de dónde almacenes el token  
};  

// Definición de la interfaz Regimen  
export interface Regimen {  
  idRegimen: number;  
  name: string; // Puedes agregar otros campos según la estructura de tu API  
}  

// Función para obtener todos los regímenes  
export const getRegimenes = async (): Promise<Regimen[]> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/regimenes`, {  
    method: 'GET',  
    headers: {  
      Authorization: `Bearer ${authData.token}`,  
      'Content-Type': 'application/json',  
    },  
  });  

  if (!response.ok) {  
    throw new Error('Error al obtener regímenes');  
  }  

  return response.json();  
};  

// Función para crear un nuevo régimen  
export const createRegimen = async (  
  regimenData: Omit<Regimen, 'idRegimen'>,  
): Promise<Regimen> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/regimenes`, {  
    method: 'POST',  
    headers: {  
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${authData.token}`,  
    },  
    body: JSON.stringify(regimenData),  
  });  

  if (!response.ok) {  
    const errorText = await response.text(); // Obtener el texto completo  
    console.error('Error al crear régimen:', errorText);  
    throw new Error(`Error al crear régimen: ${response.statusText}`);  
  }  

  return response.json();  
};  

// Función para actualizar un régimen existente  
export const updateRegimen = async (  
  id: number,  
  regimenData: Omit<Regimen, 'idRegimen'>,  
): Promise<Regimen> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/regimenes/${id}`, {  
    method: 'PUT',  
    headers: {  
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${authData.token}`,  
    },  
    body: JSON.stringify(regimenData),  
  });  

  if (!response.ok) {  
    throw new Error('Error al actualizar régimen');  
  }  

  return response.json();  
};  

// Función para eliminar un régimen  
export const deleteRegimen = async (id: number): Promise<void> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    console.error('User is not authenticated or token is missing');  
    return; // Salir si no está autenticado  
  }  

  const response = await fetch(`${apiUrl}/regimenes/${id}`, {  
    method: 'DELETE',  
    headers: {  
      Authorization: `Bearer ${authData.token}`,  
    },  
  });  

  if (!response.ok) {  
    throw new Error('Error al eliminar régimen');  
  }  
};