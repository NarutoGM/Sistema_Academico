import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated

// Definición de la URL de la API directamente
const apiUrl = 'http://127.0.0.1:8000/api'; // Cambia esta URL a la que necesites


// Función para obtener el token de acceso desde Laravel
export const getAccessToken = async (): Promise<string> => {
    const authData = isAuthenticated(); // Verificar autenticación
    console.log(authData);
  
    if (!authData || !authData.token) {
      throw new Error('User is not authenticated or token is missing');
    }
  
    const response = await fetch(`${apiUrl}/generate-token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authData.token}`, // Autenticar usuario
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener token de acceso');
    }
  
    const data = await response.json();
    if (!data.token) {
      throw new Error('No token returned from server');
    }
  
    return data.token;
  };
  