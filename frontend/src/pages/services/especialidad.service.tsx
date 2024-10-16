// api.ts
import Cookies from 'js-cookie';

const apiUrl = "http://127.0.0.1:8000/api"; 

const getToken = (): string | null => {
  const token = Cookies.get('token') ?? null; 
  if (!token) {
    console.error('Token no encontrado en Cookies.');
  }
  return token;
};

export interface Especialidad {
  id: number;              // ID of the specialty
  nombre: string;          // Name of the specialty
  created_at: string | null;
  updated_at: string | null;
}

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
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al obtener especialidades');
  }

  return response.json();
};
