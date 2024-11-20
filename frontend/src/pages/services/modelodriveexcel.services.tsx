import { Document, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { CargaDocente } from '@/pages/services/silabo.services';

// Constantes necesarias
const SERVICE_ACCOUNT_EMAIL = "XXXX@XXXX.iam.gserviceaccount.com";
const PARENT_FOLDER_ID = "11na6UFXq-o8lcidndBoHA_-jkc-tg4qN";
const ACCESS_TOKEN = "TOKEN_GENERADO";

// Normalizar nombres de carpetas
const normalizarNombre = (nombre: string): string => {
    return nombre.trim().toLowerCase().replace(/\s+/g, " ");
};

// Función para verificar o crear una carpeta en Google Drive
const verificarOCrearCarpeta = async (
    nombreCarpeta: string,
    accessToken: string,
    parentFolderId: string
): Promise<string> => {
    const nombreNormalizado = normalizarNombre(nombreCarpeta);
    const url = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}' in parents and name = '${nombreNormalizado}' and mimeType = 'application/vnd.google-apps.folder'&fields=files(id,name)`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();
        if (data.files && data.files.length > 0) {
            return data.files[0].id;
        }

        // Crear la carpeta si no existe
        const createResponse = await fetch("https://www.googleapis.com/drive/v3/files", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: nombreNormalizado,
                mimeType: "application/vnd.google-apps.folder",
                parents: [parentFolderId],
            }),
        });

        const createData = await createResponse.json();
        return createData.id;
    } catch (error) {
        console.error(`Error al verificar o crear carpeta '${nombreCarpeta}':`, error);
        throw error;
    }
};

// Función para establecer permisos públicos en el archivo
const establecerPermisosPublicos = async (fileId: string, accessToken: string): Promise<void> => {
    try {
        const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;
        const body = {
            role: "writer", // Permiso de editor
            type: "anyone", // Acceso público
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Error al establecer permisos: ${response.statusText}`);
        }

        console.log(`Permisos públicos establecidos para el archivo con ID: ${fileId}`);
    } catch (error) {
        console.error("Error al establecer permisos públicos:", error);
        throw error;
    }
};

// Función para manejar la creación o retorno del archivo
const manejarArchivo = async (
    fileBlob: Blob,
    nombreArchivo: string,
    folderId: string,
    accessToken: string
): Promise<string> => {
    try {
        // Subir un nuevo archivo
        const metadata = {
            name: nombreArchivo,
            parents: [folderId],
        };

        const formData = new FormData();
        formData.append(
            "metadata",
            new Blob([JSON.stringify(metadata)], { type: "application/json" })
        );
        formData.append("file", fileBlob);

        const response = await fetch(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            }
        );

        const data = await response.json();
        console.log(`Archivo '${nombreArchivo}' creado correctamente.`);

        // Establecer permisos públicos para el archivo
        await establecerPermisosPublicos(data.id, accessToken);

        return `https://drive.google.com/file/d/${data.id}/view`;
    } catch (error) {
        console.error(`Error al subir el archivo '${nombreArchivo}':`, error);
        throw error;
    }
};

// Función para crear la estructura de carpetas y manejar el archivo
export const crearEstructuraCompletaExcel = async (
    data: any, // Se espera que el objeto contenga la información relevante
    accessToken: string,
    fileBlob: Blob
): Promise<string> => {
    try {
        const parentFolderId = PARENT_FOLDER_ID;

        // Validar que se tengan los datos necesarios
        const escuelaName = data.escuela?.name;
        const filialName = data.filial;
        const semestreName = data.semestreAcademico?.nomSemestre;

        if (!escuelaName) throw new Error("El campo 'escuela.name' es obligatorio.");
        if (!filialName) throw new Error("El campo 'filial' es obligatorio.");
        if (!semestreName) throw new Error("El campo 'semestreAcademico.nomSemestre' es obligatorio.");

        // Crear/verificar carpeta de la escuela
        const escuelaFolderId = await verificarOCrearCarpeta(escuelaName, accessToken, parentFolderId);

        // Crear/verificar carpeta de la filial dentro de la escuela
        const filialFolderId = await verificarOCrearCarpeta(filialName, accessToken, escuelaFolderId);

        // Crear/verificar carpeta del semestre dentro de la filial
        const semestreFolderId = await verificarOCrearCarpeta(semestreName, accessToken, filialFolderId);

        // Subir archivo dentro de la carpeta del semestre
        const archivoName = "Horario.xlsx";
        const link = await manejarArchivo(fileBlob, archivoName, semestreFolderId, accessToken);

        return link;
    } catch (error) {
        console.error("Error al crear la estructura de carpetas y subir el archivo:", error);
        throw error;
    }
};
