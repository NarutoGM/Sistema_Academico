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
    } = {},
  ): void => {
    const config: any = {
      body: filas,
      startY,
      theme: estilos.theme || 'grid',
      styles: estilos.styles || {
        halign: 'center',
        fontSize: 10,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      bodyStyles: estilos.bodyStyles || {
        fillColor: [255, 255, 255],
      },
      margin: estilos.margin || { left: 10, right: 10 },
    };

    // Solo agregar encabezados si hay columnas
    if (columnas.length > 0) {
      config.head = [columnas];
      config.headStyles = estilos.headStyles || {
        fillColor: [255, 255, 255],
        fontStyle: 'bold',
      };
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
    margenes.superior2 + 160,
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
  agregarTabla(columnas1, filas1, margenes.superior2 + 167, {
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

  const filas2 = [
    [`${silabo.silabo.unidadcompetencia}`], // Asegúrate de que las filas coincidan con las columnas
  ];

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

  if (numero === 1) {
    doc.save(`${silabo.curso.name}_silabo.pdf`);
  } else if (numero === 2) {
    return doc.output('datauristring');
  } else if (numero === 3) {
    doc.output('dataurlnewwindow');
  }
};
