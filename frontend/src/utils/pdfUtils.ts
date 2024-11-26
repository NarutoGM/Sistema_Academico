import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generarSilaboPDF = (silabo: any, numero: number) => {
  const doc = new jsPDF();

  const agregarTextoCentrado = (
    texto: string,
    y: number,
    size: number = 11,
    fontStyle: string = 'bold',
  ): void => {
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(size);
    doc.setFont('helvetica', fontStyle);
    const textWidth = doc.getTextWidth(texto);
    const x = (pageWidth - textWidth) / 2;
    doc.text(texto, x, y);
  };

  agregarTextoCentrado('SILABO DE LA EXPERIENCIA CURRICULAR', 40, 12);
  agregarTextoCentrado(`"${silabo.curso.name.trim()}"`, 50, 14);

  const margenes = {
    izquierdo: 20,
    izquierdo2: 30,
    derecho: 130,
    superior: 65,
    superior2: 75,
    incrementoY: 7, // Espaciado entre líneas
  };

  // Título de la sección
  doc.setFontSize(11);
  doc.text('I. DATOS DE IDENTIFICACIÓN', margenes.izquierdo, margenes.superior);

  // Configuración de la fuente normal
  doc.setFont('helvetica', 'normal');

  const quitarHora = (fechaHora: string): string => {
    return fechaHora.split(' ')[0]; // Devuelve solo la parte de la fecha antes del espacio
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

  let posicionY = margenes.superior2;

  datosIdentificacion.forEach((dato) => {
    doc.text(dato.label, margenes.izquierdo2, posicionY);
    doc.text(`: ${dato.value}`, margenes.derecho, posicionY);
    posicionY += margenes.incrementoY;
  });
  doc.text(
    '1.15.    Organización semestral del tiempo (semanas) :',
    margenes.izquierdo2,
    margenes.superior2 + 98,
  );
  // Posición inicial en Y

  // Define los datos y columnas de la tabla
  const columnas = [
    'Actividades',
    'Total de Horas',
    'Unidades I',
    'Unidades II',
    'Unidades III',
  ];

  // Datos de las categorías
  const categorias = [
    { nombre: 'Teóricas', horas: silabo.curso.hTeoricas },
    { nombre: 'Prácticas', horas: silabo.curso.hPracticas },
    { nombre: 'Laboratorio', horas: silabo.curso.hLaboratorio },
    {
      nombre: 'Consolidación de Aprendizajes',
      horas: silabo.curso.hRetroalimentacion,
    },
  ];

  // Construcción dinámica de las filas
  const filas = categorias.map((categoria) => {
    const totalHoras = categoria.horas * 3; // Calcula la suma de las horas
    return [
      categoria.nombre, // Nombre de la categoría
      `${totalHoras}`, // Total de horas
      ...Array(3).fill(`${categoria.horas}`), // Rellena las 3 columnas de unidades con el mismo valor
    ];
  });

  // Cálculo del total general y los totales por cada columna de unidades
  const totalGeneral = filas.reduce(
    (sum, fila) => sum + parseInt(fila[1], 10),
    0,
  ); // Total de la columna 'Total de Horas'
  const totalesPorUnidades = [2, 3, 4].map(
    (i) => filas.reduce((sum, fila) => sum + parseInt(fila[i], 10), 0), // Suma de cada columna de Unidades I, II y III
  );

  // Agregar la fila de Totales
  filas.push([
    'Total Horas', // Nombre
    `${totalGeneral}`, // Total general
    ...totalesPorUnidades.map((total) => `${total}`), // Totales de Unidades I, II y III
  ]);

  // Usa autotable para agregar la tabla al PDF
  doc.autoTable({
    head: [columnas], // Encabezados
    body: filas, // Datos
    startY: margenes.superior2 + 105, // Posición inicial en el eje Y
    theme: 'grid', // Tema de la tabla
    styles: {
      halign: 'center', // Alinear texto al centro
      lineWidth: 0.1, // Grosor de líneas para todas las celdas
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: false, // Sin color de fondo
    },
    didParseCell: (data) => {
      if (data.row.index === filas.length - 1 && data.column.index === 0) {
        // Aplica estilo a la celda de "Total Horas" (última fila, primera columna)
        data.cell.styles.fontStyle = 'bold'; // Cambia el estilo a negrita
      }
    },
    tableLineWidth: 0.1, // Asegurar que todas las líneas de la tabla sean visibles
    tableLineColor: [0, 0, 0], // Color negro para las líneas de la tabla
    margin: { left: margenes.izquierdo2 + 13, right: 20 }, // Define los márgenes
  });

  doc.text(
    '1.16.    Docente / Equipo Docente(s) :',
    margenes.izquierdo2,
    margenes.superior2 + 160,
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

  // Crear la tabla
  doc.autoTable({
    head: [columnas1], // Encabezados
    body: filas1, // Filas de datos
    startY: margenes.superior2 + 167, // Posición en Y para la tabla
    theme: 'grid', // Tema con líneas de cuadrícula
    styles: {
      halign: 'center', // Centra el texto horizontalmente
      valign: 'middle', // Centra el texto verticalmente
      fontSize: 10, // Tamaño de fuente para el contenido
      lineWidth: 0.1, // Grosor de líneas
      lineColor: [0, 0, 0], // Color negro para las líneas
    },
    headStyles: {
      fillColor: [255, 255, 255], // Sin color de fondo para encabezados
      textColor: [0, 0, 0], // Texto negro
      fontSize: 11, // Tamaño de fuente para los encabezados
      fontStyle: 'bold', // Encabezados en negrita
    },
    margin: { left: margenes.izquierdo2 + 13, right: 20 }, // Define los márgenes
  });

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
