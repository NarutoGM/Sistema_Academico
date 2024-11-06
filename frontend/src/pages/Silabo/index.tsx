// DownloadDocument.tsx
import React from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';


interface DownloadDocumentProps {
    title: string;
    content: string;
    author: string;
    date: string;
}

// Valores predeterminados para las propiedades
const defaultDocumentProps: DownloadDocumentProps = {
    title: "Título Predeterminado",
    content: "Este es el contenido predeterminado del documento. Puedes cambiarlo cuando lo necesites.",
    author: "Giovani Salcedo",
    date: "01/01/2024",
};


const DownloadDocument: React.FC<Partial<DownloadDocumentProps>> = (props) => {
    const { title, content, author, date } = { ...defaultDocumentProps, ...props };

    const handleDownload = () => {
        // Crear el documento Word con el contenido deseado
        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: title,
                                    bold: true,
                                    size: 32,
                                }),
                            ],
                            heading: "Title",
                            spacing: { after: 400 },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Por ${author} - ${date}`,
                                    italics: true,
                                    size: 24,
                                }),
                            ],
                            spacing: { after: 400 },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: content,
                                    size: 24,
                                }),
                            ],
                            spacing: { after: 200 },
                        }),
                    ],
                },
            ],
        });

        // Generar y descargar el archivo .docx
        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, `${title}.docx`);
        });
    };

    return (
        <div className="p-4 border rounded shadow-lg bg-white">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-sm text-gray-600 mb-4">Por {author} - {date}</p>
            <div className="text-lg text-gray-800 mb-4">{content}</div>
            <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Descargar en Word
            </button>
        </div>
    );
};

export default DownloadDocument;
