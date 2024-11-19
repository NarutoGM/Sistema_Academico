import { Document, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { CargaDocente } from '@/pages/services/silabo.services';

// Constantes necesarias
const SERVICE_ACCOUNT_EMAIL = "XXXX@XXXX.iam.gserviceaccount.com";
const PARENT_FOLDER_ID = "1Mi65WujBQwmANIKLfJfdBUSFOeVAzlPC";
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

// Función para verificar si un archivo ya existe y devolver su enlace
const verificarArchivoExistente = async (
    nombreArchivo: string,
    folderId: string,
    accessToken: string
): Promise<string | null> => {
    const nombreNormalizado = normalizarNombre(nombreArchivo);
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder'&fields=files(id,name)`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();
        if (data.files && data.files.length > 0) {
            // Comparar los nombres de los archivos existentes con el nombre normalizado
            const archivoExistente = data.files.find(
                (file: { name: string }) => normalizarNombre(file.name) === nombreNormalizado
            );
            if (archivoExistente) {
                console.log(`Archivo '${nombreArchivo}' ya existe con ID: ${archivoExistente.id}`);
                return `https://drive.google.com/file/d/${archivoExistente.id}/view`;
            }
        }
        return null;
    } catch (error) {
        console.error(`Error al verificar archivo '${nombreArchivo}':`, error);
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
    // Verificar si el archivo ya existe
    const archivoExistenteLink = await verificarArchivoExistente(nombreArchivo, folderId, accessToken);
    if (archivoExistenteLink) {
        console.log(`El archivo '${nombreArchivo}' ya existe. Retornando enlace.`);
        return archivoExistenteLink;
    }

    // Subir un nuevo archivo si no existe
    try {
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
        return `https://drive.google.com/file/d/${data.id}/view`;
    } catch (error) {
        console.error(`Error al subir el archivo '${nombreArchivo}':`, error);
        throw error;
    }
};

// Función para crear la estructura de carpetas y manejar el archivo
export const crearEstructuraCompleta = async (
    carga: CargaDocente,
    accessToken: string,
    fileBlob: Blob
): Promise<string> => {
    try {
        const parentFolderId = PARENT_FOLDER_ID;

        // Verificar propiedades requeridas
        if (!carga.email) throw new Error("El campo 'email' es obligatorio.");
        if (!carga.filial || !carga.filial.name) throw new Error("El campo 'filial.name' es obligatorio.");
        if (!carga.curso || !carga.curso.name) throw new Error("El campo 'curso.name' es obligatorio.");
        if (!carga.semestre_academico || !carga.semestre_academico.nomSemestre)
            throw new Error("El campo 'semestre_academico.nomSemestre' es obligatorio.");

        // Crear/verificar la estructura de carpetas
        const emailFolderId = await verificarOCrearCarpeta(carga.email, accessToken, parentFolderId);
        const filialFolderId = await verificarOCrearCarpeta(carga.filial.name, accessToken, emailFolderId);
        const cursoFolderId = await verificarOCrearCarpeta(carga.curso.name, accessToken, filialFolderId);
        const semestreFolderId = await verificarOCrearCarpeta(
            carga.semestre_academico.nomSemestre,
            accessToken,
            cursoFolderId
        );

        // Manejar archivo (crear o devolver existente)
        const link = await manejarArchivo(fileBlob, carga.curso.name, semestreFolderId, accessToken);

        return link;
    } catch (error) {
        console.error("Error al crear la estructura completa:", error);
        throw error;
    }
};

// Función para generar el documento
export const generateDocument = (data: any): Document => {
    return new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "SÍLABO DE LA EXPERIENCIA CURRICULAR",
                                bold: true,
                                size: 28,
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Curso: ${data.curso.name || "Sin nombre"}`,
                                size: 24,
                            }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                ],
            },
        ],
    });
};
