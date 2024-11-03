import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const SCOPES = import.meta.env.VITE_GOOGLE_SCOPES || 'https://www.googleapis.com/auth/documents';

const CreateDocWithTable: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initClient = async () => {
      gapi.load('client:auth2', async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1"], // Asegura que se cargue la API de Docs
        });
        const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        setIsAuthenticated(isSignedIn);
      });
    };
    initClient();
  }, []);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      setIsAuthenticated(true);
    });
  };

  const createDocument = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await gapi.client.docs.documents.create({
        title: 'Documento con Tabla',
      });
      const documentId = response.result.documentId;

      const accessToken = gapi.auth.getToken().access_token;
      await addTableToDocument(documentId, accessToken);

      alert('Documento creado con una tabla!');
    } catch (error) {
      console.error('Error al crear el documento:', error);
    }
  };

  const addTableToDocument = async (documentId: string, accessToken: string) => {
    const tableContent = [
      ['Cabecera 1', 'Cabecera 2'],
      ['Fila 1, Col 1', 'Fila 1, Col 2'],
      ['Fila 2, Col 1', 'Fila 2, Col 2'],
    ];
  
    const requests = tableContent.map((row, rowIndex) => {
      return row.map((cellValue, colIndex) => ({
        insertText: {
          text: cellValue,
          location: { index: 1 + (rowIndex * 2) + colIndex }, // Calculate index based on row and column
        },
      }));
    }).flat(); // Flatten the nested array
  
    const batchUpdateRequest = {
      requests: requests,
    };
  
    await gapi.client.docs.documents.batchUpdate({
      documentId: documentId,
      resource: batchUpdateRequest,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  };

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={handleSignIn}>Iniciar sesión con Google</button>
      ) : (
        <button onClick={createDocument}>Crear Documento con Tabla</button>
      )}
    </div>
  );
};

export default CreateDocWithTable;
