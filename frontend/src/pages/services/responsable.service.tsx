import Cookies from 'js-cookie';

const apiUrl = "http://127.0.0.1:8000/api"; 

const getToken = (): string | null => {
  const token = Cookies.get('token') ?? null; 
  if (!token) {
    console.error('Token no encontrado en Cookies.');
  }
  return token;
};

export interface Responsable {
  id: number;
  apellidos: string;
  nombres: string;
  idRol: number;
  rol: string;
  idUnidad: number;
  unidad: string;
  firmadigital: string;
  clavedigital: string;
}

export const getResponsables = async (): Promise<Responsable[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/responsables`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al obtener responsables');
  }

  return response.json();
};

// Nueva función para obtener un responsable por ID
export const getResponsable = async (id: number): Promise<Responsable> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/responsables/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al obtener responsable');
  }

  return response.json();
};

export const createResponsable = async (formData: FormData): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/responsables`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
    body: formData, 
  });

  if (!response.ok) {
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al crear responsable');
  }
};

// Nueva función para actualizar un responsable
export const updateResponsable = async (id: number, formData: FormData): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/responsables/${id}`, {
    method: 'POST', // Cambiado a POST para la actualización
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
    body: formData, 
  });

  if (!response.ok) {
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al actualizar responsable');
  }
};

export const deleteResponsable = async (id: number): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/responsables/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al eliminar responsable');
  }
};
