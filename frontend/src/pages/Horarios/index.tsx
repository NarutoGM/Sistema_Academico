import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import { BsSkipStartCircle } from 'react-icons/bs';
import { StringValueElement } from 'docx';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const SCOPES = import.meta.env.VITE_GOOGLE_SCOPES || 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file';

const FileUploadComponent: React.FC = () => {
    const [folderTitle, setFolderTitle] = useState<string>('');
    const [isFolderCreated, setIsFolderCreated] = useState<boolean>(false);
    const [folderId, setFolderId] = useState<string>('');
    const [folderLink, setFolderLink] = useState<string>('');
    const [isSheetCreated, setIsSheetCreated] = useState<boolean>(false);
    const [sheetId, setSheetId] = useState<string>('');

    useEffect(() => {
        function start() {
            gapi.client
                .init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    scope: SCOPES,
                })
                .then(() => {
                    const authInstance = gapi.auth2.getAuthInstance();
                    if (authInstance.isSignedIn.get()) {
                        authInstance.signOut();
                    }
                    console.log('Google API initialized and user signed out');
                })
                .catch((error) => {
                    console.error('Error initializing Google API:', error);
                });
        }

        gapi.load('client:auth2', start);
    }, []);

    const authenticateUser = async () => {
        try {
            const authInstance = gapi.auth2.getAuthInstance();
            if (!authInstance.isSignedIn.get()) {
                await authInstance.signIn();
            }
            return authInstance.currentUser.get().getAuthResponse().access_token;
        } catch (error) {
            console.error("Error de autenticación:", error);
            alert(error.message);
        }
    };

    const createSpreadsheetWithSheets = async () => {
        const accessToken = await authenticateUser();
        if (!accessToken) {
            alert("Error: No se pudo obtener el token de acceso.");
            return;
        }

        const sheetMetadata = {
            properties: { title: folderTitle || 'Documento de Hojas' },
            sheets: [
                { properties: { title: 'Hoja 1' } },
                { properties: { title: 'Hoja 2' } },
                { properties: { title: 'Hoja 3' } },
                { properties: { title: 'Hoja 4' } },
                { properties: { title: 'Hoja 5' } },
            ],
        };

        const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
            method: 'POST',
            headers: new Headers({
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(sheetMetadata),
        });

        if (response.ok) {
            const data = await response.json();
            setSheetId(data.spreadsheetId);
            setIsSheetCreated(true);
            alert("Hoja de cálculo creada exitosamente en Google Sheets.");
            await addContentToSheets(data.spreadsheetId, accessToken);
        } else {
            console.error('Error al crear la hoja de cálculo:', response.statusText);
        }
    };

    const addContentToSheets = async (spreadsheetId: string, accessToken: string) => {
        // Primero obtenemos la estructura del archivo para identificar los `sheetId`
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
            method: 'GET',
            headers: new Headers({
                Authorization: `Bearer ${accessToken}`,
            }),
        });

        if (!response.ok) {
            console.error('Error al obtener la estructura de la hoja de cálculo:', response.statusText);
            return;
        }

        const spreadsheetData = await response.json();
        const sheets = spreadsheetData.sheets;

        // Ciclos
        const ciclos = [
            {
                universidad: 'UNIVERSIDAD NACIONAL DE TRUJILLO',
                facultad: 'FACULTAD DE INGENIERIA',
                escuela: 'INGENIERIA DE SISTEMAS',
                nombreCiclo: 'II',
                seccion: 'A',
                sede: 'TRUJILLO',
                añoAcademico: '2024',
                semestre: 'II',
                fechaInicio: '09 de septiembre del 2024',
                fechaTermino: '27 de diciembre del 2024',
                docentes: [
                    {
                        nombre: 'Zoraida Yanet Vidal Melgarejo', 
                        cursos: [
                            {
                                experienciaCurricular: 'Programación Orientada a Objetos I',
                                horasTeoricas: 2,
                                horasPractica: 0,
                                horasLaboratorio: 4,
                                grupos: 4,
                                horasTotal: 18,
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'César Arellano Salazar',
                        cursos: [
                            {
                                experienciaCurricular: 'Taller de Manejo de TIC (e)',
                                horasTeoricas: 0,
                                horasPractica: 0,
                                horasLaboratorio: 2,
                                grupos: 1,
                                horasTotal: 2
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Oscar Romel Alcántara Moreno',
                        cursos: [
                            {
                                experienciaCurricular: 'Taller de Manejo de TIC (e)',
                                horasTeoricas: 0,
                                horasPractica: 0,
                                horasLaboratorio: 2,
                                grupos: 1,
                                horasTotal: 2
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'María Elena Velásquez Alva',
                        cursos: [
                            {
                                experienciaCurricular: 'Sociedad, Cultura y Ecología',
                                horasTeoricas: 1,
                                horasPractica: 4,
                                horasLaboratorio: 0,
                                grupos: 0,
                                horasTotal: 5
                            },
                        ],
                        departamento: 'Ciencias Sociales',
                    },
                    {
                        nombre: 'Evans Pool Chiquez Chávez',
                        cursos: [
                            {
                                experienciaCurricular: 'Cultura Investigativa y Pensamiento Crítico',
                                horasTeoricas: 2,
                                horasPractica: 2,
                                horasLaboratorio: 0,
                                grupos: 0,
                                horasTotal: 4
                            },
                        ],
                        departamento: 'Ciencias de la Eduacación',
                    },
                    {
                        nombre: 'Mariela Herlinda Pollio Rojas',
                        cursos: [
                            {
                                experienciaCurricular: 'Ética, Convivencia Humana y Ciudadanía',
                                horasTeoricas: 2,
                                horasPractica: 2,
                                horasLaboratorio: 0,
                                grupos: 0,
                                horasTotal: 4
                            },
                        ],
                        departamento: 'Filosofía y Arte',
                    },
                    {
                        nombre: 'Segundo Valentín Guibar Obeso',
                        cursos: [
                            {
                                experienciaCurricular: 'Análisis Matemático',
                                horasTeoricas: 2,
                                horasPractica: 4,
                                horasLaboratorio: 0,
                                grupos: 0,
                                horasTotal: 6
                            },
                        ],
                        departamento: 'Matemáticas',
                    },
                    {
                        nombre: 'Segundo Aristides Tavara Aponte',
                        cursos: [
                            {
                                experienciaCurricular: 'Fisica General',
                                horasTeoricas: 2,
                                horasPractica: 4,
                                horasLaboratorio: 2,
                                grupos: 3,
                                horasTotal: 12
                            },
                        ],
                        departamento: 'Física',
                    },
                ],
            },
            {
                universidad: 'UNIVERSIDAD NACIONAL DE TRUJILLO',
                facultad: 'FACULTAD DE INGENIERIA',
                escuela: 'INGENIERIA DE SISTEMAS',
                nombreCiclo: 'IV',
                seccion: 'A',
                sede: 'TRUJILLO',
                añoAcademico: '2024',
                semestre: 'II',
                fechaInicio: '09 de septiembre del 2024',
                fechaTermino: '27 de diciembre del 2024',
                docentes: [
                    {
                        nombre: 'Juan Carlos Obando Roldán',
                        cursos: [
                            {
                                experienciaCurricular: 'Diseño Web',
                                horasTeoricas: 1,
                                horasPractica: 1,
                                horasLaboratorio: 3,
                                grupos: 2,
                                horasTotal: 8
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Robert Jerry Sánchez Ticona',
                        cursos: [
                            {
                                experienciaCurricular: 'Computación Gráfica y Visual (e)',
                                horasTeoricas: 1,
                                horasPractica: 1,
                                horasLaboratorio: 3,
                                grupos: 1,
                                horasTotal: 5
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'César Arellano Salazar',
                        cursos: [
                            {
                                experienciaCurricular: 'Sistemas Digitales',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 3,
                                horasTotal: 9
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Marcelino Torres Villanueva',
                        cursos: [
                            {
                                experienciaCurricular: 'Estructura de Datos Orientado a Objetos',
                                horasTeoricas: 2,
                                horasPractica: 1,
                                horasLaboratorio: 3,
                                grupos: 3,
                                horasTotal: 12
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Camilo Suárez Rebaza',
                        cursos: [
                            {
                                experienciaCurricular: 'Gestión de Procesos',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 2,
                                horasTotal: 7
                            }
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Camilo Suárez Rebaza',
                        cursos: [
                            {
                                experienciaCurricular: 'Plataformas Tecnologicas (e)',
                                horasTeoricas: 2,
                                horasPractica: 0,
                                horasLaboratorio: 2,
                                grupos: 2,
                                horasTotal: 6
                            }
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'José Alberto Gómez Ávila',
                        cursos: [
                            {
                                experienciaCurricular: 'Pensamiento de diseño',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 3,
                                horasTotal: 9
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Alberto Ramiro Asmat Alva',
                        cursos: [
                            {
                                experienciaCurricular: 'Economía General',
                                horasTeoricas: 2,
                                horasPractica: 2,
                                horasLaboratorio: 0,
                                grupos: 0,
                                horasTotal: 4
                            },
                        ],
                        departamento: 'Economía',
                    },
                ],
            },
            {
                universidad: 'UNIVERSIDAD NACIONAL DE TRUJILLO',
                facultad: 'FACULTAD DE INGENIERIA',
                escuela: 'INGENIERIA DE SISTEMAS',
                nombreCiclo: 'VI',
                seccion: 'A',
                sede: 'TRUJILLO',
                añoAcademico: '2024',
                semestre: 'II',
                fechaInicio: '09 de septiembre del 2024',
                fechaTermino: '27 de diciembre del 2024',
                docentes: [
                    {
                        nombre: 'Robert Jerry Sánchez Ticona',
                        cursos: [
                            {
                                experienciaCurricular: 'Ingeniería de Requerimientos',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 2,
                                horasTotal: 7
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'César Arellano Salazar',
                        cursos: [
                            {
                                experienciaCurricular: 'Sistemas Operativos',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 3,
                                horasTotal: 9
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Luis Enrique Boy Chavil',
                        cursos: [
                            {
                                experienciaCurricular: 'Ingeniería de Datos II',
                                horasTeoricas: 2,
                                horasPractica: 1,
                                horasLaboratorio: 3,
                                grupos: 3,
                                horasTotal: 12
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Marcelino Torres Villanueva',
                        cursos: [
                            {
                                experienciaCurricular: 'Sistemas Inteligentes',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 3,
                                horasTotal: 9
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Ana María Cuadra Midzuaray',
                        cursos: [
                            {
                                experienciaCurricular: 'Finanzas Corporativas',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 1,
                                horasTotal: 5
                            },
                        ],
                        departamento: 'Contabilidad y Finanzas',
                    },
                    {
                        nombre: 'Joe Alexis González Vásquez',
                        cursos: [
                            {
                                experienciaCurricular: 'Ingeniería Económica',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 1,
                                horasTotal: 5
                            },
                        ],
                        departamento: 'Ingeniería Industrial',
                    },
                    {
                        nombre: 'Juan Carlos Carrascal Cabanillas',
                        cursos: [
                            {
                                experienciaCurricular: 'Gestión del Talento Humano (e)',
                                horasTeoricas: 2,
                                horasPractica: 2,
                                horasLaboratorio: 0,
                                grupos: 0,
                                horasTotal: 4
                            },
                        ],
                        departamento: 'Administración',
                    },
                    {
                        nombre: '',
                        cursos: [
                            {
                                experienciaCurricular: 'Ingeniería Ambiental (e)',
                                horasTeoricas: 2,
                                horasPractica: 2,
                                horasLaboratorio: 0,
                                grupos: 0,
                                horasTotal: 4
                            },
                        ],
                        departamento: 'Ingeniería Ambiental',
                    },
                ],
            },
            {
                universidad: 'UNIVERSIDAD NACIONAL DE TRUJILLO',
                facultad: 'FACULTAD DE INGENIERIA',
                escuela: 'INGENIERIA DE SISTEMAS',
                nombreCiclo: 'VIII',
                seccion: 'A',
                sede: 'TRUJILLO',
                añoAcademico: '2024',
                semestre: 'II',
                fechaInicio: '09 de septiembre del 2024',
                fechaTermino: '27 de diciembre del 2024',
                docentes: [
                    {
                        nombre: 'Juan carlos Obando Roldan',
                        cursos: [
                            {
                                experienciaCurricular: 'Arquitectura basada en Microservicios (e)',
                                horasTeoricas: 2,
                                horasPractica: 0,
                                horasLaboratorio: 2,
                                grupos: 1,
                                horasTotal: 4
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Juan Pedro Santos Fernández',
                        cursos: [
                            {
                                experienciaCurricular: 'Ingeniería de Software II',
                                horasTeoricas: 2,
                                horasPractica: 1,
                                horasLaboratorio: 3,
                                grupos: 3,
                                horasTotal: 12
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Everson David Agreda Gamboa',
                        cursos: [
                            {
                                experienciaCurricular: 'Redes y Comunicaciones II',
                                horasTeoricas: 1,
                                horasPractica: 1,
                                horasLaboratorio: 3,
                                grupos: 1,
                                horasTotal: 5
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Alberto Carlos Mendoza De los Santos',
                        cursos: [
                            {
                                experienciaCurricular: 'Seguridad de la Información',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 3,
                                horasTotal: 9
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Ricardo Darío Mendoza Rivera',
                        cursos: [
                            {
                                experienciaCurricular: 'Inteligencia de Negocios',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 3,
                                horasTotal: 9
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Jose Alberto Gomez Ávila',
                        cursos: [
                            {
                                experienciaCurricular: 'Internet de las Cosas',
                                horasTeoricas: 1,
                                horasPractica: 1,
                                horasLaboratorio: 3,
                                grupos: 2,
                                horasTotal: 8
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Oscar Romel Alcántara Moreno',
                        cursos: [
                            {
                                experienciaCurricular: 'Marketing y Medios Sociales',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 2,
                                horasTotal: 7
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Marco Alfonso Celi Arévalo',
                        cursos: [
                            {
                                experienciaCurricular: 'Deontología y Derecho Informático (e)',
                                horasTeoricas: 2,
                                horasPractica: 2,
                                horasLaboratorio: 0,
                                grupos: 0,
                                horasTotal: 4
                            },
                        ],
                        departamento: 'Derecho',
                    },
                ],
            },
            {
                universidad: 'UNIVERSIDAD NACIONAL DE TRUJILLO',
                facultad: 'FACULTAD DE INGENIERIA',
                escuela: 'INGENIERIA DE SISTEMAS',
                nombreCiclo: 'X',
                seccion: 'A',
                sede: 'TRUJILLO',
                añoAcademico: '2024',
                semestre: 'II',
                fechaInicio: '09 de septiembre del 2024',
                fechaTermino: '27 de diciembre del 2024',
                docentes: [
                    {
                        nombre: 'Everson David Agreda Gamboa',
                        cursos: [
                            {
                                experienciaCurricular: 'Arquitectura Empresarial',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 1,
                                horasTotal: 5
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Robert Jerry Sánchez Ticona',
                        cursos: [
                            {
                                experienciaCurricular: 'Aplicaciones Móviles',
                                horasTeoricas: 1,
                                horasPractica: 1,
                                horasLaboratorio: 3,
                                grupos: 2,
                                horasTotal: 8
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Juan Pedro Santos Fernández',
                        cursos: [
                            {
                                experienciaCurricular: 'Tesis II - Sección "A"',
                                horasTeoricas: 2,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 1,
                                horasTotal: 6
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Alberto Carlos Mendoza De los Santos',
                        cursos: [
                            {
                                experienciaCurricular: 'Gobierno de TIC',
                                horasTeoricas: 1,
                                horasPractica: 2,
                                horasLaboratorio: 2,
                                grupos: 2,
                                horasTotal: 7
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Ricardo Darío Mendoza Rivera',
                        cursos: [
                            {
                                experienciaCurricular: 'Tesis II - Sección "B"',
                                horasTeoricas: 2,
                                horasPractica: 2,
                                horasLaboratorio: 1,
                                grupos: 2,
                                horasTotal: 6
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Oscar Romel Alcántara Moreno',
                        cursos: [
                            {
                                experienciaCurricular: 'Practicas Pre Profesionales',
                                horasTeoricas: 2,
                                horasPractica: 1,
                                horasLaboratorio: 3,
                                grupos: 3,
                                horasTotal: 12
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Silvia Ana Rodríguez Aguirre',
                        cursos: [
                            {
                                experienciaCurricular: 'Sistemas de Información Empresarial',
                                horasTeoricas: 2,
                                horasPractica: 1,
                                horasLaboratorio: 3,
                                grupos: 2,
                                horasTotal: 9
                            },
                        ],
                        departamento: 'Ingeniería de Sistemas',
                    },
                    {
                        nombre: 'Joe Alexis González Vásquez',
                        cursos: [
                            {
                                experienciaCurricular: 'Responsabilidad Social Coorporativa',
                                horasTeoricas: 2,
                                horasPractica: 2,
                                horasLaboratorio: 0,
                                grupos: 0,
                                horasTotal: 4
                            },
                        ],
                        departamento: 'Ingeniería Industrial',
                    },
                ],
            },
        ];

        // Crear las solicitudes para agregar contenido en celdas específicas de cada hoja
        const requests = ciclos.flatMap((ciclo, cicloIndex) => {
            const sheetId = sheets[cicloIndex].properties.sheetId;
            let startRowIndex = 0;

            // Agregar el nombre de la Universidad en la primera fila
            const universidadRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 1},
                        rows: [{ values: [{ userEnteredValue: { stringValue: ciclo.universidad } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];
            startRowIndex += 1;

            // Agregar el nombre de la facultad en la segunda fila
            const facultadRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 2},
                        rows: [{ values: [{ userEnteredValue: { stringValue: ciclo.facultad } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];
            startRowIndex += 2;

            // Agregar el nombre de la escuela en la cuarta fila
            const escuelaRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 0},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'ESCUELA:' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 1},
                        rows: [{ values: [{ userEnteredValue: { stringValue: ciclo.escuela } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];
            startRowIndex += 2;

            // Agregar el título del ciclo en la primera fila
            const cicloTitleRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 0},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'CICLO:' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 1},
                        rows: [{ values: [{ userEnteredValue: { stringValue: ciclo.nombreCiclo } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];

            // Agregar la sección en la sexta fila
            const seccionRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 2},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'SECCION:' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 3},
                        rows: [{ values: [{ userEnteredValue: { stringValue: ciclo.seccion } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];
            startRowIndex += 2;

            // Agregar la sede en la octava fila
            const sedeRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 0},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'SEDE:' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 1},
                        rows: [{ values: [{ userEnteredValue: { stringValue: ciclo.sede } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];
            startRowIndex += 2;

            // Agregar año académico en decima fila
            const añoRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 0},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'AÑO ACADEMICO:' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 1 },
                        rows: [{ values: [{ userEnteredValue: { stringValue: ciclo.añoAcademico } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];

            // Agregar semestre en la decima fila
            const semestreRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 2},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'SEMESTRE:' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 3},
                        rows: [{ values: [{ userEnteredValue: { stringValue: ciclo.semestre } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];
            startRowIndex += 2;

            // Agregar fecha de inicio en la doceava fila
            const fechaInicioRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 1},
                        rows: [{ values: [{ userEnteredValue: { stringValue: `Inicio del ciclo: ${ciclo.fechaInicio}` } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];
            startRowIndex += 1;

            // Agregar fecha de termino en la treceava fila
            const fechaTerminoRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 1},
                        rows: [{ values: [{ userEnteredValue: { stringValue: `Termino del ciclo: ${ciclo.fechaTermino}` } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];
            startRowIndex = 0;

            // Agregar cabezeras
            const nroRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 5},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'N°' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];

            const docenteRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 6},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'DOCENTE' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];

            const experienciaCurricularRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 7},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'EXPERIENCIA CURRICULAR' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];

            const horasTeoriaRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 8},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'T' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];

            const horasPracticaRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 9},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'P' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];

            const horasLaboratorioRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 10},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'L' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];

            const gruposRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 11},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'G' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];

            const horasTotalRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 12},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'T. HORAS' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];

            const departamentoRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 13},
                        rows: [{ values: [{ userEnteredValue: { stringValue: 'DPTO. ACAD.' } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];
            startRowIndex = 1;

            // Agregar lista de docentes en las filas siguientes
            const docentesRows = ciclo.docentes.map((docente) => {
                const request = [
                    {
                        updateCells: {
                            range: { sheetId, startRowIndex, startColumnIndex: 6 }, // Columna A para nombre
                            rows: [{ values: [{ userEnteredValue: { stringValue: docente.nombre } }] }],
                            fields: 'userEnteredValue',
                        },
                    },
                    {
                        updateCells: {
                            range: { sheetId, startRowIndex, startColumnIndex: 13 }, // Columna B para departamento
                            rows: [{ values: [{ userEnteredValue: { stringValue: docente.departamento } }] }],
                            fields: 'userEnteredValue',
                        },
                    },
                ];

                // Agregar información de cada curso del docente
                const cursosRequests = docente.cursos.map((curso) => {
                    const cursoRequest = [
                        {
                            updateCells: {
                                range: { sheetId, startRowIndex, startColumnIndex: 7 },
                                rows: [{ values: [{ userEnteredValue: { stringValue: curso.experienciaCurricular } }] }],
                                fields: 'userEnteredValue',
                            },
                        },
                        {
                            updateCells: {
                                range: { sheetId, startRowIndex, startColumnIndex: 8 },
                                rows: [{ values: [{ userEnteredValue: { numberValue: curso.horasTeoricas } }] }],
                                fields: 'userEnteredValue',
                            },
                        },
                        {
                            updateCells: {
                                range: { sheetId, startRowIndex, startColumnIndex: 9 },
                                rows: [{ values: [{ userEnteredValue: { numberValue: curso.horasPractica } }] }],
                                fields: 'userEnteredValue',
                            },
                        },
                        {
                            updateCells: {
                                range: { sheetId, startRowIndex, startColumnIndex: 10 },
                                rows: [{ values: [{ userEnteredValue: { numberValue: curso.horasLaboratorio } }] }],
                                fields: 'userEnteredValue',
                            },
                        },
                        {
                            updateCells: {
                                range: { sheetId, startRowIndex, startColumnIndex: 11 },
                                rows: [{ values: [{ userEnteredValue: { numberValue: curso.grupos } }] }],
                                fields: 'userEnteredValue',
                            },
                        },
                        {
                            updateCells: {
                                range: { sheetId, startRowIndex, startColumnIndex: 12 },
                                rows: [{ values: [{ userEnteredValue: { numberValue: curso.horasTotal } }] }],
                                fields: 'userEnteredValue',
                            },
                        },

                    ];
                    startRowIndex += 1;
                    return cursoRequest;
                });
                return [request,...cursosRequests.flat()]

            });
            startRowIndex = 15;

            // Agregar horas 1
            const horasRow = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 0},
                        rows: [{ 
                            values: [
                                { 
                                    userEnteredValue: { stringValue: 'HORA' },
                                    userEnteredFormat: { textFormat: { bold: true } }
                                },
                            ] }],
                        fields: 'userEnteredValue, userEnteredFormat.textFormat.bold',
                    },
                },
            ];
            startRowIndex += 1;
            let horaInicial = 7;
            
            for (let i = 0; i < 14; i++) {
                const siguienteHora = (horaInicial % 12) + 1;

                const intervalo = `${horaInicial} - ${siguienteHora}`;

                horasRow.push({
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex:0 },
                        rows: [{ values: [{ userEnteredValue: { stringValue: intervalo } }] }],
                        fields: 'userEnteredValue, userEnteredFormat.textFormat.bold',
                    },
                });
                startRowIndex += 1;
                horaInicial = siguienteHora;
            }

            startRowIndex = 15;
            // Agregar días
            const diasRow = [
                {
                    updateCells: {
                        range: {
                            sheetId,
                            startRowIndex,
                            startColumnIndex:1
                        },
                        rows: [{
                            values: [
                                {
                                    userEnteredValue: { stringValue: 'LUNES'},
                                    userEnteredFormat: { textFormat: { bold: true } }
                                },
                                {
                                    userEnteredValue: { stringValue: 'MARTES'},
                                    userEnteredFormat: { textFormat: { bold: true } }
                                },
                                {
                                    userEnteredValue: { stringValue: 'MIERCOLES'},
                                    userEnteredFormat: { textFormat: { bold: true } }
                                },
                                {
                                    userEnteredValue: { stringValue: 'JUEVES'},
                                    userEnteredFormat: { textFormat: { bold: true } }
                                },
                                {
                                    userEnteredValue: { stringValue: 'VIERNES'},
                                    userEnteredFormat: { textFormat: { bold: true } }
                                },
                                {
                                    userEnteredValue: { stringValue: 'SABADO'},
                                    userEnteredFormat: { textFormat: { bold: true } }
                                },
                            ]
                        }],
                        fields: 'userEnteredValue, userEnteredFormat.textFormat.bold'
                    }
                }
            ];

            // Agregar horas 2
            const horas2Row = [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex: 7},
                        rows: [{ 
                            values: [
                                { 
                                    userEnteredValue: { stringValue: 'HORA' },
                                    userEnteredFormat: { textFormat: { bold: true } }
                                },
                            ] }],
                        fields: 'userEnteredValue, userEnteredFormat.textFormat.bold',
                    },
                },
            ];
            startRowIndex += 1;
            let horaInicial2 = 7;
            
            for (let i = 0; i < 14; i++) {
                const siguienteHora2 = (horaInicial2 % 12) + 1;

                const intervalo2 = `${horaInicial2} - ${siguienteHora2}`;

                horas2Row.push({
                    updateCells: {
                        range: { sheetId, startRowIndex, startColumnIndex:7 },
                        rows: [{ values: [{ userEnteredValue: { stringValue: intervalo2 } }] }],
                        fields: 'userEnteredValue, userEnteredFormat.textFormat.bold',
                    },
                });
                startRowIndex += 1;
                horaInicial2 = siguienteHora2;
            }

            const horarioBorde = [
                {
                    updateCells: {
                        range: {
                            sheetId, 
                            startRowIndex: 15,
                            endRowIndex: 30,
                            startColumnIndex: 0,
                            endColumnIndex: 8
                        },
                        rows: Array(15).fill({
                            values: Array(8).fill({
                                userEnteredFormat: {
                                    borders: {
                                        top: {
                                            style: 'SOLID',
                                            width: 1,
                                            color: { red: 0, green: 0, blue: 0 }
                                        },
                                        bottom: {
                                            style: 'SOLID',
                                            width: 1,
                                            color: { red: 0, green: 0, blue: 0 }
                                        },
                                        left: {
                                            style: 'SOLID',
                                            width: 1,
                                            color: { red: 0, green: 0, blue: 0}
                                        },
                                        right: {
                                            style: 'SOLID',
                                            width: 1,
                                            color: { red: 0, green: 0, blue: 0}
                                        }
                                    }
                                }
                            })
                        }),
                        fields: 'userEnteredFormat.borders'
                    }
                }
            ];

            const borde1 = [
                {
                    updateCells: {
                        range: {
                            sheetId, 
                            startRowIndex: 0,
                            endRowIndex: 14,
                            startColumnIndex: 5,
                            endColumnIndex: 14
                        },
                        rows: Array(14).fill({
                            values: Array(9).fill({
                                userEnteredFormat: {
                                    borders: {
                                        top: {
                                            style: 'SOLID',
                                            width: 1,
                                            color: { red: 0, green: 0, blue: 0 }
                                        },
                                        bottom: {
                                            style: 'SOLID',
                                            width: 1,
                                            color: { red: 0, green: 0, blue: 0 }
                                        },
                                        left: {
                                            style: 'SOLID',
                                            width: 1,
                                            color: { red: 0, green: 0, blue: 0}
                                        },
                                        right: {
                                            style: 'SOLID',
                                            width: 1,
                                            color: { red: 0, green: 0, blue: 0}
                                        }
                                    }
                                }
                            })
                        }),
                        fields: 'userEnteredFormat.borders'
                    }
                }
            ];

            const borde2 = [
                // Borde superior en la primera fila
                {
                    repeatCell: {
                        range: {
                            sheetId: sheetId,
                            startRowIndex: 0,
                            endRowIndex: 1,
                            startColumnIndex: 0,
                            endColumnIndex: 5
                        },
                        cell: {
                            userEnteredFormat: {
                                borders: {
                                    top: { style: 'SOLID', width: 1, color: { red: 0, green: 0, blue: 0 } }
                                }
                            }
                        },
                        fields: 'userEnteredFormat.borders.top'
                    }
                },
                // Borde inferior en la última fila
                {
                    repeatCell: {
                        range: {
                            sheetId: sheetId,
                            startRowIndex: 13,
                            endRowIndex: 14,
                            startColumnIndex: 0,
                            endColumnIndex: 5
                        },
                        cell: {
                            userEnteredFormat: {
                                borders: {
                                    bottom: { style: 'SOLID', width: 1, color: { red: 0, green: 0, blue: 0 } }
                                }
                            }
                        },
                        fields: 'userEnteredFormat.borders.bottom'
                    }
                },
                // Borde izquierdo en la primera columna
                {
                    repeatCell: {
                        range: {
                            sheetId: sheetId,
                            startRowIndex: 0,
                            endRowIndex: 14,
                            startColumnIndex: 0,
                            endColumnIndex: 1
                        },
                        cell: {
                            userEnteredFormat: {
                                borders: {
                                    left: { style: 'SOLID', width: 1, color: { red: 0, green: 0, blue: 0 } }
                                }
                            }
                        },
                        fields: 'userEnteredFormat.borders.left'
                    }
                },
                // Borde derecho en la última columna
                {
                    repeatCell: {
                        range: {
                            sheetId: sheetId,
                            startRowIndex: 0,
                            endRowIndex: 14,
                            startColumnIndex: 4,
                            endColumnIndex: 5
                        },
                        cell: {
                            userEnteredFormat: {
                                borders: {
                                    right: { style: 'SOLID', width: 1, color: { red: 0, green: 0, blue: 0 } }
                                }
                            }
                        },
                        fields: 'userEnteredFormat.borders.right'
                    }
                }
            ];
            
            return [
                ...universidadRow,
                ...facultadRow,
                ...escuelaRow,
                ...cicloTitleRow,
                ...seccionRow,
                ...sedeRow,
                ...añoRow,
                ...semestreRow,
                ...fechaInicioRow,
                ...fechaTerminoRow,
                ...nroRow,
                ...docenteRow,
                ...experienciaCurricularRow,
                ...horasTeoriaRow,
                ...horasPracticaRow,
                ...horasLaboratorioRow,
                ...gruposRow,
                ...horasTotalRow,
                ...departamentoRow,
                ...docentesRows.flat(),
                ...horasRow,
                ...diasRow,
                ...horas2Row,
                ...horarioBorde,
                ...borde1,
                ...borde2,
            ];
        });
        //const requests = sheets.map((sheet: any, index: number) => {
            //const sheetId = sheet.properties.sheetId;
            /*return [
                {
                    updateCells: {
                        range: { sheetId, startRowIndex: 0, startColumnIndex: 0 }, // Celda A1
                        rows: [{ values: [{ userEnteredValue: { stringValue: `Contenido en A1 de Hoja ${index + 1}` } }] }],
                        fields: 'userEnteredValue',
                    },
                },
                {
                    updateCells: {
                        range: { sheetId, startRowIndex: 1, startColumnIndex: 1 }, // Celda B2
                        rows: [{ values: [{ userEnteredValue: { stringValue: `Contenido en B2 de Hoja ${index + 1}` } }] }],
                        fields: 'userEnteredValue',
                    },
                },
                {
                    updateCells: {
                        range: { sheetId, startRowIndex: 2, startColumnIndex: 2 }, // Celda C3
                        rows: [{ values: [{ userEnteredValue: { stringValue: `Contenido en C3 de Hoja ${index + 1}` } }] }],
                        fields: 'userEnteredValue',
                    },
                },
            ];
        }).flat();*/

        // Enviar la solicitud `batchUpdate` con las referencias correctas de `sheetId`
        const batchUpdateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
            method: 'POST',
            headers: new Headers({
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ requests }),
        });

        if (batchUpdateResponse.ok) {
            console.log("Contenido agregado en celdas específicas de cada hoja correctamente.");
            alert("Contenido agregado en celdas específicas de cada hoja.");
        } else {
            console.error("Error al agregar contenido a las hojas:", await batchUpdateResponse.json());
        }
    };



    return (
        <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 text-center">Crear Carpeta en Google Drive</h2>

            <input
                type="text"
                value={folderTitle}
                onChange={(e) => setFolderTitle(e.target.value)}
                placeholder="Introduce el título de la carpeta"
                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isFolderCreated}
            />

            <button
                onClick={createSpreadsheetWithSheets}
                className="w-full mt-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-green-300"
            >
                Crear Hoja de Cálculo con Hojas
            </button>

            {isSheetCreated && (
                <p className="text-center mt-4 text-blue-500">
                    <a href={`https://docs.google.com/spreadsheets/d/${sheetId}`} target="_blank" rel="noopener noreferrer">
                        Ver hoja de cálculo en Google Sheets
                    </a>
                </p>
            )}
        </div>
    );
};

export default FileUploadComponent;
