import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated

// Definición de la URL de la API directamente
const apiUrl = "http://127.0.0.1:8000/api"; // Cambia esta URL a la que necesites

// Define una función para obtener el token desde el almacenamiento (por ejemplo, localStorage o sessionStorage)
const getToken = (): string | null => {
  return localStorage.getItem('token'); // O sessionStorage, dependiendo de dónde almacenes el token
};

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

// Función para crear una nueva persona
export const createUsuario = async (formData: FormData): Promise<any> => {
  const authData = isAuthenticated();
  const token = authData?.token;

  if (!token) {
    throw new Error('Token no disponible');
  }

  // Verifica que el campo name esté presente
  if (!formData.get('name')) {
    throw new Error('El campo name es requerido');
  }

  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('Error al crear la persona:', errorResponse);
    throw new Error(`Estado: ${response.status}, Mensaje: ${errorResponse.message || 'Error desconocido al crear persona'}`);
  }

  const result = await response.json();
  console.log('Persona creada:', result);
  return result;
};


// Función para obtener todos los usuarios
export const getUsuarios = async (): Promise<Rol[]> => {
  const authData = isAuthenticated(); // Obtiene los datos de autenticación
  const token = authData?.token; // Extrae el token

  if (!token) {
    throw new Error('Token no disponible'); // Lanza un error si no hay token
  }

  const response = await fetch(`${apiUrl}/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Incluye el token en los headers
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener usuarios'); // Lanza un error si la respuesta no es ok
  }

  return response.json(); // Devuelve la respuesta en formato JSON
};









// Función para obtener todos los permisos
export const getRoles = async (): Promise<Permiso[]> => {
  const authData = isAuthenticated(); // Obtiene los datos de autenticación
  const token = authData?.token; // Extrae el token

  if (!token) {
    throw new Error('Token no disponible'); // Lanza un error si no hay token
  }

  const response = await fetch(`${apiUrl}/rolesdisponibles`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener roles');
  }

  return response.json();
};

// Función para guardar roles a un usuario
export const saveRoles = async (user_id: number, roles: { id: number }[]) => {
 const authData = isAuthenticated(); // Obtiene los datos de autenticación
  const token = authData?.token; // Extrae el token

  if (!token) {
    throw new Error('Token no disponible'); // Lanza un error si no hay token
  }
  
  const bodyToSend = {
    user_id: user_id,
    roles: roles,
  };

  const response = await fetch(`${apiUrl}/roles/guardar-roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bodyToSend),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('Error al guardar los roles:', errorResponse);
    throw new Error(errorResponse.message || 'Error desconocido al guardar roles');
  }

  const result = await response.json();
  console.log('Roles guardados:', result);
  return result; // Retorna el resultado para su uso posterior
};


