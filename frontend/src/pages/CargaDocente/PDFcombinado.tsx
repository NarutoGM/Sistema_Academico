import React , { useEffect, useState }from "react";
import { jsPDF } from "jspdf"; // Importación de jsPDF con la sintaxis correcta para TypeScript
import "jspdf-autotable";
import {
    getEscuelas,
    getMallaByEscuela,
    getSemestres,
    getCursosByMallaAndSemestre,
    getCursosAsignados,
    saveCursosAsignados
  } from '@/pages/services/cargadocente.services';
  
  interface PDFcombinadoModalProps {
    docente: { id: number; nombre: string; apellido: string; dni: string, };
    idFilial: number;
    idDirector: number;
  }
  

// Definir el tipo de los párrafos si es necesario
type Paragraph = string;

const PDFcombinado: React.FC<PDFcombinadoModalProps> = ({
    docente,
    idFilial,
    idDirector,

}) => {
    const generarPDF = () => {
        if (!docente) {
            console.error('Docente no definido');
            return;
        }
        
        if (!docente.id || !docente.nombre || !docente.apellido) {
            console.error('Docente no definido o incompleto:', docente);
            return;
        }

        console.log(docente.nombre);  // Muestra el nombre del docente
        console.log(docente.regimen);  // Muestra el apellido del docente

        const doc = new jsPDF();

        // Primera Página - Carga Académica Docente
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.text("DECLARACIÓN DE LA CARGA ACADÉMICA DOCENTE (F01-CAD)", 105, 15, { align: "center" });

        // Tabla encabezado
        doc.autoTable({
            startY: 20,
            theme: "grid",
            styles: { fontSize: 8 },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: "bold" },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 60 },
                2: { cellWidth: 30 },
                3: { cellWidth: 40 },
                4: { cellWidth: 30 },
            },
            margin: { left: 10 },
            body: [
                [
                    {
                        content: "FACULTAD / FILIAL: Ingeniería",
                        colSpan: 2,
                        styles: { fontStyle: "bold", halign: "left" }
                    },
                    {
                        content: "DPTO. ACADÉMICO: Ingeniería de Sistemas",
                        colSpan: 3,
                        styles: { fontStyle: "bold", halign: "left" }
                    },
                ],
                [
                    { content: "DNI", styles: { fontStyle: "bold", halign: "center" } },
                    { content: "NOMBRE COMPLETO", styles: { fontStyle: "bold", halign: "center" } },
                    { content: "CONDICIÓN", styles: { fontStyle: "bold", halign: "center" } },
                    { content: "CATEGORÍA", styles: { fontStyle: "bold", halign: "center" } },
                    { content: "MODALIDAD", styles: { fontStyle: "bold", halign: "center" } }
                ],
                [
                    { content: `${docente.dni}`, styles: { halign: "center" } },
                    { content: `${docente.nombre} ${docente.apellido}`, styles: { halign: "center" } },
                    { content: "ORDINARIO", styles: { halign: "center" } },
                    { content: "PRINCIPAL", styles: { halign: "center" } },
                    { content: "DE", styles: { halign: "center" } }
                ],
            ],
        });

        // Secciones y tablas
        doc.setFillColor(173, 216, 230);
        doc.rect(15, doc.lastAutoTable.finalY + 5, 180, 8, "F");
        doc.setTextColor(0, 0, 0);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.text(
            "AÑO ACADÉMICO: 2024-SEMESTRE: II     Fecha de Inicio: 09/09/2024   Fecha de Término: 27/12/2024",
            20,
            doc.lastAutoTable.finalY + 11
        );

        doc.text("I. CARGA HORARIA LECTIVA (CHL)", 15, doc.lastAutoTable.finalY + 30);
        doc.text("TOTAL HORAS: 18", 150, doc.lastAutoTable.finalY + 30);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 35,
            head: [
                [
                    "CÓDIGO",
                    "CURSO O ASIGNATURA CURRICULAR DENOMINACIÓN",
                    "Tipo Curso Según Plan de Estudios Actual",
                    "Programa o Escuela Académico Profesional",
                    "Año o Ciclo",
                    "Sección",
                    "N° Alumnos",
                    "Horas Teoría",
                    "Horas Práctica",
                    "Total Horas",
                ],
            ],
            body: [
                [
                    "4487",
                    "INGENIERÍA DE SOFTWARE II",
                    "E",
                    "Ingeniería de Sistemas",
                    "08-C",
                    "U",
                    "55",
                    "2",
                    "10",
                    "12",
                ],
                [
                    "4500",
                    "TESIS II",
                    "E",
                    "Ingeniería de Sistemas",
                    "10-C",
                    "A",
                    "25",
                    "2",
                    "4",
                    "6",
                ],
            ],
            styles: {
                fontSize: 8, halign: "center", valign: "middle",
                cellPadding: 1
            },
            headStyles: { fillColor: [204, 230, 255], textColor: [0, 0, 0], fontSize: 8 },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
                1: { halign: "left", cellWidth: 40 },
                2: { halign: "center", cellWidth: 25 },
                6: { cellWidth: 20 },
            },
        });

        doc.text("II. CARGA HORARIA NO LECTIVA (CHNL)", 15, doc.lastAutoTable.finalY + 10);
        doc.text("TOTAL HORAS: 22", 150, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [
                [
                    "CARGA HORARIA NO LECTIVA COMPLEMENTARIA (CHNLC)",
                    "DESCRIPCIÓN O DETALLE",
                    "HORAS",
                ],
            ],
            body: [
                ["1. PREPARACIÓN Y EVALUACIÓN", "Actividades de planificación, implementación y evaluación de las actividades lectivas.", "9"],
                ["2. TUTORÍA Y CONSEJERÍA", "Para alumnos de las asignaturas curriculares asignadas en el presente semestre.", "3"],
   
            ],
            styles: { fontSize: 8, halign: "center", valign: "middle", cellPadding: 1 },
            headStyles: { fillColor: [204, 230, 255], textColor: [0, 0, 0], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
                0: { halign: "left", cellWidth: 50 },
                1: { halign: "left", cellWidth: 100 },
                2: { halign: "center", cellWidth: 20 },
            },
        });

        // Nueva página para Declaración Jurada
        doc.addPage();

        // Segunda Página - Declaración Jurada
        doc.setFontSize(14);
        doc.setFont("Arial", "bold");
        doc.text("DECLARACIÓN JURADA DE NO ESTAR INCURSO EN CAUSALES", 105, 20, { align: "center" });
        doc.text("DE INCOMPATIBILIDAD O IMPEDIMENTO LABORAL", 105, 30, { align: "center" });

        doc.setFontSize(12);
        doc.setFont("Arial", "normal");
        doc.text("(F02-CAD)", 105, 40, { align: "center" });

        let yPosition = 50;
        const lineHeight = 7;

        // Aquí se puede agregar el contenido de los párrafos
        const paragraphs: Paragraph[] = [
            `Yo, ${docente.nombre} ${docente.apellido}, identificado(a) con DNI N° ${docente.dni}, de la Facultad/Filial de Facultad de Ingeniería, adscrito al Departamento Académico de Ingeniería de Sistemas; en el marco de la Ley Universitaria 30220, D.S. N° 418-2017-EF, Estatuto Reformado 2021 y el reglamento de asignación de la Carga Académica de los Docentes de la UNT, DECLARO BAJO JURAMENTO Y EN HONOR A LA VERDAD, que:",

            "NO ESTOY INCURSO en causales de incompatibilidad laboral y NO TENGO impedimento para ejercer la docencia en la Universidad Nacional de Trujillo, de conformidad con lo previsto en el Capítulo VIII de las Incompatibilidades, Impedimentos y sanciones, del Título XII: de los docentes, del Estatuto Institucional vigente, según la especificación siguiente:",

            "Soy docente, Titular a Presencial y NO EJERZO cualquier otra actividad o cargo remunerado en otra universidad, entidad pública o privada, fuera de la Universidad Nacional de Trujillo (De conformidad con el Artículo 225° del Estatuto Institucional vigente).",

            "EN CASO DE FALTAR A LA VERDAD ME SOMETO A LAS SANCIONES QUE SEAN APLICABLES DE ACUERDO A LEY; ASIMISMO, DE ENCONTRARME INCURSO EN SITUACIÓN DE INCOMPATIBILIDAD O IMPEDIMENTO PARA EJERCER LA DOCENCIA EN LA U.N.T., ME SOMETO A LAS SANCIONES PREVISTAS POR SU ESTATUTO, Y AUTORIZO AL FUNCIONARIO COMPETENTE DISPONGA EL DESCUENTO DE MI PLANILLA DE HABERES, DEL MONTO QUE LA UNIDAD DE REMUNERACIONES LIQUIDE COMO PAGOS INDEBIDOS POR EL LAPSO DE TIEMPO LABORADO ILEGALMENTE.`
        ];

        paragraphs.forEach((paragraph) => {
            const splitText = doc.splitTextToSize(paragraph, 180);
            doc.text(splitText, 15, yPosition);
            yPosition += splitText.length * lineHeight;
        });

        yPosition += 10;

        yPosition += 20;
        const pageWidth = 210;
        doc.text("Firma del Docente:", pageWidth / 2, yPosition, { align: "center" });
        yPosition += 10;
        doc.text("__________", pageWidth / 2, yPosition, { align: "center" });
        yPosition += 10;
        doc.text(`${docente.nombre} ${docente.apellido}`, pageWidth / 2, yPosition, { align: "center" });
        yPosition += 10;
        doc.text(`${docente.dni}`, pageWidth / 2, yPosition, { align: "center" });

        // Guardar el PDF
        doc.save("documento_combinado.pdf");
    };

    return (
        <div>
            <button onClick={generarPDF}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >CAD</button>
            
        </div>
    );
};

export default PDFcombinado;
