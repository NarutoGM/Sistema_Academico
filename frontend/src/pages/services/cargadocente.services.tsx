import { isAuthenticated } from '@/utils/auth';

const apiUrl = 'http://localhost:8000/api';

export interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  courseCount: number;
  status: 'Sin Iniciar' | 'Incompleto' | 'Completado';
}

export interface Curso {
  id: number;
  name: string;
  ciclo: string;
  escuela: string;
}

export interface Filial {
  idFilial: number;
  name: string;
}

// Función para obtener las filiales
export const getFiliales = async (): Promise<Filial[]> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch(`${apiUrl}/filiales`, {
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener filiales');
  }

  return response.json();
}



// Obtener la lista de cursos
export const getCursos = async (): Promise<Curso[]> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch(`${apiUrl}/cursos`, {
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener cursos');
  }

  return response.json();
};

// Asignar cursos a un docente
export const asignarCursosADocente = async (docenteId: number, cursos: number[]): Promise<void> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch(`${apiUrl}/docentes/${docenteId}/asignar-cursos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cursos }),
  });

  if (!response.ok) {
    throw new Error('Error al asignar cursos');
  }
};


// Obtener la lista de docentes asociados a una filial específica
export const getDocentesByFilial = async (idFilial: number): Promise<Docente[]> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated');
  }

  console.log('Token:', authData.token);

  const response = await fetch(`${apiUrl}/filiales/${idFilial}/docentes`, {
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener docentes de la filial');
  }

  return response.json();
};
