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

// Función para obtener todos los roles
export const getUsuarios = async (): Promise<Rol[]> => {
  const token = getToken(); // Obtiene el token de autorización
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
    throw new Error('Error al obtener users'); // Lanza un error si la respuesta no es ok
  }

  return response.json(); // Devuelve la respuesta en formato JSON
};


// Función para crear un nuevo rol
export const createRol = async (token: string, formData: { name: string }) => {
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

export const savePermisos = async (token: string, rolId: number, permisos: { id: number }[]) => {
  try {
    const bodyToSend = {
      rol_id: rolId,
      permisos: permisos,
    };

    const response = await fetch(`http://127.0.0.1:8000/api/roles/guardar-permisos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyToSend),
    });

    // Verifica si la respuesta no es OK
    if (!response.ok) {
      // Captura la respuesta del servidor
      const errorResponse = await response.json();
      console.error('Error al guardar los permisos:', errorResponse);
      throw new Error(errorResponse.message || 'Error desconocido al guardar permisos');
    }

    const result = await response.json();
    console.log('Permisos guardados:', result);
    return result; // Retorna el resultado para su uso posterior
  } catch (error: any) {
    console.error('Error guardando permisos:', error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
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
// Función para obtener todos los permisos
export const getRoles = async (): Promise<Permiso[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await fetch(`${apiUrl}/rolesdisponibles`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener permisos');
  }

  return response.json();
};


export const saveRoles = async (token: string, user_id: number, roles: { id: number }[]) => {
  try {
    const bodyToSend = {
      user_id: user_id,
      roles: roles,
    };

    const response = await fetch(`http://127.0.0.1:8000/api/roles/guardar-roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyToSend),
    });

    // Verifica si la respuesta no es OK
    if (!response.ok) {
      // Captura la respuesta del servidor
      const errorResponse = await response.json();
      console.error('Error al guardar los roles:', errorResponse);
      throw new Error(errorResponse.message || 'Error desconocido al guardar roles');
    }

    const result = await response.json();
    console.log('roles guardados:', result);
    return result; // Retorna el resultado para su uso posterior
  } catch (error: any) {
    console.error('Error guardando roles:', error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};



// Función para crear un nuevo permiso
export const createPermiso = async (permisoData: Omit<Permiso, 'id'>): Promise<Permiso> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/permisos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(permisoData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error al crear permiso:', errorData);
    throw new Error(`Error al crear permiso: ${errorData.message || response.statusText}`);
  }

  return response.json();
};

// Función para obtener un permiso por su ID
export const getPermisoById = async (id: number): Promise<Permiso> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/permisos/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener permiso');
  }
  return response.json();
};

// Función para actualizar un permiso
export const updatePermiso = async (id: number, permisoData: Omit<Permiso, 'id'>): Promise<Permiso> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/permisos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(permisoData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar permiso');
  }
  return response.json();
};

// Función para eliminar un permiso
export const deletePermiso = async (id: number): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${apiUrl}/permisos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar permiso');
  }
};
