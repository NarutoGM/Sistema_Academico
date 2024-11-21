import { 
    Document, 
    Packer, 
    Paragraph, 
    TextRun, 
    Table, 
    TableCell, 
    TableRow, 
    WidthType, 
    AlignmentType, 
    VerticalAlign 
} from "docx";

export const generateDocument = async (carga: any): Promise<Blob> => {
    const tableHeaders = ["Campo", "Valor"];
    const tableData = [
        ["Docente", `${carga.nomdocente} ${carga.apedocente}`],
        ["Email", carga.email],
        ["Curso", carga.curso.name],
        ["Filial", carga.filial.name],
        ["Semestre", carga.semestre_academico.nomSemestre],
        ["Ciclo", carga.ciclo],
        ["Estado del Sílabo", carga.curso.estado_silabo],
    ];

    const tableRows = tableData.map((row) =>
        new TableRow({
            children: row.map((cell) =>
                new TableCell({
                    children: [new Paragraph(cell)],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                })
            ),
        })
    );

    // Ejemplo 1: Tabla con celdas compartidas horizontalmente y verticalmente
    const mixedComplexTableRows = [
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph("Celda Compartida")],
                    rowSpan: 2, // Ocupa dos filas
                    columnSpan: 2, // Ocupa dos columnas
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: "E0F7FA" }, // Fondo acorde a CSS
                    margins: { top: 100, bottom: 100 }, // Margen interno
                }),
                new TableCell({
                    children: [new Paragraph("Celda 3")],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                }),
            ],
        }),
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph("Celda 4")],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                }),
            ],
        }),
    ];
    

    // Ejemplo 2: Tabla agrupada por categorías
    const groupedCategoryTableRows = [
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph("Categoría A")],
                    rowSpan: 3, // Ocupa tres filas
                    verticalAlign: VerticalAlign.CENTER,
                    width: { size: 33, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph("Subcategoría A1")],
                    width: { size: 33, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph("Valor A1")],
                    width: { size: 33, type: WidthType.PERCENTAGE },
                }),
            ],
        }),
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph("Subcategoría A2")],
                    width: { size: 33, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph("Valor A2")],
                    width: { size: 33, type: WidthType.PERCENTAGE },
                }),
            ],
        }),
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph("Subcategoría A3")],
                    width: { size: 33, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph("Valor A3")],
                    width: { size: 33, type: WidthType.PERCENTAGE },
                }),
            ],
        }),
    ];

    // Creación del documento
    const doc = new Document({
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
                    new Table({
                        rows: [
                            new TableRow({
                                children: tableHeaders.map((header) =>
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: header,
                                                    bold: true,
                                                }),
                                            ],
                                        })],
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                    })
                                ),
                            }),
                            ...tableRows,
                        ],
                        width: { size: 100, type: WidthType.PERCENTAGE },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Ejemplo de tabla con celdas horizontales y verticales compartidas:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    new Table({
                        rows: mixedComplexTableRows,
                        width: { size: 100, type: WidthType.PERCENTAGE },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Ejemplo de tabla agrupada por categorías:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    new Table({
                        rows: groupedCategoryTableRows,
                        width: { size: 100, type: WidthType.PERCENTAGE },
                    }),
                ],
            },
        ],
    });

    return await Packer.toBlob(doc);
};
