import { Document, Paragraph, TextRun, AlignmentType } from "docx";

export const generateDocument = (data: any) => {
    // Crea y devuelve un documento
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
