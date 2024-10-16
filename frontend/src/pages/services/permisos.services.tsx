// Definición de la URL de la API directamente
const apiUrl = "http://127.0.0.1:8000/api"; // Cambia esta URL a la que necesites

// Define una función para obtener el token desde el almacenamiento (por ejemplo, localStorage o sessionStorage)
const getToken = (): string | null => {
  return localStorage.getItem('token'); // O sessionStorage, dependiendo de dónde almacenes el token
};

export interface Permiso {
  id: number;
  descripcion: string;
  estado: boolean;
}

// Función para iniciar sesión
export const login = async (email: string, password: string): Promise<string> => {
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Error al iniciar sesión');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token); // Guarda el token
  return data.token;
};

// Función para obtener todos los permisos
export const getPermisos = async (): Promise<Permiso[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/permisos`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener permisos');
  }

  return response.json();
};

// Función para crear un nuevo permiso
export const createPermiso = async (permisoData: Omit<Permiso, 'id'>): Promise<Permiso> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/permisos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(permisoData),
  });

  if (!response.ok) {
    const errorData = await response.json(); // Intenta obtener el cuerpo de la respuesta
    console.error('Error al crear permiso:', errorData);
    throw new Error(`Error al crear permiso: ${errorData.message || response.statusText}`);
  }

  return response.json();
};

// Función para obtener un permiso por su ID
export const getPermisoById = async (id: number): Promise<Permiso> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/permisos/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener permiso');
  }
  return response.json();
};

// Función para actualizar un permiso
export const updatePermiso = async (id: number, permisoData: Omit<Permiso, 'id'>): Promise<Permiso> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/permisos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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
  const token = getToken();
  const response = await fetch(`${apiUrl}/permisos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar permiso');
  }
};