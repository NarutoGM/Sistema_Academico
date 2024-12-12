import React from 'react';
import { jsPDF } from 'jspdf';
import { Docente } from '@/pages/services/cargadocente.services'; // Asegúrate de importar correctamente la interfaz Docente

interface PDFCargaAdicionalProps {
  docente: Docente;
}

const PDFCargaAdicional: React.FC<PDFCargaAdicionalProps> = ({ docente }) => {
  const generateCAPDF = () => {
    const doc = new jsPDF();


    // Título principal en dos líneas
    doc.setFontSize(10);
    doc.setFont("times", "bold");
    doc.text(
      "DECLARACIÓN DE CARGA HORARIA LECTIVA ASIGNADA EN FILIALES, ",
      105,
      20,
      { align: "center" }
    );
    doc.text(
      "POSTGRADO, SEGUNDAS ESPECIALIDADES Y CENTROS DE ",
      105,
      26,
      { align: "center" }
    );

    doc.text(
      "PRODUCCIÓN Y EXTENSIÓN UNIVERSITARIA",
      105,
      32,
      { align: "center" }
    );

    // Encabezados
    doc.setFontSize(7);
    doc.setFont("times", "normal");
    doc.text("FACULTAD: ______________Facultad de Ingenieria________________", 10, 45);
    doc.text("DPTO. ACADÉMICO: _________Departamento de Ingenieria de Sistemas_________", 110, 45);

    // Datos del docente
    doc.setFont("times", "bold");
    doc.text("DATOS DEL DOCENTE:", 10, 55);

    doc.setFont("times", "normal");
    doc.text(`NOMBRES Y APELLIDOS: ______________${docente.nombre} ${docente.apellido}_____________`, 10, 63);
    doc.text("CONDICIÓN: REGULAR (    )   CONTRATADO ( X )", 10, 71);
    doc.text("CATEGORÍA: PRINCIPAL ( X )   ASOCIADO (    )   AUXILIAR (    )", 10, 79);
    doc.text("MODALIDAD: DE. (    )   TC. (    )   TP. ( X ) _______HS", 10, 87);

    // Año académico y semestre (ajustado)
    doc.text("AÑO ACADÉMICO: ____2024_____", 10, 100);
    doc.text("SEMESTRE: ___2024 II____", 75, 100);
    doc.text("INICIO: ___09__/__09___/__2024___  FINAL: __27___/__12___/__2024___", 120, 100);

    // Dibujar tabla
    const startX = 10;
    const startY = 115;
    const cellHeight = 10;
    const tableWidth = 190;

    const columnWidths = [50, 50, 40, 30, 20]; // Ancho de las columnas
    const columnPositions: number[] = columnWidths.reduce((acc: number[], width, index) => {
      acc.push((acc[index - 1] || startX) + width);
      return acc;
    }, []);

    // Dibujar encabezados
    doc.setFont("times", "bold");
    doc.rect(startX, startY, tableWidth, cellHeight); // Rectángulo de la fila de encabezados
    doc.text("CURSO", startX + 5, startY + 7);
    doc.text("DEPENDENCIA", columnPositions[0] + 5, startY + 7);
    doc.text("FECHA DE INICIO / TÉRMINO", columnPositions[1]+3, startY + 7);
    doc.text("HORARIO SEMANAL", columnPositions[2]+3, startY + 7);
    doc.text("TOTAL HORAS", columnPositions[3]+1, startY + 7);

    // Dibujar líneas verticales para encabezados
    columnPositions.forEach((position) => {
      doc.line(position, startY, position, startY + cellHeight); // Línea vertical
    });

    // Dibujar contenido de la tabla
    const rows = [
      {
        curso: "Sistemas Inteligentes",
        dependencia: "Departamento de Ingenieria de Sistemas",
        fechaInicio: "01/03/2024",
        fechaTermino: "30/06/2024",
        horario: "LU 7:00 - 8:00\nMA 3:00 - 6:00\nVi 5:00 - 6:00 ",
        totalHoras: "75",
      },
      {
        curso: "Estructura de Datos Orientada a Objetos",
        dependencia: "Departamento de Ingenieria de Sistemas",
        fechaInicio: "02/03/2024",
        fechaTermino: "01/07/2024",
        horario: "LU 3:00 - 6:00\nMA 8:00 - 10:00\nJU 8:00 - 9:00",
        totalHoras: "90",
      },
    ];

    let currentY = startY + cellHeight;

    rows.forEach((row) => {
      doc.setFont("times", "normal");

      // Dibujar rectángulo de fila
      doc.rect(startX, currentY, tableWidth, cellHeight * 3); // Aumentar la altura para incluir los días

      // Agregar texto en cada celda
      doc.text(row.curso, startX + 5, currentY + 7);
      doc.text(row.dependencia, columnPositions[0] + 5, currentY + 7);
      doc.text(`\nF.I.: ${row.fechaInicio}`, columnPositions[1] + 5, currentY + 3);
      doc.text(`\nF.T.: ${row.fechaTermino}`, columnPositions[1] + 5, currentY + 8);

      // Dividir el texto de los días en varias líneas
      const horarioLines = row.horario.split("\n");
      horarioLines.forEach((line, index) => {
        doc.text(line, columnPositions[2] + 5, currentY + 7 + index * 4);
      });

      doc.text(row.totalHoras, columnPositions[3] + 5, currentY + 7);

      // Incrementar Y para la siguiente fila
      currentY += cellHeight * 3;
    });

    // Dibujar fila de total horas
    doc.rect(startX, currentY, tableWidth, cellHeight);
    doc.setFont("times", "bold");
    doc.text("TOTAL HORAS:", columnPositions[2] + 5, currentY + 7);
    doc.text("165", columnPositions[3] + 5, currentY + 7);

    // Dibujar líneas verticales en la fila final
    columnPositions.forEach((position) => {
      doc.line(position, startY, position, currentY + cellHeight); // Línea vertical
    });

    // Firmas
    const footerY = currentY + 20;
    doc.setFont("times", "normal");
    doc.text("Trujillo, _12_ de ___Diciembre____ de 20__24__", 120, footerY);

    // Firma del profesor
    doc.text("__________________", 10, footerY + 20);
    doc.text("Firma del Profesor", 10, footerY + 25);

    // Director del Departamento Académico
    doc.text("__________________", 10, footerY + 40);
    doc.text("Director del Departamento Académico", 10, footerY + 45);

    // Director de la Unidad Académica
    doc.text("__________________", 10, footerY + 60);
    doc.text("Director de la Unidad Académica", 10, footerY + 65);

    // Decano
    doc.text("Vº Bº", 120, footerY + 20);
    doc.text("DECANO ____________________", 120, footerY + 25);


    // Guardar el PDF
    doc.save(`Carga_Adicional_${docente.id}.pdf`);
  };

  return (
    <button
      onClick={generateCAPDF}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
    >
      CA
    </button>
  );
};

export default PDFCargaAdicional;
