import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

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

        // Crear las solicitudes para agregar contenido en celdas específicas de cada hoja
        const requests = sheets.map((sheet: any, index: number) => {
            const sheetId = sheet.properties.sheetId;
            return [
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
        }).flat();

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
