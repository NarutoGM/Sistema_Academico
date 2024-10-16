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

// Función para obtener todos los Tramites
export const getTramites = async (): Promise<Rol[]> => {
  const token = getToken(); // Obtiene el token de autorización
  if (!token) {
    throw new Error('Token no disponible'); // Lanza un error si no hay token
  }

  const response = await fetch(`${apiUrl}/tramitesasesor`, { // Corregido aquí
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los trámites'); // Maneja posibles errores en la respuesta
  }

  return await response.json(); // Asegúrate de retornar la respuesta procesada
};




// Función para crear un nuevo rol
export const createRol = async (token: string, formData: { name: string; guard_name: string }) => {
  const response = await fetch(`http://127.0.0.1:8000/api/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || 'Error creando el rol');
  }

  return await response.json();
};



// Función para obtener un rol por su ID
export const getRolById = async (id: number): Promise<Rol> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/roles/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener rol');
  }
  return response.json();
};

// Función para actualizar un rol
export const updateRol = async (id: number, rolData: Omit<Rol, 'id'>): Promise<Rol> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/roles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(rolData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar rol');
  }
  return response.json();
};

// Función para eliminar un rol
export const deleteRol = async (id: number): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/roles/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar rol');
  }
};





