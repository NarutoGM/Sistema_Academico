import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const SCOPES = import.meta.env.VITE_GOOGLE_SCOPES || 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file';

const GoogleDocsTableComponent: React.FC = () => {
  const [docId, setDocId] = useState<string>('');
  const [isDocCreated, setIsDocCreated] = useState<boolean>(false);

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

  const createGoogleDocWithTable = async () => {
    const accessToken = await authenticateUser();
    if (!accessToken) {
      alert("Error: No se pudo obtener el token de acceso.");
      return;
    }

    // Crear un nuevo documento
    const docResponse = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ title: 'Documento con Tabla' }),
    });

    if (docResponse.ok) {
      const docData = await docResponse.json();
      setDocId(docData.documentId);
      setIsDocCreated(true);
      console.log("Documento creado exitosamente en Google Docs.");
      await insertTableIntoDoc(docData.documentId, accessToken);
    } else {
      console.error("Error al crear el documento:", docResponse.statusText);
    }
  };

  const insertTableIntoDoc = async (documentId: string, accessToken: string) => {
    // Configuración de la tabla (3 filas, 3 columnas)
    const tableRows = 3;
    const tableCols = 3;

    const requests = [
      {
        insertTable: {
          rows: tableRows,
          columns: tableCols,
          location: { index: 1 },
        },
      },
    ];

    // Insertar tabla en el documento
    const batchUpdateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ requests }),
    });

    if (batchUpdateResponse.ok) {
      console.log("Tabla insertada en el documento.");
      const tableInfo = await batchUpdateResponse.json();
      const tableStartIndex = tableInfo.replies[0].insertTable.startIndex;
      await fillTableCells(documentId, accessToken, tableStartIndex, tableRows, tableCols);
    } else {
      console.error("Error al insertar la tabla:", await batchUpdateResponse.json());
    }
  };

const fillTableCells = async (documentId: string, accessToken: string, startIndex: number, rows: number, cols: number) => {
    const cellRequests = [];
    let cellIndex = startIndex + 1; // Ajuste para el primer índice después de la tabla

    // Crear solicitudes para llenar cada celda con texto
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        cellRequests.push({
          insertText: {
            location: { index: cellIndex },
            text: `Celda ${row + 1}-${col + 1}`,
          },
        });
        cellIndex += 2; // Avanzamos para evitar conflictos con el índice de cada celda
      }
    }

    // Enviar las solicitudes `batchUpdate` para llenar las celdas
    const fillCellsResponse = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ requests: cellRequests }),
    });

    if (fillCellsResponse.ok) {
      console.log("Contenido agregado a cada celda de la tabla.");
      alert("Contenido agregado a cada celda de la tabla.");
    } else {
      console.error("Error al agregar contenido a las celdas:", await fillCellsResponse.json());
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 text-center">Crear Documento en Google Docs</h2>

      <button
        onClick={createGoogleDocWithTable}
        className="w-full mt-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
      >
        Crear Documento con Tabla
      </button>

      {isDocCreated && (
        <p className="text-center mt-4 text-blue-500">
          <a href={`https://docs.google.com/document/d/${docId}`} target="_blank" rel="noopener noreferrer">
            Ver documento en Google Docs
          </a>
        </p>
      )}
    </div>
  );
};

export default GoogleDocsTableComponent;
