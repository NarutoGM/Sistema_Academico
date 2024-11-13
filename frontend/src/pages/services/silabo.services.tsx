import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated

// Definición de la URL de la API directamente
const apiUrl = 'http://127.0.0.1:8000/api'; // Cambia esta URL a la que necesites

// Función para obtener el token desde el almacenamiento
const getToken = (): string | null => {
  return localStorage.getItem('token'); // O sessionStorage, dependiendo de dónde almacenes el token
};


export interface Docente {
    idDocente: number;
    nombre: string;
}

export interface Curso {
    idCurso: number;
    name: string;
    estado_silabo: string;
}

export interface Filial {
    idFilial: number;
    name: string;
}

export interface Semestre_academico {
    idSemestreAcademico: number;
    nomSemestre: string;
    // Añade aquí otras propiedades que pueda tener un curso
}

export interface CargaDocente {
    idCargaDocente: number;
    idFilial: number;
    idDocente: number;
    fAsignacion: string;
    estado: boolean;
    grupo: string;
    idSemestreAcademico: number;
    idMalla: number;
    idCurso: number;
    idEscuela: number;
    idDirector: number;
    curso?: Curso; // Campo opcional que hace referencia a un objeto de tipo Curso
    filial?: Filial; 
    semestre_academico?: Semestre_academico; 

}


// En silabo.services.ts o en el archivo donde esté definida
export interface CargaDocente {
    idCargaDocente: number;
    idFilial: number;
    idDocente: number;
    fAsignacion: string;
    estado: boolean;
    grupo: string;
    idSemestreAcademico: number;
    idMalla: number;
    idCurso: number;
    idEscuela: number;
    idDirector: number;
}


interface MisCursosResponse {
    docente: Docente;
    cargadocente: CargaDocente[];
}

// Función para obtener los cursos asignados
export const getMisCursos = async (): Promise<MisCursosResponse> => {
    const authData = isAuthenticated();

    if (!authData || !authData.token) {
        throw new Error('User is not authenticated or token is missing');
    }

    const response = await fetch(`${apiUrl}/miscursos`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
        },
    });

    // Revisar el estado y el cuerpo de la respuesta
  //  console.log("Estado de respuesta:", response.status);
   // console.log("Encabezados de respuesta:", response.headers);

    if (!response.ok) {
        throw new Error('Error al obtener los cursos asignados');
    }

    // Leer el cuerpo de la respuesta solo una vez
    const data = await response.json();
    console.log("Datos recibidos:", data);
    return data;
};


