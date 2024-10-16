import Cookies from 'js-cookie';

const apiUrl = "http://127.0.0.1:8000/api"; 

const getToken = (): string | null => {
  const token = Cookies.get('token') ?? null; 
  if (!token) {
    console.error('Token no encontrado en Cookies.');
  }
  return token;
};

export interface Rol {
  id: number;          // ID del rol
  name: string;       // Nombre del rol
  guard_name: string;  // Guard name del rol
}

export const getRoles = async (): Promise<Rol[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/roles`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al obtener roles');
  }

  return response.json();
};
