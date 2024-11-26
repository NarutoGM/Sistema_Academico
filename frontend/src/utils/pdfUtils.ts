import { jsPDF } from 'jspdf';

export const generarSilaboPDF = (silabo: any, numero: number) => {
  const doc = new jsPDF();

  // Primer texto en helvetica y tamaño de fuente 12
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  const pageWidth = doc.internal.pageSize.getWidth();
  const text = 'SILABO DE LA EXPERIENCIA CURRICULAR';
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;
  doc.text(text, x, 40);

  doc.setFontSize(14);
  const text2 = `"${silabo.curso.name.trim()}"`;
  const text2Width = doc.getTextWidth(text2);
  const x2 = (pageWidth - text2Width) / 2;
  doc.text(text2, x2, 50);

  doc.setFontSize(11);
  const margenIzquierdo = 20;
  const margenSuperior = 65;
  doc.text('I. DATOS DE IDENTIFICACIÓN', margenIzquierdo, margenSuperior);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const margenIzquierdo2 = 30;
  const margenSuperior2 = 75;
  const margenDerecho = 130;

  doc.text('1.1.      Área', margenIzquierdo2, margenSuperior2);
  doc.text('1.2.      Facultad', margenIzquierdo2, margenSuperior2 + 7);
  doc.text(
    '1.3.      Departamento Académico',
    margenIzquierdo2,
    margenSuperior2 + 14,
  );
  doc.text(
    '1.4.      Programa de Estudios',
    margenIzquierdo2,
    margenSuperior2 + 21,
  );
  doc.text('1.5.      Sede', margenIzquierdo2, margenSuperior2 + 28);
  doc.text(
    '1.6.      Año - Semestre académico',
    margenIzquierdo2,
    margenSuperior2 + 35,
  );
  doc.text('1.7.      Ciclo', margenIzquierdo2, margenSuperior2 + 42);
  doc.text(
    '1.8.      Código de la experiencia curricular ',
    margenIzquierdo2,
    margenSuperior2 + 49,
  );
  doc.text('1.9.      Sección / Grupo', margenIzquierdo2, margenSuperior2 + 56);
  doc.text('1.10.    Créditos', margenIzquierdo2, margenSuperior2 + 63);
  doc.text('1.11.    Requisito', margenIzquierdo2, margenSuperior2 + 70);
  doc.text('1.12.    Inicio - Término', margenIzquierdo2, margenSuperior2 + 77);
  doc.text('1.13.    Tipo', margenIzquierdo2, margenSuperior2 + 84);
  doc.text('1.14.    Régimen', margenIzquierdo2, margenSuperior2 + 91);
  doc.text(
    '1.15.    Organización semestral del tiempo (semanas)',
    margenIzquierdo2,
    margenSuperior2 + 98,
  );

  doc.text(`: ${silabo.curso.area.nomArea}`, margenDerecho, margenSuperior2);
  doc.text(
    `: ${silabo.curso.facultad.nomFacultad}`,
    margenDerecho,
    margenSuperior2 + 7,
  );
  doc.text(
    `: ${silabo.curso.departamento.nomDepartamento}`,
    margenDerecho,
    margenSuperior2 + 14,
  );
  doc.text(`: ${silabo.escuela.name}`, margenDerecho, margenSuperior2 + 21);
  doc.text(`: ${silabo.filial.name}`, margenDerecho, margenSuperior2 + 28);
  doc.text(
    `: ${silabo.semestre_academico.nomSemestre}`,
    margenDerecho,
    margenSuperior2 + 35,
  );
  doc.text(`: ${silabo.ciclo}`, margenDerecho, margenSuperior2 + 42);
  doc.text(`: ${silabo.curso.idCurso}`, margenDerecho, margenSuperior2 + 49);
  doc.text(`: ${silabo.curso.idCurso}`, margenDerecho, margenSuperior2 + 56);
  doc.text(`: ${silabo.curso.creditos}`, margenDerecho, margenSuperior2 + 63);
  doc.text(`: ${silabo.prerequisitos}`, margenDerecho, margenSuperior2 + 70);
  doc.text(
    `: ${silabo.curso.inicioTermino}`,
    margenDerecho,
    margenSuperior2 + 77,
  );
  doc.text(`: ${silabo.curso.tipo}`, margenDerecho, margenSuperior2 + 84);
  doc.text(`: ${silabo.curso.regimen}`, margenDerecho, margenSuperior2 + 91);

  // Acciones según el parámetro `numero`
  if (numero === 1) {
    // Descargar el PDF
    doc.save(`${silabo.curso.name}_silabo.pdf`);
  } else if (numero === 2) {
    // Retornar como cadena base64
    return doc.output('datauristring');
  } else if (numero === 3) {
    // Abrir el PDF en una nueva ventana o pestaña
    doc.output('dataurlnewwindow');
  }
};
