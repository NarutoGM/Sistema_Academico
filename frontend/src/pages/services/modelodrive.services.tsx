import { Document, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import {  CargaDocente } from '@/pages/services/silabo.services';

// Constantes necesarias
const SERVICE_ACCOUNT_EMAIL = "XXXX@XXXX.iam.gserviceaccount.com";
const PARENT_FOLDER_ID = "1Mi65WujBQwmANIKLfJfdBUSFOeVAzlPC";
const ACCESS_TOKEN = "TOKEN_GENERADO";

// Función para verificar o crear una carpeta en Google Drive
const verificarOCrearCarpeta = async (
    nombreCarpeta: string,
    accessToken: string,
    parentFolderId: string
): Promise<string> => {
    const url = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}' in parents and name = '${nombreCarpeta}' and mimeType = 'application/vnd.google-apps.folder'&fields=files(id,name)`;

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
                name: nombreCarpeta,
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

// Función para verificar si un archivo existe y manejar versiones
const verificarArchivoExistente = async (
    nombreArchivo: string,
    folderId: string,
    accessToken: string
): Promise<string | null> => {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and name contains '${nombreArchivo}' and mimeType != 'application/vnd.google-apps.folder'&fields=files(id,name)`;

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
        return null;
    } catch (error) {
        console.error(`Error al verificar archivo '${nombreArchivo}':`, error);
        throw error;
    }
};

// Función para subir un archivo con manejo de versiones
const subirArchivoConVersion = async (
    fileBlob: Blob,
    nombreArchivo: string,
    folderId: string,
    accessToken: string
): Promise<void> => {
    let version = 1;
    let nombreFinal = nombreArchivo;
    let archivoExistente;

    do {
        archivoExistente = await verificarArchivoExistente(nombreFinal, folderId, accessToken);
        if (archivoExistente) {
            version++;
            nombreFinal = `${nombreArchivo}_v${version}`;
        }
    } while (archivoExistente);

    try {
        const metadata = {
            name: nombreFinal,
            parents: [folderId],
        };

        const formData = new FormData();
        formData.append(
            "metadata",
            new Blob([JSON.stringify(metadata)], { type: "application/json" })
        );
        formData.append("file", fileBlob);

        await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        console.log(`Archivo '${nombreFinal}' subido correctamente.`);
    } catch (error) {
        console.error(`Error al subir el archivo '${nombreFinal}':`, error);
        throw error;
    }
};

// Función para crear la estructura de carpetas y subir el archivo
export const crearEstructuraCompleta = async (
    carga: CargaDocente,
    accessToken: string,
    fileBlob: Blob
): Promise<void> => {
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

        await subirArchivoConVersion(fileBlob, carga.curso.name, semestreFolderId, accessToken);
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

