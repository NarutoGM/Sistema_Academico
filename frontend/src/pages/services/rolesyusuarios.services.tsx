import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated

// Definición de la URL de la API directamente
const apiUrl = "http://127.0.0.1:8000/api"; // Cambia esta URL a la que necesites

// Define una función para obtener el token desde el almacenamiento (por ejemplo, localStorage o sessionStorage)
const getToken = (): string | null => {
  return localStorage.getItem('token'); // O sessionStorage, dependiendo de dónde almacenes el token
};

// Interfaces para tipado
export interface Rol {
  id: number;
  name: string;
  
  created_at?: string;
  updated_at?: string;
  pivot?: {
    user_id: number;
    role_id: number;
  };
}

export interface Docente {
  idDirector?: number; // Make it optional
  id?: number;
  idEscuela: number;
}

export interface DirectorEscuela {
  idDirector: number;
  id?: number; // Make `id` optional
  idEscuela: number;
  estado?: boolean;
}

export interface User {
  id: number;
  name: string;
  lastname: string;
  roles: Rol[];
  email: string;
  docente: Docente | null;
  directorEscuela: DirectorEscuela | null;
  filialId: number[];
  filialInfo: {
    idRegimen: number;
    idCategoria: number;
    idCondicion: number;
    estado: boolean;

  } | null;
}

export interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

export interface Condicion {
  idCondicion: number;
  nombreCondicion: string;
}

export interface Regimen {
  idRegimen: number;
  nombreRegimen: string;
}

export interface FilialInfo {
  idRegimen: number;
  idCondicion: number;
  idCategoria:number;
  estado:boolean,
}

export interface Filial {
  idFilial: number;
  name: string;
}

export interface Escuela {
  idEscuela: number;
  name: string;
}

export interface ConjuntoDatos {
  categorias: Categoria[];
  condiciones: Condicion[];
  escuelas: Escuela[];
  filiales: Filial[];
  regimenes: Regimen[];
  roles: Rol[];
  users: User[];
}


export interface Permiso {
  id: number;
  descripcion: string;
  estado: boolean;
}


export const createUsuario = async (usuarioData: {
  name: string;
  lastname: string;
  dni: string;
  email: string;
  password: string;
}): Promise<{ [key: string]: string[] } | void> => { // Ajusta el tipo para reflejar los errores de validación
  const authData = isAuthenticated(); 
  const token = authData?.token; 

  if (!token) {
    throw new Error('Token no disponible'); 
  }

  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    if (response.status === 422) { 
      const errorData = await response.json(); 
      return errorData.errors; // Devuelve los errores de validación al frontend
    }
    throw new Error('Error al crear el usuario');
  }
};







// Función para obtener todos los usuarios
export const getUsuarios = async (): Promise<Rol[]> => {
  const authData = isAuthenticated(); // Obtiene los datos de autenticación
  const token = authData?.token; // Extrae el token

  if (!token) {
    throw new Error('Token no disponible'); // Lanza un error si no hay token
  }

  const response = await fetch(`${apiUrl}/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Incluye el token en los headers
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener usuarios'); // Lanza un error si la respuesta no es ok
  }

  return response.json(); // Devuelve la respuesta en formato JSON
};


// Función para obtener todos los usuarios
export const getInfoAdministrarUsuarios = async (): Promise<ConjuntoDatos> => {
  const authData = isAuthenticated(); // Obtiene los datos de autenticación
  const token = authData?.token; // Extrae el token

  if (!token) {
    throw new Error('Token no disponible'); // Lanza un error si no hay token
  }

  const response = await fetch(`${apiUrl}/administrarusuarios`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Incluye el token en los headers
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener usuarios'); // Lanza un error si la respuesta no es ok
  }

  return response.json(); // Devuelve la respuesta en formato JSON
};



export const getRoles = async (): Promise<Rol[]> => {
  const authData = isAuthenticated(); // Obtiene los datos de autenticación
  const token = authData?.token; // Extrae el token
  if (!token) {
    throw new Error('Token no disponible'); // Lanza un error si no hay token
  }

  const response = await fetch(`${apiUrl}/rolesdisponibles`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener roles');
  }
  return response.json();
};

// Función para guardar roles a un usuario
// Función para guardar roles a un usuario, incluyendo datos adicionales
export const saveRoles = async (
  user_id: number,
  roles: { id: number }[],
  additionalData: any // Tipo de dato que corresponda a los datos adicionales
) => {
  const authData = isAuthenticated(); // Obtiene los datos de autenticación
  const token = authData?.token; // Extrae el token

  if (!token) {
    throw new Error('Token no disponible'); // Lanza un error si no hay token
  }
  
  const bodyToSend = {
    user_id: user_id,
    roles: roles,
    additional_data: additionalData, // Incluye el dato adicional en el cuerpo
  };

  // Verifica qué datos se están enviando
  console.log("Body to Send:", bodyToSend);

  const response = await fetch(`${apiUrl}/roles/guardar-roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bodyToSend),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    console.error('Error al guardar los roles:', errorResponse);
    throw new Error(errorResponse.message || 'Error desconocido al guardar roles');
  }

  const result = await response.json();
  console.log('Roles guardados:', result);
  return result; // Retorna el resultado para su uso posterior
};


export const getMisPermisos: () => Promise<Permiso[] | { permisos: Permiso[] }> = async () => {
  const authData = isAuthenticated(); // Verificar autenticación

  if (!authData || !authData.token) {
    throw new Error('User is not authenticated or token is missing');
  }

  const response = await fetch(`${apiUrl}/obtenerMisPermisos`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener permisos');
  }

  return response.json();
};