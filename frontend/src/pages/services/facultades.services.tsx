import { isAuthenticated } from '@/utils/auth'; // Importa la función isAuthenticated

const apiUrl = 'http://127.0.0.1:8000/api'; // Asegúrate de ajustar la URL según la configuración de tu API

export interface Facultad {
  idFacultad: number;
  name: string;
}

// Obtener todas las facultades
export const getFacultades = async (): Promise<Facultad[]> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/facultades`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener facultades');
  }

  return response.json();
};

// Crear una nueva facultad
export const createFacultad = async (facultadData: Omit<Facultad, 'idFacultad'>): Promise<Facultad> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/facultades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authData.token}`,
    },
    body: JSON.stringify(facultadData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error al crear facultad:', errorText);
    throw new Error(`Error al crear facultad: ${response.statusText}`);
  }

  return response.json();
};

// Obtener una facultad específica por ID
export const getFacultadById = async (id: number): Promise<Facultad> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/facultades/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener la facultad');
  }

  return response.json();
};

// Actualizar una facultad existente
export const updateFacultad = async (id: number, facultadData: Omit<Facultad, 'idFacultad'>): Promise<Facultad> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/facultades/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authData.token}`,
    },
    body: JSON.stringify(facultadData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la facultad');
  }

  return response.json();
};

// Eliminar una facultad
export const deleteFacultad = async (id: number): Promise<void> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    console.error('User is not authenticated or token is missing');
    return;
  }

  const response = await fetch(`${apiUrl}/facultades/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authData.token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la facultad');
  }
};
