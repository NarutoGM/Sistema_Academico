import { jsPDF } from "jspdf";

export const generarSilaboPDF = (silabo: any) => {
    const doc = new jsPDF();

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("FACULTAD DE INGENIERÍA", 10, 10);
    doc.text("DEPARTAMENTO DE INGENIERÍA DE SISTEMAS", 10, 20);
    doc.text("SÍLABO DE LA EXPERIENCIA CURRICULAR", 10, 30);
    doc.text(`“${silabo.curso.name}”`, 10, 40);

    // Datos de identificación
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("I. DATOS DE IDENTIFICACIÓN", 10, 50);

    const datos = [
        `Área: ${silabo.curso.area.nomArea}`,
        `Facultad: ${silabo.curso.facultad.nomFacultad}`,
        `Departamento Académico: ${silabo.curso.departamento.nomDepartamento}`,
        `Programa de Estudios: ${silabo.escuela.name}`,
        `Sede: ${silabo.filial.name}`,
        `Año - Semestre académico: ${silabo.semestre_academico.nomSemestre}`,
        `Ciclo: ${silabo.ciclo}`,
        `Código: ${silabo.curso.idCurso}`,
        `Requisito: ${silabo.prerequisitos}`,
        `Docente: ${silabo.nomdocente} ${silabo.apedocente}`,
        `Correo: ${silabo.email}`,
    ];

    let y = 60;
    datos.forEach((dato) => {
        doc.text(dato, 10, y);
        y += 10;
    });

    // Sumilla
    doc.text("II. SUMILLA", 10, y + 10);
    doc.text(silabo.silabo.sumilla || "No disponible", 10, y + 20, { maxWidth: 190 });

    // Guardar el archivo
    doc.save(`${silabo.curso.name}_silabo.pdf`);
};
