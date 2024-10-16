import Cookies from 'js-cookie';

const apiUrl = "http://127.0.0.1:8000/api";

// Función para obtener el token almacenado en las cookies
const getToken = (): string | null => {
  const token = Cookies.get('token') ?? null;
  if (!token) {
    console.error('Token no encontrado en Cookies.');
  }
  return token;
};

// Interfaz para las personas
export interface Persona {
  idEspecialidad: number;
  Nombres: string;
  Apellidos: string;
  DocIdentidad: string;
  TipoDocIdentidad: string;
  FechaNacim: string;  // Fecha en formato string
  Email: string;
  Celular: string;
  Direccion: string;
  Foto: string | File; // Puede ser una URL o un archivo
  Password: string;
}

// Servicio para obtener la lista de personas
export const getPersonas = async (): Promise<Persona[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/personas`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al obtener personas');
  }

  return response.json();
};

// Servicio para obtener una persona por ID y especialidad
export const getPersonaByIdAndEspecialidad = async (id: number, idEspecialidad: number): Promise<Persona> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/personas/${id}/${idEspecialidad}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al obtener persona');
  }

  return response.json();
};

export const createPersona = async (formData: FormData): Promise<Persona> => {
    const token = getToken();
    if (!token) {
      throw new Error('Token no disponible');
    }
  
    console.log(Array.from(formData.entries())); // Esto mostrará todos los campos en formData
  
    const response = await fetch(`${apiUrl}/personas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // No se incluye 'Content-Type' aquí, ya que el navegador se encarga de ello para FormData
      },
      body: formData,
    });
  
    if (!response.ok) {
      console.error(`Error en la solicitud: ${response.statusText}`);
      throw new Error('Error al crear persona');
    }
  
    return response.json();
  };
  
// Servicio para actualizar una persona (usando POST en lugar de PUT)
export const updatePersona = async (id: number, idEspecialidad: number, persona: Persona): Promise<Persona> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const formData = new FormData();
  formData.append('Nombres', persona.Nombres);
  formData.append('Apellidos', persona.Apellidos);
  formData.append('DocIdentidad', persona.DocIdentidad);
  formData.append('TipoDocIdentidad', persona.TipoDocIdentidad);
  formData.append('FechaNacim', persona.FechaNacim);
  formData.append('Email', persona.Email);
  formData.append('Celular', persona.Celular);
  formData.append('Direccion', persona.Direccion);
  formData.append('Foto', persona.Foto);

  formData.append('Password', persona.Password);

  if (typeof persona.Foto === 'object') {
    formData.append('Foto', persona.Foto); // Si la foto es un archivo, la añadimos
  }

  const response = await fetch(`${apiUrl}/personas/${id}/${idEspecialidad}`, {
    method: 'POST',  // Usando POST para la actualización
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al actualizar persona');
  }

  return response.json();
};

// Servicio para eliminar una persona
export const deletePersona = async (id: number, idEspecialidad: number): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/personas/${id}/${idEspecialidad}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Error en la solicitud: ${response.statusText}`);
    throw new Error('Error al eliminar persona');
  }
};
