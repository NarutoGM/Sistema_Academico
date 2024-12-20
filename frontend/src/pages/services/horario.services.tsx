import { isAuthenticated } from '@/utils/auth'; // Importa tu función isAuthenticated
import { Escuela } from './rolesyusuarios.services';

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

export interface RegimenCurso {
    idRegimenCurso: number;
    nomRegimen: string;
}


export interface Curso {
    idCurso: number;
    name: string;
    estado_silabo: string;
    documento: string;
    area?: Area; 
    facultad?: Facultad;
    departamento?: Departamento;
    creditos?: string; 
    tipo_curso?: TipoCurso;
    regimen_curso?: RegimenCurso;
    hTeoricas: string;
    hPracticas: string;
    hLaboratorio: string;
    hRetroalimentacion: string;
    nGrupos: number;
}
export interface Area {
    idArea: number;
    nomArea: string;
}
export interface TipoCurso {
    idTipoCurso: number;
    descripcion: string;
}


export interface Facultad {
    idFacultad: number;
    nomFacultad: string;
}
export interface Departamento {
    idDepartamento: number;
    nomDepartamento: string;
}

export interface Filial {
    idFilial: number;
    name: string;
}

export interface Semestre_academico {
    idSemestreAcademico: number;
    nomSemestre: string;
    fInicio:string;
    fTermino:string;
    fLimiteSilabo:string;
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
    escuela?: Escuela; // Campo opcional que hace referencia a un objeto de tipo Curso
    ciclo: string;
    semestre: string;
    prerequisitos: string;
    email: string;
    profesion: string;
    silabo?: Silabo;
    nomdocente: string;
    apedocente: string;
    asignacionEstado: number;

}

export interface Semana {
    idSemana: number;
    idCargaDocente: number;
    idFilial: number;
    idDocente: number;
    organizacion: string;
    estrategias: string;
    evidencias: string;
    instrumentos: string;
    nomSem: string;
 

}


export interface Silabo {
    idCargaDocente: number;
    idFilial: number;
    idDocente: number;
    documento?: string;
    sumilla?: string;
    unidadcompetencia?: string;
    competenciasgenerales?: string;
    capacidadesterminales1?: string;
    capacidadesterminales2?: string;
    capacidadesterminales3?: string;
    resultados?: string;
    resultadosaprendizajes1?: string; // Campo opcional que hace referencia a un objeto de tipo Curso
    resultadosaprendizajes2?: string; // Campo opcional que hace referencia a un objeto de tipo Curso
    resultadosaprendizajes3?: string; // Campo opcional que hace referencia a un objeto de tipo Curso
    activo?: boolean; 

    estado?: number; 
    sistemaevaluacion?: string; 
    infosistemaevaluacion?: string; // Campo opcional que hace referencia a un objeto de tipo Curso
    fEnvio?: Date; 
    tutoria?: string; // Campo opcional que hace referencia a un objeto de tipo Curso
    observaciones?: string; // Campo opcional que hace referencia a un objeto de tipo Curso

    referencias?: string;
    semanas?: Semana[];


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


export const getMisSilabos = async (): Promise<any> => {
    const authData = isAuthenticated();

    if (!authData || !authData.token) {
        throw new Error('User is not authenticated or token is missing');
    }

    const response = await fetch(`${apiUrl}/versilabos`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los sílabos asignados');
    }

    const data = await response.json();
    console.log("Sílabos recibidos:", data);
    return data;
};

export const getReporte = async (): Promise<any> => {
    const authData = isAuthenticated();

    if (!authData || !authData.token) {
        throw new Error('User is not authenticated or token is missing');
    }

    const response = await fetch(`${apiUrl}/reportesilabos`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los sílabos asignados');
    }

    const data = await response.json();
    console.log("Sílabos recibidos:", data);
    return data;
};

export const getCargaHorario = async (): Promise<any> => {
    const authData = isAuthenticated();

    if (!authData || !authData.token) {
        throw new Error('User is not authenticated or token is missing');
    }

    const response = await fetch(`${apiUrl}/verhorarios`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los sílabos asignados');
    }

    const data = await response.json();
    console.log("Sílabos recibidos:", data);
    return data;
};

export const getCursosFiltrados = async (): Promise<any> => {
    const authData = isAuthenticated();

    if (!authData || !authData.token) {
        throw new Error('User is not authenticated or token is missing');
    }

    const response = await fetch(`${apiUrl}/cursosFiltrados`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los sílabos asignados');
    }

    const data = await response.json();
    console.log("Cursos filtrados:", data);
    return data;
};


export const enviarinfoSilabo = async (selectedCarga: any): Promise<any> => {
    const authData = isAuthenticated();
    console.log("Iniciando envío del sílabo...");

    if (!authData || !authData.token) {
        throw new Error('El usuario no está autenticado o falta el token');
    }

    try {
        // Realizar la solicitud POST directamente con JSON
        const response = await fetch(`${apiUrl}/gestionarsilabo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Indica que los datos enviados son JSON
                Authorization: `Bearer ${authData.token}`, // Incluimos el token
            },
            body: JSON.stringify(selectedCarga), // Envía el objeto directamente como JSON
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error en la respuesta del servidor:", errorText);
            throw new Error('Error al enviar los datos del sílabo');
        }

        // Procesar la respuesta como JSON
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        return data; // Retornar los datos recibidos del servidor
    } catch (error) {
        console.error("Error al enviar los datos del sílabo:", error);
        throw error; // Re-lanzar el error para manejarlo fuera de esta función
    }
};





export const enviarinfoHorario = async (HorarioData: any): Promise<any> => {
    const authData = isAuthenticated();

    if (!authData || !authData.token) {
        throw new Error('User is not authenticated or token is missing');
    }

    const response = await fetch(`${apiUrl}/gestionarhorarios`, {
        method: 'POST', // Cambiar a POST para enviar datos
        headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(HorarioData), // Agregar el cuerpo con los datos a enviar
    });

    if (!response.ok) {
        throw new Error('Error al enviar los datos del sílabo');
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    return data;
};

// horariosApi.ts

export const guardarHorarios = async (horarios: any[], idCargaDocente: number, idFilial: number, idDocente: number): Promise<void> => {
    const authData = isAuthenticated();

    if (!authData || !authData.token) {
        throw new Error('User is not authenticated or token is missing');
    }
    console.log(idCargaDocente, idFilial, idDocente);

    // Filtrar los campos relevantes antes de enviarlos
    const horariosFiltrados = horarios.map((horario) => ({
        idCargaDocente: idCargaDocente,
        idFilial: idFilial,
        idDocente: idDocente,
        aula: horario.aula,
        dia: horario.dia,
        grupo: horario.grupo,
        horaFin: horario.horaFin,
        horaInicio: horario.horaInicio,
        tipoSesion: horario.tipoSesion
    }));

    console.log(horariosFiltrados);

    const response = await fetch(`${apiUrl}/guardar-horarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`,
        },
        body: JSON.stringify({ horarios: horariosFiltrados, idCargaDocente: idCargaDocente, idFilial: idFilial, idDocente: idDocente }),
    });

    if (!response.ok) {
        throw new Error('Error al guardar los horarios');
    }

    // Obtener la respuesta JSON
    const data = await response.json();
    console.log("Datos recibidos:", data);

    // Aquí puedes agregar el código necesario para manejar la respuesta
    return data;
};

