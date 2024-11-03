import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const SCOPES = import.meta.env.VITE_GOOGLE_SCOPES || '';

const FileUploadComponent: React.FC = () => {
  const [folderTitle, setFolderTitle] = useState<string>('');
  const [isFolderCreated, setIsFolderCreated] = useState<boolean>(false);
  const [folderId, setFolderId] = useState<string>('');
  const [folderLink, setFolderLink] = useState<string>(''); // Nueva variable para guardar el link de la carpeta
  const [files, setFiles] = useState<File[]>([]);

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

  // Crear una carpeta en Google Drive y asignar permisos públicos
  const createFolderInDrive = async () => {
    const accessToken = await authenticateUser();
    if (!accessToken) {
      alert("Error: No se pudo obtener el token de acceso.");
      return;
    }

    // Crear la carpeta
    const metadata = {
      name: folderTitle,
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
      alert("Carpeta creada exitosamente en Google Drive.");

      // Asignar permisos públicos de edición a la carpeta
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
      alert("Permisos públicos de edición otorgados.");
    } else {
      console.error('Error al crear la carpeta:', response.statusText);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFileToDrive = async (file: File) => {
    const accessToken = await authenticateUser();
    if (!accessToken) {
      alert("Error: No se pudo obtener el token de acceso.");
      return;
    }

    const metadata = {
      name: file.name,
      parents: [folderId],
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

  const handleSubmitFiles = async () => {
    if (files.length && folderId) {
      for (const file of files) {
        await uploadFileToDrive(file);
      }
      alert("Archivos subidos a Google Drive.");
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
        onClick={createFolderInDrive}
        disabled={isFolderCreated || !folderTitle}
        className="w-full mt-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-green-300"
      >
        Crear Carpeta
      </button>

      {isFolderCreated && (
        <>
          <h3 className="mt-6 text-lg font-medium text-gray-600 text-center">
            Subir Documentos a la Carpeta "{folderTitle}"
          </h3>
          
          <p className="text-center mt-4 text-blue-500">
            <a href={folderLink} target="_blank" rel="noopener noreferrer">
              Ver carpeta en Google Drive
            </a>
          </p>
          
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileUpload}
            className="w-full mt-4 p-2 border border-gray-300 rounded-lg cursor-pointer"
          />
          
          <button
            onClick={handleSubmitFiles}
            className="w-full mt-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Enviar Archivos
          </button>
        </>
      )}
    </div>
  );
};

export default FileUploadComponent;
