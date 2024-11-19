import { isAuthenticated } from '@/utils/auth'; // Importa la función isAuthenticated

const apiUrl = 'http://127.0.0.1:8000/api'; // Asegúrate de ajustar la URL según la configuración de tu API

export interface HorarioDocente {
    id: number;
    docente: string;
    ciclo: string;
    horario: string; // Ajustar según el tipo de datos esperado
  }
  

export interface Horario {
    idSemestreAcademico: number; // Clave primaria compuesta
    idFilial: number;       // Clave primaria compuesta
    idEscuela: number;      // Clave primaria compuesta
    documento: string;      // Documento asociado al horario
    estado: string;         // Estado del horario (puede ser un string como "activo", "inactivo", etc.)
    observaciones: string | null; // Observaciones adicionales (puede ser nulo)
    idDirector: number;     // ID del direct
}  
// Obtener todas las facultades
export const getCargadocentexciclo = async (): Promise<HorarioDocente[]> => {
    const authData = isAuthenticated(); // Verificar autenticación
  
    if (!authData || !authData.token) {
      throw new Error('User is not authenticated or token is missing');
    }
  
    const response = await fetch(`${apiUrl}/cargadocentexciclo`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authData.token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Error al obtener la carga docente por ciclo');
    }
  
    return response.json();
  };

  export const getHorarios = async (): Promise<Horario[]> => {
    const authData = isAuthenticated(); // Verificar autenticación

    if (!authData || !authData.token) {
        throw new Error('User is not authenticated or token is missing');
    }

    const response = await fetch(`${apiUrl}/listarhorarios`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authData.token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener los horarios');
    }

    return response.json();
};
