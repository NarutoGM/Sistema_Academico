// Definición de la URL de la API directamente
const apiUrl = "http://127.0.0.1:8000/api"; // Cambia esta URL a la que necesites

// Define una función para obtener el token desde el almacenamiento (por ejemplo, localStorage o sessionStorage)
const getToken = (): string | null => {
  return localStorage.getItem('token'); // O sessionStorage, dependiendo de dónde almacenes el token
};

export interface Especialidad {
  id: number;
  descripcion: string;
  asesorFree: boolean;
  idResponsableArea: number; // Nuevo campo
  idResponsableSecretaria: number; // Nuevo campo
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

// Función para obtener todas las especialidades
export const getEspecialidades = async (): Promise<Especialidad[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/especialidades`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener especialidades');
  }

  return response.json();
};

// Función para crear una nueva especialidad
export const createEspecialidad = async (especialidadData: Omit<Especialidad, 'id'>): Promise<Especialidad> => {
    const token = getToken();
    const response = await fetch(`${apiUrl}/especialidades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(especialidadData),
    });
  
    if (!response.ok) {
      const errorData = await response.json(); // Intenta obtener el cuerpo de la respuesta
      console.error('Error al crear especialidad:', errorData);
      throw new Error(`Error al crear especialidad: ${errorData.message || response.statusText}`);
    }
  
    return response.json();
  };

// Función para obtener una especialidad por su ID
export const getEspecialidadById = async (id: number): Promise<Especialidad> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/especialidades/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener especialidad');
  }
  return response.json();
};

// Función para actualizar una especialidad
export const updateEspecialidad = async (id: number, especialidadData: Omit<Especialidad, 'id'>): Promise<Especialidad> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/especialidades/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(especialidadData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar especialidad');
  }
  return response.json();
};

// Función para eliminar una especialidad
export const deleteEspecialidad = async (id: number): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/especialidades/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar especialidad');
  }
};