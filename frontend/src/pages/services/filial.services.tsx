import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated  

// Definición de la URL de la API  
const apiUrl = 'http://127.0.0.1:8000/api'; // Ajusta esta URL a la que necesites  

// Definición de la interfaz Filial  
export interface Filial {  
  idFilial: number;  
  name: string; // Incluye otros campos según la estructura de tu API  
  // Agrega otros campos según sea necesario  
}  

// Función para obtener todas las filiales  
export const getFiliales = async (): Promise<Filial[]> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/filiales`, {  
    method: 'GET',  
    headers: {  
      Authorization: `Bearer ${authData.token}`,  
      'Content-Type': 'application/json',  
    },  
  });  

  if (!response.ok) {  
    throw new Error('Error al obtener filiales');  
  }  

  return response.json();  
};  

// Función para crear una nueva filial  
export const createFilial = async (  
  filialData: Omit<Filial, 'idFilial'>,  
): Promise<Filial> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/filiales`, {  
    method: 'POST',  
    headers: {  
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${authData.token}`,  
    },  
    body: JSON.stringify(filialData),  
  });  

  if (!response.ok) {  
    const errorText = await response.text(); // Obtener el texto completo en caso de error  
    console.error('Error al crear filial:', errorText);  
    throw new Error(`Error al crear filial: ${response.statusText}`);  
  }  

  return response.json();  
};  

// Función para actualizar una filial existente  
export const updateFilial = async (  
  id: number,  
  filialData: Omit<Filial, 'idFilial'>,  
): Promise<Filial> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    throw new Error('User is not authenticated or token is missing');  
  }  

  const response = await fetch(`${apiUrl}/filiales/${id}`, {  
    method: 'PUT',  
    headers: {  
      'Content-Type': 'application/json',  
      Authorization: `Bearer ${authData.token}`,  
    },  
    body: JSON.stringify(filialData),  
  });  

  if (!response.ok) {  
    throw new Error('Error al actualizar filial');  
  }  

  return response.json();  
};  

// Función para eliminar una filial  
export const deleteFilial = async (id: number): Promise<void> => {  
  const authData = isAuthenticated(); // Verificar autenticación  

  if (!authData || !authData.token) {  
    console.error('User is not authenticated or token is missing');  
    return; // Salir si no está autenticado  
  }  

  const response = await fetch(`${apiUrl}/filiales/${id}`, {  
    method: 'DELETE',  
    headers: {  
      Authorization: `Bearer ${authData.token}`,  
    },  
  });  

  if (!response.ok) {  
    throw new Error('Error al eliminar filial');  
  }  
};