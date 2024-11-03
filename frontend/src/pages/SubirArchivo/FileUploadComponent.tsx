import React, { useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

const FileUploadComponent: React.FC = () => {
  const [driveLink, setDriveLink] = useState<string>('');
  const [isLinkSaved, setIsLinkSaved] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  // Inicia el cliente de Google API
  const initClient = () => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    });
  };

  // Autentica al usuario para Google Drive
  const authenticateUser = async () => {
    try {
      await gapi.auth2.getAuthInstance().signIn();
      alert("Autenticación exitosa. Puedes subir archivos ahora.");
    } catch (error) {
      console.error("Error de autenticación:", error);
    }
  };

  // Guarda el link de Google Drive
  const handleSaveLink = () => {
    if (driveLink) {
      setIsLinkSaved(true);
      authenticateUser(); // Autenticar al usuario al guardar el link
    }
  };

  // Maneja la subida de archivos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Subir archivo a Google Drive
  const uploadFileToDrive = async (file: File) => {
    const accessToken = gapi.auth.getToken()?.access_token;
    const metadata = {
      name: file.name,
      mimeType: file.type,
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
      body: formData,
    });

    if (response.ok) {
      console.log('Archivo subido con éxito:', await response.json());
    } else {
      console.error('Error al subir el archivo:', response.statusText);
    }
  };

  // Envía todos los archivos seleccionados a Google Drive
  const handleSubmitFiles = async () => {
    if (files.length) {
      files.forEach(file => {
        uploadFileToDrive(file);
      });
      alert("Archivos subidos a Google Drive.");
    }
  };

  return (
    <div>
      <h2>Subir Link de Google Drive</h2>
      <input
        type="text"
        value={driveLink}
        onChange={(e) => setDriveLink(e.target.value)}
        placeholder="Introduce el link de Google Drive"
        disabled={isLinkSaved}
      />
      <button onClick={handleSaveLink} disabled={isLinkSaved}>
        Guardar Link
      </button>

      {isLinkSaved && (
        <>
          <h3>Subir Documentos</h3>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileUpload}
          />
          <button onClick={handleSubmitFiles}>Enviar Archivos</button>
        </>
      )}
    </div>
  );
};

export default FileUploadComponent;
