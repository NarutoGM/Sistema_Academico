import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated

// Definición de la URL de la API directamente
const apiUrl = "http://127.0.0.1:8000/api"; // Cambia esta URL a la que necesites

// Define una función para obtener el token desde el almacenamiento (por ejemplo, localStorage o sessionStorage)


export interface Rol {
  id: number;
  name: string;
  guard_name: string;
}

export interface Permiso {
  id: number;
  descripcion: string;
  estado: boolean;
}


// Función para obtener todos los roles
export const getRoles = async (): Promise<Rol[]> => {

  const authData = isAuthenticated(); // Verificar autenticación
  console.log(authData);

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/roles`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authData.token}`, // Incluye el token en los headers
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener roles'); // Lanza un error si la respuesta no es ok
  }

  return response.json(); // Devuelve la respuesta en formato JSON
};


// Función para crear un nuevo rol
export const createRol = async ( formData: { name: string }) => {

  const authData = isAuthenticated(); // Verificar autenticación
  console.log(authData);

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }
  
  const response = await fetch(`http://127.0.0.1:8000/api/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authData.token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'Error creando el rol');
  }

  return await response.json();
};

export const savePermisos = async ( rolId: number, permisos: { id: number }[]) => {
  try {

    const authData = isAuthenticated(); // Verificar autenticación
    console.log(authData);
  
    if (!authData || !authData.token) {
      throw new Error('User is not authenticated or token is missing');
    }

    const bodyToSend = {
      rol_id: rolId,
      permisos: permisos,
    };

    const response = await fetch(`http://127.0.0.1:8000/api/roles/guardar-permisos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData.token}`,
      },
      body: JSON.stringify(bodyToSend),
    });

    // Verifica si la respuesta no es OK
    if (!response.ok) {
      // Captura la respuesta del servidor
      const errorResponse = await response.json();
      console.error('Error al guardar los permisos:', errorResponse);
      throw new Error(errorResponse.message || 'Error desconocido al guardar permisos');
    }

    const result = await response.json();
    console.log('Permisos guardados:', result);
    return result; // Retorna el resultado para su uso posterior
  } catch (error: any) {
    console.error('Error guardando permisos:', error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};






// Función para obtener todos los permisos
export const getPermisos = async (): Promise<Permiso[]> => {

  const authData = isAuthenticated(); // Verificar autenticación
  console.log(authData);

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }



  const response = await fetch(`${apiUrl}/permisosdisponibles`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener permisos');
  }

  return response.json();
};

export const deleteRol = async (id: number): Promise<void> => {

  const authData = isAuthenticated(); // Verificar autenticación
  console.log(authData);

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }
  const response = await fetch(`${apiUrl}/roles/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authData.token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar rol');
  }
};

