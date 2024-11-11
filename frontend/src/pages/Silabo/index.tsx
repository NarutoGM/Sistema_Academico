import React from "react";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { saveAs } from "file-saver";

const DocumentComponent: React.FC = () => {

  const handleDownload = async () => {
    // Tabla de información inicial
    const infoTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Información")],
            }),
            new TableCell({
              children: [new Paragraph("Valor")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Título")],
            }),
            new TableCell({
              children: [new Paragraph("Mi Documento")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Autor")],
            }),
            new TableCell({
              children: [new Paragraph("Tu Nombre")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Fecha")],
            }),
            new TableCell({
              children: [new Paragraph(new Date().toLocaleDateString())],
            }),
          ],
        }),
      ],
    });

    // Segunda tabla con columna agrupada
    const columnGroupedTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Agrupado 1")],
              rowSpan: 2,
              width: { size: 5000, type: WidthType.DXA },
            }),
            new TableCell({
              children: [new Paragraph("Columna 1")],
            }),
            new TableCell({
              children: [new Paragraph("Columna 2")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Valor 1.2")],
            }),
            new TableCell({
              children: [new Paragraph("Valor 2.2")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Agrupado 2")],
              rowSpan: 2,
              width: { size: 5000, type: WidthType.DXA },
            }),
            new TableCell({
              children: [new Paragraph("Columna 1")],
            }),
            new TableCell({
              children: [new Paragraph("Columna 2")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Valor 3.2")],
            }),
            new TableCell({
              children: [new Paragraph("Valor 4.2")],
            }),
          ],
        }),
      ],
    });

    // Tercera tabla con fila agrupada
    const rowGroupedTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Fila 1")],
            }),
            new TableCell({
              children: [new Paragraph("Valor 1.1")],
              columnSpan: 2,
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Fila 2")],
            }),
            new TableCell({
              children: [new Paragraph("Valor 2.1")],
            }),
            new TableCell({
              children: [new Paragraph("Valor 2.2")],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Fila 3")],
            }),
            new TableCell({
              children: [new Paragraph("Agrupado")],
              columnSpan: 2,
            }),
          ],
        }),
      ],
    });

    // Crear el documento con las tres tablas
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "Tabla de Información Inicial", heading: "Heading1" }),
            infoTable,
            new Paragraph({ text: "Tabla con Columna Agrupada", heading: "Heading1" }),
            columnGroupedTable,
            new Paragraph({ text: "Tabla con Fila Agrupada", heading: "Heading1" }),
            rowGroupedTable,
          ],
        },
      ],
    });

    // Generar y descargar el archivo .docx
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "documento_con_tablas.docx");
  };

  return (
    <div>
      {/* Botón para descargar el archivo modificado */}
      <button onClick={handleDownload}>Descargar Documento con Tablas</button>
    </div>
  );
};

export default DocumentComponent;
