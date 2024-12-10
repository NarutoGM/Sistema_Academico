import { isAuthenticated } from '@/utils/auth';

const apiUrl = 'http://localhost:8000/api';

export interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  regimen: string;
  courseCount: number;
  status: 'Sin Iniciar' | 'Incompleto' | 'Completado';
}

export interface Filial {
  idFilial: number;
  name: string;
}

export interface Escuela {
  idEscuela: number;
  name: string;
}

export interface Malla {
  idMalla: number;
  año: number;
  estado: string;
}

export interface SemestreAcademico {
  idSemestreAcademico: number;
  nomSemestre: string;
  añoAcademico: string;
}

export interface Curso {
  idCurso: number;
  nombreCurso: string;
  estado: string;
}

export interface CargaDocente{
  idCargaDocente: number;
  idFilial: number;
  id: number;
  idSemestreAcademico: number;
  idMalla: number;
  idCurso: number;
  nombreCurso: string;
  idEscuela: number;
  idDirector: number;
  isNuevo:boolean;
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
};

// Obtener la lista de docentes asociados a una filial específica
export const getDocentesByFilial = async (
  idFilial: number,
): Promise<Docente[]> => {
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

// Obtener la lista de escuelas
export const getEscuelas = async (): Promise<Escuela[]> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch(`${apiUrl}/escuelas`, {
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las escuelas');
  }

  return response.json();
};

// Obtener la malla de una escuela específica para el año 2018
export const getMallaByEscuela = async (
  idEscuela: number,
): Promise<Malla | null> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated');
  }
  const response = await fetch(`${apiUrl}/escuelas/${idEscuela}/malla`, {
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No se encontró malla
    }
    throw new Error('Error al obtener la malla');
  }

  return response.json();
};

// Obtener la lista de semestres académicos
export const getSemestres = async (): Promise<SemestreAcademico[]> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated');
  }
  const response = await fetch(`${apiUrl}/semestreacademico`, {
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los semestres académicos');
  }

  return response.json();
};

// Obtener la lista de cursos filtrados por Malla, Semestre y Escuela
export const getCursosByMallaAndSemestre = async (
  idEscuela: number,
  idMalla: number,
  idSemestreAcademico: number,
): Promise<Curso[]> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('User is not authenticated');
  }
  const response = await fetch(
    `${apiUrl}/cursosAperturados/${idEscuela}/${idMalla}/${idSemestreAcademico}`,
    {
      headers: {
        Authorization: `Bearer ${authData.token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Error al obtener los cursos');
  }

  return response.json();
};

//Obtener lista de cursos asignados a un docente
export const getCursosAsignados = async (
  idDocente: number,
  idFilial: number
): Promise< CargaDocente[] > => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('El usuario no está autenticado');
  }

  const response = await fetch(`${apiUrl}/cargadocente/${idDocente}/${idFilial}/asignados`, {
    headers: {
      Authorization: `Bearer ${authData.token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener los cursos asignados');
  }

  return await response.json();
};


//Guardar cursos asignados a un docente
export const saveCursosAsignados = async (cursosAsignados: any[]): Promise<void> => {
  const authData = isAuthenticated();
  if (!authData || !authData.token) {
    throw new Error('El usuario no está autenticado');
  }

  console.log('Datos enviados al backend:', JSON.stringify(cursosAsignados, null, 2));

  const response = await fetch(`${apiUrl}/cargadocente`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authData.token}`,
    },
    body: JSON.stringify(cursosAsignados),
    
  });

  console.log('Respuesta del backend:', response);

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error desde el backend:', errorData);
    throw new Error(errorData.message || 'Error al guardar los cursos asignados frontend');
  }
  return await response.json();
};


