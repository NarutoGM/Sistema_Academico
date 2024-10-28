import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated

// Definición de la URL de la API directamente
const apiUrl = 'http://127.0.0.1:8000/api'; // Cambia esta URL a la que necesites

// Función para obtener el token desde el almacenamiento
const getToken = (): string | null => {
  return localStorage.getItem('token'); // O sessionStorage, dependiendo de dónde almacenes el token
};

// Definición de la interfaz Escuela
export interface Escuela {
  idEscuela: number;
  name: string;
  idFacultad: number;
}

// Función para obtener todas las escuelas
export const getEscuelas = async (): Promise<Escuela[]> => {
  const authData = isAuthenticated(); // Verificar autenticación

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/escuelas`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener escuelas');
  }

  return response.json();
};

// Función para crear una nueva escuela
export const createEscuela = async (
  escuelaData: Omit<Escuela, 'idEscuela'>,
): Promise<Escuela> => {
  const authData = isAuthenticated(); // Verificar autenticación

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/escuelas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authData.token}`,
    },
    body: JSON.stringify(escuelaData),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Obtener el texto completo
    console.error('Error al crear escuela:', errorText);
    throw new Error(`Error al crear escuela: ${response.statusText}`);
  }

  return response.json();
};

// Función para actualizar una escuela existente
export const updateEscuela = async (
  id: number,
  escuelaData: Omit<Escuela, 'idEscuela'>,
): Promise<Escuela> => {
  const authData = isAuthenticated(); // Verificar autenticación

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/escuelas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authData.token}`,
    },
    body: JSON.stringify(escuelaData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar escuela');
  }
  return response.json();
};

// Función para eliminar una escuela
export const deleteEscuela = async (id: number): Promise<void> => {
  const authData = isAuthenticated(); // Verificar autenticación

  if (!authData || !authData.token) {
    console.error('User is not authenticated or token is missing');
    return; // Salir si no está autenticado
  }

  const response = await fetch(`${apiUrl}/escuelas/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authData.token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar escuela');
  }
};
