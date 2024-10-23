import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated

// Definición de la URL de la API directamente
const apiUrl = 'http://127.0.0.1:8000/api'; // Cambia esta URL a la que necesites

// Función para obtener el token desde el almacenamiento
const getToken = (): string | null => {
  return localStorage.getItem('token'); // O sessionStorage, dependiendo de dónde almacenes el token
};

export interface Permiso {
  id: number;
  descripcion: string;
  estado: boolean;
}

// Función para obtener todos los permisos
export const getPermisos = async (): Promise<Permiso[]> => {
  const authData = isAuthenticated(); // Verificar autenticación
  console.log(authData);

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/permisos`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener permisos');
  }

  return response.json();
};

// Función para crear un nuevo permiso
export const createPermiso = async (
  permisoData: Omit<Permiso, 'id'>,
): Promise<Permiso> => {
  const authData = isAuthenticated(); // Verificar autenticación
  console.log(authData);

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/permisoscrear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authData.token}`,
    },
    body: JSON.stringify(permisoData),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Obtener el texto completo
    console.error('Error al crear permiso:', errorText);
    throw new Error(`Error al crear permiso: ${response.statusText}`);
  }

  return response.json();
};

// Función para actualizar un permiso
export const updatePermiso = async (
  id: number,
  permisoData: Omit<Permiso, 'id'>,
): Promise<Permiso> => {
  const authData = isAuthenticated(); // Verificar autenticación
  console.log(authData);

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/permisos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authData.token}`,
    },
    body: JSON.stringify(permisoData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar permiso');
  }
  return response.json();
};

// Función para eliminar un permiso
export const deletePermiso = async (id: number): Promise<void> => {
  const authData = isAuthenticated(); // Verificar autenticación
  console.log(authData);

  if (!authData || !authData.token) {
    console.error('User is not authenticated or token is missing');
    return; // Salir si no está autenticado
  }

  const response = await fetch(`${apiUrl}/permisos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authData.token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar permiso');
  }
};
