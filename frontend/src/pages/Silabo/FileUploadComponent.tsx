import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/documents';

interface CourseInfo {
  nombreCurso: string;
  docente: string;
  objetivos: string;
  temas: string[];
  cronograma: string;
}

const FileUploadComponent: React.FC<{ courseInfo?: CourseInfo }> = ({ courseInfo }) => {
  const [isFolderCreated, setIsFolderCreated] = useState<boolean>(false);
  const [folderId, setFolderId] = useState<string>('');
  const [folderLink, setFolderLink] = useState<string>('');
  const [docLink, setDocLink] = useState<string>('');
  const [selectedSede, setSelectedSede] = useState<string>('');

  // Valores predeterminados para evitar errores si courseInfo es undefined
  const { nombreCurso = "", docente = "", objetivos = "", temas = [], cronograma = "" } = courseInfo || {};

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

  const createFolderInDrive = async () => {
    const accessToken = await authenticateUser();
    if (!accessToken || !selectedSede) {
      alert("Error: Debes seleccionar una sede y autenticarte.");
      return;
    }

    const metadata = {
      name: `SEDE ${selectedSede.toUpperCase()}`,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(metadata),
    });

    if (response.ok) {
      const data = await response.json();
      setFolderId(data.id);
      setFolderLink(`https://drive.google.com/drive/folders/${data.id}`);
      setIsFolderCreated(true);
      console.log("Carpeta creada exitosamente en Google Drive.");

      await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          role: 'writer',
          type: 'anyone',
        }),
      });

      await createDocInDrive(data.id, accessToken);
    } else {
      console.error('Error al crear la carpeta:', response.statusText);
    }
  };

  const createDocInDrive = async (parentId: string, accessToken: string) => {
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        name: `Sílabo - ${nombreCurso}`,
        mimeType: 'application/vnd.google-apps.document',
        parents: [parentId],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setDocLink(`https://docs.google.com/document/d/${data.id}/edit`);
      console.log("Documento creado exitosamente.");
      await setDocContentInDrive(data.id, accessToken);
    } else {
      console.error('Error al crear el documento:', response.statusText);
    }
  };

  const setDocContentInDrive = async (docId: string, accessToken: string) => {
    const syllabusContent = `
      SÍLABO DE LA EXPERIENCIA CURRICULAR
      
      ${nombreCurso.toUpperCase()}

    I. DATOS DE IDENTIFICACIÓN

      1.1. Área: Estudios de especialidad
      1.2. Facultad: INGENIERÍA
      1.3. Departamento Académico: INGENIERÍA DE SISTEMAS
      1.4. Programa/carrera profesional: Ingeniería de Sistemas
      1.5. Sede: ${selectedSede || "No especificada"}
      1.6. Año y Semestre académico: 2024-0
      1.7. Ciclo: VIII
      1.8. Código de la experiencia curricular: 4485
      1.9. Sección(es)/grupo(s): A
      1.10. Créditos: 4
      1.11. Pre requisito: 3447
      1.12. Inicio – término: 09/09/2024 – 27/12/2024
      1.13. Tipo: Especialidad
      1.14. Régimen: Obligatorio
      1.15. Organización semestral del tiempo (semanas):
      ---------------------------------------------------------------
      **Sílabo de Curso**
      
      **Curso**: ${nombreCurso}
      **Docente**: ${docente}

      **Objetivos del Curso**
      ${objetivos}

      **Temas Principales**
      ${temas.map((tema, index) => `Tema ${index + 1}: ${tema}`).join('\n')}

      **Cronograma**
      ${cronograma}
    `;
    
    const imageUrl = 'https://univerperu.com/wp-content/uploads/2023/07/Universidad-Nacional-de-Trujillo-UNT.png'; // Cambia esto por la URL de tu imagen
    const response = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: syllabusContent,
            },
          },
          {
            updateTextStyle: {
              range: {
                startIndex: 1,
                endIndex: syllabusContent.indexOf('\n', 1) + 1, // Fin del título
              },
              textStyle: {
                bold: true,
                fontSize: {
                  magnitude: 14,
                  unit: 'PT',
                },
              },
              fields: 'bold,fontSize',
            },
          },
          {
            updateParagraphStyle: {
              range: {
                startIndex: 1,
                endIndex: syllabusContent.indexOf('\n', 1) + 1, // Fin del título
              },
              paragraphStyle: {
                alignment: 'CENTER',
              },
              fields: 'alignment',
            },
          },
          {
            updateTextStyle: {
              range: {
                startIndex: syllabusContent.indexOf('\n', syllabusContent.indexOf('\n', 1) + 1) + 1, // Inicio del nombre del curso (4ta línea)
                endIndex: syllabusContent.indexOf('\n', syllabusContent.indexOf('\n', syllabusContent.indexOf('\n', 1) + 1) + 1) + 1, // Fin del nombre del curso
              },
              textStyle: {
                fontSize: {
                  magnitude: 12,
                  unit: 'PT',
                },
              },
              fields: 'fontSize',
            },
          },
          {
            updateParagraphStyle: {
              range: {
                startIndex: syllabusContent.indexOf('\n', syllabusContent.indexOf('\n', 1) + 1) + 1, // Inicio del nombre del curso (4ta línea)
            endIndex: syllabusContent.indexOf('\n', syllabusContent.indexOf('\n', syllabusContent.indexOf('\n', 1) + 1) + 1) + 1, // Fin del nombre del curso
              },
              paragraphStyle: {
                alignment: 'CENTER',
              },
              fields: 'alignment',
            },
          },
          {
            updateTextStyle: {
              range: {
                startIndex: syllabusContent.indexOf('I. DATOS DE IDENTIFICACIÓN'), // Inicio de la fila "I. DATOS DE IDENTIFICACIÓN"
                endIndex: syllabusContent.indexOf('\n', syllabusContent.indexOf('I. DATOS DE IDENTIFICACIÓN')) + 1, // Fin de la fila
              },
              textStyle: {
                bold: true,
              },
              fields: 'bold',
            },
          },
          // Solicitud para insertar la tabla
          {
            insertTable: {
              rows: 5, // Número de filas
              columns: 3, // Número de columnas
              location: {
                index: syllabusContent.indexOf('\n', syllabusContent.indexOf('1.15. Organización semestral del tiempo (semanas):')) + 2, // Insertar justo después de la fila "I. DATOS DE IDENTIFICACIÓN"
              },
            },
          },
          {
            insertInlineImage: {
              location: {
                index: 1, // Cambia este índice al lugar donde deseas insertar la imagen
              },
              uri: imageUrl,
              objectSize: {
                height: {
                  magnitude: 50, // Ajusta la altura según sea necesario
                  unit: 'PT',
                },
                width: {
                  magnitude: 50, // Ajusta el ancho según sea necesario
                  unit: 'PT',
                },
              },
            },
          },
        
        ],
      }),
    });
    
    
    if (response.ok) {
      console.log("Contenido del sílabo establecido exitosamente.");
    } else {
      console.error('Error al establecer el contenido del sílabo:', response.statusText);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 text-center">Generar Esquema de Sílabos</h2>
      
      <div className="mt-4">
        <label className="block text-gray-600">Selecciona Sede:</label>
        <select
          value={selectedSede}
          onChange={(e) => setSelectedSede(e.target.value)}
          className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Seleccione...</option>
          <option value="Trujillo">Trujillo</option>
          <option value="Valle">Valle</option>
        </select>
      </div>

      <button
        onClick={createFolderInDrive}
        disabled={!selectedSede}
        className="w-full mt-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
      >
        Generar Esquema de Sílabos
      </button>

      {isFolderCreated && (
        <p className="text-center mt-4 text-blue-500">
          <a href={folderLink} target="_blank" rel="noopener noreferrer">
            Ver carpeta en Google Drive
          </a>
        </p>
      )}

      {docLink && (
        <p className="text-center mt-4 text-blue-500">
          <a href={docLink} target="_blank" rel="noopener noreferrer">
            Ver sílabo en Google Docs
          </a>
        </p>
      )}
    </div>
  );
};

export default FileUploadComponent;
