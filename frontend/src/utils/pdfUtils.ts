import { PageMargin } from 'docx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generarSilaboPDF = (silabo: any, numero: number) => {
  const doc = new jsPDF();
  const themeFont = 'helvetica';

  const margenes = {
    izquierdo: 20,
    izquierdo2: 30,
    derecho: 130,
    superior: 45,
    superior2: 75,
    incrementoY: 7,
    anchoMaximo: 170,
    lineHeight: 6,
    margenInferior: 20,
  };

  const styleTitle = {
    fontSize: 11,
    fontStyle: 'bold',
    font: themeFont,
  };

  const styleCenter = {
    fontSize: 12,
    fontStyle: 'bold',
    font: themeFont,
    align: 'center' as 'center',
  };

  const styleParrafo = {
    fontSize: 11,
    fontStyle: 'normal',
    font: themeFont,
    align: 'justify' as 'justify',
    maxWidth: 160,
    lineHeight: 5,
  };

  const addImage = () => {
    const imgUrl = `public/images/logo.png`;
    const img = new Image();
    img.src = imgUrl;
    doc.addImage(img, 'PNG', 10, 10, 45, 20);
  };

  const addText = (
    texto: string,
    x: number | null,
    y: number,
    estilo: {
      fontSize: number;
      fontStyle: string;
      font: string;
      align?: 'justify' | 'left' | 'center' | 'right';
      maxWidth?: number;
      lineHeight?: number;
    },
  ): void => {
    doc.setFont(estilo.font, estilo.fontStyle);
    doc.setFontSize(estilo.fontSize);

    if (estilo.align === 'justify' && estilo.maxWidth) {
      const textLines = doc.splitTextToSize(texto, estilo.maxWidth);

      const lineSpacing = estilo.lineHeight || estilo.fontSize;

      textLines.forEach((line: string, index: number) => {
        doc.text(line, x ?? 10, y + index * lineSpacing, { align: 'justify' });
      });
    } else if (estilo.align === 'center') {
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(texto);
      const startX = (pageWidth - textWidth) / 2;
      doc.text(texto, startX, y);
    } else {
      doc.text(texto, x ?? 10, y, { align: estilo.align });
    }
  };

  const agregarTabla = (
    columnas: any[],
    filas: any[][],
    startY: number,
    estilos: {
      theme?: string;
      styles?: any;
      headStyles?: any;
      bodyStyles?: any;
      margin?: { left: number; right: number };
      columnStyles?: any;
      fontSize?: number; // Tamaño de fuente global
    } = {},
  ): void => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = estilos.margin?.left || 10;
    const rightMargin = estilos.margin?.right || 10;
    const maxTableWidth = pageWidth - (leftMargin + rightMargin);

    const adjustedColumnStyles = { ...estilos.columnStyles };
    if (Object.keys(adjustedColumnStyles).length > 0) {
      let totalColumnWidth = 0;

      for (const key in adjustedColumnStyles) {
        totalColumnWidth += adjustedColumnStyles[key]?.cellWidth || 0;
      }

      if (totalColumnWidth > maxTableWidth) {
        const scaleFactor = maxTableWidth / totalColumnWidth;
        for (const key in adjustedColumnStyles) {
          adjustedColumnStyles[key].cellWidth *= scaleFactor;
        }
      }
    }

    const config: any = {
      body: filas,
      startY,
      theme: estilos.theme || 'grid',
      styles: {
        halign: 'center',
        fontSize: estilos.fontSize || 10, // Tamaño de fuente global
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
        ...estilos.styles, // Permitir sobrescribir estilos globales
      },
      bodyStyles: {
        fontSize: estilos.fontSize || 10, // Tamaño de fuente para el cuerpo
        fillColor: [255, 255, 255],
        ...estilos.bodyStyles, // Permitir sobrescribir estilos del cuerpo
      },
      headStyles: {
        fontSize: estilos.fontSize || 11, // Tamaño de fuente para el encabezado
        fillColor: [255, 255, 255],
        fontStyle: 'bold',
        ...estilos.headStyles, // Permitir sobrescribir estilos del encabezado
      },
      margin: { left: leftMargin, right: rightMargin },
      columnStyles: adjustedColumnStyles,
    };

    if (columnas.length > 0) {
      config.head = [columnas];
    }

    (doc as any).autoTable(config);
  };

  addImage();

  addText(
    'SILABO DE LA EXPERIENCIA CURRICULAR',
    null,
    margenes.superior,
    styleCenter,
  );
  addText(
    `"${silabo.curso.name.trim()}"`,
    null,
    margenes.superior + 8,
    styleCenter,
  );

  addText(
    'I. DATOS DE IDENTIFICACIÓN',
    margenes.izquierdo,
    margenes.superior + 20,
    styleTitle,
  );

  const quitarHora = (fechaHora: string): string => {
    return fechaHora.split(' ')[0];
  };

  const datosIdentificacion = [
    { label: '1.1.      Área', value: silabo.curso.area.nomArea },
    { label: '1.2.      Facultad', value: silabo.curso.facultad.nomFacultad },
    {
      label: '1.3.      Departamento Académico',
      value: silabo.curso.departamento.nomDepartamento,
    },
    {
      label: '1.4.      Programa de Estudios',
      value: silabo.escuela.name,
    },
    { label: '1.5.      Sede', value: silabo.filial.name },
    {
      label: '1.6.      Año - Semestre académico',
      value: silabo.semestre_academico.nomSemestre,
    },
    { label: '1.7.      Ciclo', value: silabo.ciclo },
    ,
    {
      label: '1.8.      Código de la experiencia curricular',
      value: silabo.curso.idCurso,
    },
    { label: '1.9.      Sección / Grupo', value: silabo.grupo },
    { label: '1.10.    Créditos', value: silabo.curso.creditos },
    { label: '1.11.    Requisito', value: silabo.prerequisitos },
    {
      label: '1.12.    Inicio - Término',
      value:
        quitarHora(silabo.semestre_academico.fInicio) +
        ' - ' +
        quitarHora(silabo.semestre_academico.fTermino),
    },
    { label: '1.13.    Tipo', value: silabo.curso.tipo_curso.descripcion },
    { label: '1.14.    Régimen', value: silabo.curso.regimen_curso.nomRegimen },
  ];

  datosIdentificacion.map((dato: any) => {
    addText(
      dato.label,
      margenes.izquierdo2,
      margenes.superior + 30,
      styleParrafo,
    );
    addText(
      `: ${dato.value}`,
      margenes.derecho,
      margenes.superior + 30,
      styleParrafo,
    );
    margenes.superior += margenes.incrementoY;
  });
  addText(
    '1.15.    Organización semestral del tiempo (semanas) :',
    margenes.izquierdo2,
    margenes.superior + 30,
    styleParrafo,
  );

  const columnas = [
    'Actividades',
    'Total de Horas',
    'Unidades I',
    'Unidades II',
    'Unidades III',
  ];

  const categorias = [
    { nombre: 'Teóricas', horas: silabo.curso.hTeoricas },
    { nombre: 'Prácticas', horas: silabo.curso.hPracticas },
    { nombre: 'Laboratorio', horas: silabo.curso.hLaboratorio },
    {
      nombre: 'Consolidación de Aprendizajes',
      horas: silabo.curso.hRetroalimentacion,
    },
  ];

  const filas = categorias.map((categoria) => {
    const totalHoras = categoria.horas * 3;
    return [
      categoria.nombre,
      `${totalHoras}`,
      ...Array(3).fill(`${categoria.horas}`),
    ];
  });

  const totalGeneral = filas.reduce(
    (sum, fila) => sum + parseInt(fila[1], 10),
    0,
  );

  const totalesPorUnidades = [2, 3, 4].map((i) =>
    filas.reduce((sum, fila) => sum + parseInt(fila[i], 10), 0),
  );

  filas.push([
    'Total Horas',
    `${totalGeneral}`,
    ...totalesPorUnidades.map((total) => `${total}`),
  ]);

  // Tabla de organización semestral
  agregarTabla(columnas, filas, margenes.superior2 + 105, {
    margin: { left: margenes.izquierdo2 + 13, right: 20 },
  });

  addText(
    '1.16.    Docente / Equipo Docente(s) :',
    margenes.izquierdo2,
    margenes.superior2 + 168,
    styleParrafo,
  );

  const columnas1 = [
    'Condición',
    'Apellidos y Nombres',
    'Profesión',
    'Correo Institucional',
  ];

  const filas1 = [
    [
      'Coordinador(a)',
      `${silabo.apedocente} ${silabo.nomdocente}`,
      `${silabo.profesion}`,
      `${silabo.email}`,
    ],
  ];

  // Tabla de docente
  agregarTabla(columnas1, filas1, margenes.superior2 + 174, {
    margin: { left: margenes.izquierdo2 + 13, right: 20 },
  });

  doc.addPage();
  addImage();
  margenes.superior = 45;
  addText('II. SUMILLA', margenes.izquierdo, margenes.superior, styleTitle);

  addText(
    silabo.silabo.sumilla,
    margenes.izquierdo2,
    margenes.superior + 10,
    styleParrafo,
  );

  addText(
    'III. COMPETENCIA DE ESTUDIOS GENERALES (I - II CICLO) O DE EGRESO (III - X CICLO)',
    margenes.izquierdo,
    margenes.superior + 90,
    styleTitle,
  );

  const columnas2 = [
    'Unidad de Competencia: Gestión de Infraestructura y Comunicaciones',
  ];

  const filas2 = [[`${silabo.silabo.unidadcompetencia}`]];

  // Tabla unida de competencia
  agregarTabla(columnas2, filas2, margenes.superior + 98, {
    margin: { left: margenes.izquierdo2, right: 20 },
    headStyles: {
      fillColor: [255, 255, 255],
      halign: 'rigt',
    },
    bodyStyles: {
      halign: 'rigt',
    },
  });

  addText(
    'ARTICULACION CON LAS COMPETENCIA GENERALES DE LA UNT',
    margenes.izquierdo + 6,
    margenes.superior + 148,
    styleTitle,
  );

  const columnas3 = ['Competencias Generales de la UNT'];

  const filas3 = [[`${silabo.silabo.competenciasgenerales}`]];

  // Tabla de competencias generales
  agregarTabla(columnas3, filas3, margenes.superior + 155, {
    margin: { left: margenes.izquierdo2, right: 20 },
    headStyles: {
      fillColor: [255, 255, 255],
      halign: 'rigt',
    },
    bodyStyles: {
      halign: 'rigt',
    },
  });

  addText(
    'RESULTADOS DEL ESTUDIANTE QUE SON ABORDADOS POR EL CURSO',
    margenes.izquierdo + 7,
    margenes.superior + 185,
    styleTitle,
  );
  const filas4 = [[`${silabo.silabo.resultados}`]];

  // Tabla de resultados del estudiante
  agregarTabla([], filas4, margenes.superior + 192, {
    margin: { left: margenes.izquierdo2, right: 20 },
    bodyStyles: {
      halign: 'rigt',
    },
  });

  doc.addPage('a4', 'landscape');
  addText('PROGRAMACIÓN ACADÉMICA', margenes.izquierdo, 18, styleTitle);

  // Definir las columnas (encabezados)
  const columnas10 = [
    'Capacidades Terminales (CT)',
    'Resultados de Aprendizajes',
    'Organización de Unidades de Contenidos',
    'Estrategias Didáctica',
    'Evidencias de Desempeño',
    'Instrumentos de Evaluación',
    'Semanas',
  ];

  const filas10 = [
    [
      { content: silabo.silabo.capacidadesterminales1, rowSpan: 5 },
      { content: silabo.silabo.resultadosaprendizajes1, rowSpan: 5 },
      `${silabo.silabo.semanas[0].organizacion}`,
      `${silabo.silabo.semanas[0].estrategias}`,
      `${silabo.silabo.semanas[0].evidencias}`,
      `${silabo.silabo.semanas[0].instrumentos}`,
      `${silabo.silabo.semanas[0].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[1].organizacion}`,
      `${silabo.silabo.semanas[1].estrategias}`,
      `${silabo.silabo.semanas[1].evidencias}`,
      `${silabo.silabo.semanas[1].instrumentos}`,
      `${silabo.silabo.semanas[1].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[2].organizacion}`,
      `${silabo.silabo.semanas[2].estrategias}`,
      `${silabo.silabo.semanas[2].evidencias}`,
      `${silabo.silabo.semanas[2].instrumentos}`,
      `${silabo.silabo.semanas[2].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[3].organizacion}`,
      `${silabo.silabo.semanas[3].estrategias}`,
      `${silabo.silabo.semanas[3].evidencias}`,
      `${silabo.silabo.semanas[3].instrumentos}`,
      `${silabo.silabo.semanas[3].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[4].organizacion}`,
      `${silabo.silabo.semanas[4].estrategias}`,
      `${silabo.silabo.semanas[4].evidencias}`,
      `${silabo.silabo.semanas[4].instrumentos}`,
      `${silabo.silabo.semanas[4].nomSem}`,
    ],
    [
      { content: silabo.silabo.capacidadesterminales2, rowSpan: 5 },
      { content: silabo.silabo.resultadosaprendizajes2, rowSpan: 5 },
      `${silabo.silabo.semanas[5].organizacion}`,
      `${silabo.silabo.semanas[5].estrategias}`,
      `${silabo.silabo.semanas[5].evidencias}`,
      `${silabo.silabo.semanas[5].instrumentos}`,
      `${silabo.silabo.semanas[5].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[6].organizacion}`,
      `${silabo.silabo.semanas[6].estrategias}`,
      `${silabo.silabo.semanas[6].evidencias}`,
      `${silabo.silabo.semanas[6].instrumentos}`,
      `${silabo.silabo.semanas[6].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[7].organizacion}`,
      `${silabo.silabo.semanas[7].estrategias}`,
      `${silabo.silabo.semanas[7].evidencias}`,
      `${silabo.silabo.semanas[7].instrumentos}`,
      `${silabo.silabo.semanas[7].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[8].organizacion}`,
      `${silabo.silabo.semanas[8].estrategias}`,
      `${silabo.silabo.semanas[8].evidencias}`,
      `${silabo.silabo.semanas[8].instrumentos}`,
      `${silabo.silabo.semanas[8].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[9].organizacion}`,
      `${silabo.silabo.semanas[9].estrategias}`,
      `${silabo.silabo.semanas[9].evidencias}`,
      `${silabo.silabo.semanas[9].instrumentos}`,
      `${silabo.silabo.semanas[9].nomSem}`,
    ],
    [
      { content: silabo.silabo.capacidadesterminales3, rowSpan: 5 },
      { content: silabo.silabo.resultadosaprendizajes3, rowSpan: 5 },
      `${silabo.silabo.semanas[10].organizacion}`,
      `${silabo.silabo.semanas[10].estrategias}`,
      `${silabo.silabo.semanas[10].evidencias}`,
      `${silabo.silabo.semanas[10].instrumentos}`,
      `${silabo.silabo.semanas[10].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[11].organizacion}`,
      `${silabo.silabo.semanas[11].estrategias}`,
      `${silabo.silabo.semanas[11].evidencias}`,
      `${silabo.silabo.semanas[11].instrumentos}`,
      `${silabo.silabo.semanas[11].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[12].organizacion}`,
      `${silabo.silabo.semanas[12].estrategias}`,
      `${silabo.silabo.semanas[12].evidencias}`,
      `${silabo.silabo.semanas[12].instrumentos}`,
      `${silabo.silabo.semanas[12].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[13].organizacion}`,
      `${silabo.silabo.semanas[13].estrategias}`,
      `${silabo.silabo.semanas[13].evidencias}`,
      `${silabo.silabo.semanas[13].instrumentos}`,
      `${silabo.silabo.semanas[13].nomSem}`,
    ],
    [
      `${silabo.silabo.semanas[14].organizacion}`,
      `${silabo.silabo.semanas[14].estrategias}`,
      `${silabo.silabo.semanas[14].evidencias}`,
      `${silabo.silabo.semanas[14].instrumentos}`,
      `${silabo.silabo.semanas[14].nomSem}`,
    ],
  ];

  agregarTabla(columnas10, filas10, 25, {
    theme: 'grid',
    margin: { left: 15, right: 15 },
    fontSize: 9,
    headStyles: {
      fillColor: [174, 196, 222],
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      halign: 'left',
      valign: 'middle',
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 45 },
      2: { cellWidth: 60 },
      3: { cellWidth: 75 },
      4: { cellWidth: 45 },
      5: { cellWidth: 32 },
      6: { cellWidth: 40 },
    },
  });

  doc.addPage('a4', 'portrait');
  addImage();
  addText(
    'IV. SISTEMA DE EVALUACIÓN',
    margenes.izquierdo,
    margenes.superior,
    styleTitle,
  );

  addText(
    'Base Legal:',
    margenes.izquierdo2,
    margenes.superior + 10,
    styleTitle,
  );

  addText(
    'Reglamento de Normas Generales de Evaluación y Aprendizaje con el enfoque en Competencias, de los estudiantes de Pregrado UNT.',
    margenes.izquierdo2,
    margenes.superior + 18,
    styleParrafo,
  );

  addText(
    'Principios y Procedimiento:',
    margenes.izquierdo2,
    margenes.superior + 30,
    styleTitle,
  );

  addText(
    'La evaluación por competencias se caracteriza por ser progresiva, formativa y auténtica; por lo que es de procesos e integral y se orienta a asegurar el logro de los aprendizajes esperados, capacidades y competencias. Se evalúan las evidencias concretas a través de las cuales los estudiantes demuestran haber logrado aprendizajes (exposiciones orales, presentación de trabajos escritos, ensayos, exposiciones, mapas conceptuales, infografías, maquetas, entre otros); y sirve para recoger información, tomar decisiones oportunas e informar a los estudiantes y autoridades para las acciones de mejora respectiva.',
    margenes.izquierdo2,
    margenes.superior + 38,
    styleParrafo,
  );

  const formulas = `
1. Al valorar los resultados y/o productos se debe de tener en cuenta una ponderación 
    específica por unidad.

   Fórmulas para calcular el promedio por unidad:

   PU1 = 0.5 PTL + 0.5 EO
   PU2 = 0.4 PTL + 0.4 EO + 0.2 IM
   PU3 = 0.4 PTL + 0.2 EO + 0.4 EXPO

2. La fórmula del promedio promocional:

   PP = 0.3 PU1 + 0.3 PU2 + 0.4 PU3
`;

  addText(formulas, margenes.izquierdo2, margenes.superior + 70, styleParrafo);

  addText(
    'Criterios para la Promoción:',
    margenes.izquierdo2,
    margenes.superior + 138,
    styleTitle,
  );

  const criterios = `
  1. El sistema de calificación es vigesimal (0-20).
  2. La nota aprobatoria es 11, en el promedio promocional el medio punto (0.5) favorece al 
      estudiante.
  3. La asistencia es obligatoria tener más del 30% de inasistencia injustificada es causal de 
      inhabilitación.
  4. La evaluación por competencias evalúa el Nivel de Logro.
  `;

  addText(
    criterios,
    margenes.izquierdo2,
    margenes.superior + 142,
    styleParrafo,
  );

  addText(
    'Nivel de Logro:',
    margenes.izquierdo2,
    margenes.superior + 182,
    styleTitle,
  );

  const nivelLogro = `
Es el aprendizaje alcanzado por el estudiante. Para la determinación de los niveles de logro   de los resultados  de aprendizaje de los estudiantes se toma en cuenta lo siguiente:

  • Nivel I: Necesita reforzar las capacidades terminales previstas en coordinación con 
    Dirección de Escuela y/o Estudios Generales, según corresponda (0-10).
  • Nivel II: Requiere fortalecer la mayoría de las capacidades terminales (11-14).
  • Nivel III: Muestra un nivel de dominio adecuado en las capacidades terminales (15-17).
  • Nivel IV: Posee un alto nivel de dominio de las capacidades terminales (18-20). `;

  addText(
    nivelLogro,
    margenes.izquierdo2,
    margenes.superior + 186,
    styleParrafo,
  );

  doc.addPage('a4', 'portrait');
  addImage();
  addText(
    'V. TUTORÍA ACADÉMICA (Plan de Mejora)',
    margenes.izquierdo,
    margenes.superior,
    styleTitle,
  );
  addText(
    '7.1 Propósito:',
    margenes.izquierdo2,
    margenes.superior + 10,
    styleTitle,
  );

  addText(
    'Acompañamiento y monitoreo académico oportuno al estudiante que no logra las capacidades programadas en el proceso del desarrollo de la experiencia curricular como parte del Plan de Mejora.',
    margenes.izquierdo2 + 7,
    margenes.superior + 18,
    styleParrafo,
  );

  addText(
    '7.2 Desarrollo de la Tutoría',
    margenes.izquierdo2,
    margenes.superior + 36,
    styleTitle,
  );

  addText(
    `${silabo.silabo.tutoria}`,
    margenes.izquierdo2 + 7,
    margenes.superior + 43,
    styleParrafo,
  );

  addText(
    'V. TUTORÍA ACADÉMICA (Plan de Mejora)',
    margenes.izquierdo,
    margenes.superior + 62,
    styleTitle,
  );

  addText(
    `${silabo.silabo.referencias}`,
    margenes.izquierdo2,
    margenes.superior + 70,
    styleParrafo,
  );

  if (numero === 1) {
    doc.save(`${silabo.curso.name}_silabo.pdf`);
  } else if (numero === 2) {
    return doc.output('datauristring');
  } else if (numero === 3) {
    doc.output('dataurlnewwindow');
  }
};
