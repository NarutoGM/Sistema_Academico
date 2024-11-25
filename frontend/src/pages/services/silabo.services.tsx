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
    regimen_curso?: R;

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
    prerequisitos: string;

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
    nomdocente: string;
    apedocente: string;
    email: string;

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


export const enviarinfoSilabo = async (silaboData: any): Promise<any> => {
    const authData = isAuthenticated();
    console.log("hola si se esta enviando");

    if (!authData || !authData.token) {
        throw new Error('User is not authenticated or token is missing');
    }

    // Crear un objeto FormData
    const formData = new FormData();
    console.log("Contenido HTML: ", silaboData);

    // Agregar campos de texto (campos de datos adicionales)
    formData.append("idCargaDocente", silaboData.idCargaDocente.toString());
    formData.append("idDocente", silaboData.idDocente.toString());
    formData.append("idFilial", silaboData.idFilial.toString());
    formData.append("idDirector", silaboData.idDirector?.toString() || ""); // Maneja null o undefined
    formData.append("numero", silaboData.numero.toString() || ""); // Convertir el número a string
    if(silaboData.observaciones){
    formData.append("observaciones", silaboData.observaciones.toString() || ""); // Convertir el número a string
    }

    // Enviar el contenido HTML (ya no el PDF)
    if (silaboData.documentoHtml) {
        // Verificar que el contenido HTML se va a enviar correctamente
        console.log("Contenido HTML: ", silaboData.documentoHtml);
        formData.append("documentoHtml", silaboData.documentoHtml);  // Enviar el HTML como texto
    }

    try {
        // Realizar la solicitud POST con FormData
        const response = await fetch(`${apiUrl}/gestionarsilabo`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authData.token}`,
                // No necesitamos Content-Type porque fetch lo maneja automáticamente con FormData
            },
            body: formData, // Enviamos el FormData que contiene los datos y el HTML
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error al enviar los datos del sílabo');
        }

        // Procesar la respuesta como JSON
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        return data; // Retornar los datos recibidos del servidor
    } catch (error) {
        console.error("Error al enviar los datos del sílabo:", error);
        throw error; // Re-lanzamos el error para manejarlo fuera de esta función
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
