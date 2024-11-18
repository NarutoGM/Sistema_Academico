import React from "react";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, WidthType, Header  } from "docx";
import { saveAs } from "file-saver";

const data = {
  idCargaDocente: 1,
  idFilial: 1,
  idDocente: 2,
  fAsignacion: "2024-11-04 11:39:51",
  estado: true,
  grupo: "A",
  idSemestreAcademico: 2,
  idMalla: 35,
  idCurso: 2654,
  idEscuela: 35,
  idDirector: 2,
  ciclo: "IV",
  nomdocente: "CESAR",
  apedocente: "ARELLANO SALAZAR",
  filial: {
      idFilial: 1,
      name: "Filial Trujillo"
  },
  semestre_academico: {
      idSemestreAcademico: 2,
      nomSemestre: "2024-II",
      fTermino: "2024-12-27 00:00:00",
      fInicio: "2024-09-09 00:00:00"
  },
  curso: {
      idCurso: 2654,
      name: "Sistemas Digitales",
      creditos: 3,
      hTeoricas: 1,
      hPracticas: 2,
      hRetroalimentacion: 1,
      hLaboratorio: 2,
      nGrupos: 1,
      idDepartamento: 7,
      idFacultad: 11,
      idArea: 1,
      idRegimenCurso: 1,
      idTipoCurso: 1,
      estado_silabo: "Confirmar envio de silabo",
      departamento: {
          idDepartamento: 7,
          nomDepartamento: "Ingeniería de Sistemas"
      },
      facultad: {
          idFacultad: 11,
          nomFacultad: "Facultad de Ingeniería"
      },
      area: {
          idArea: 1,
          nomArea: "Estudios de Especialidad"
      },
      regimen_curso: {
          idRegimenCurso: 1,
          nomRegimen: "Obligatorio"
      },
      tipo_curso: {
          idTipoCurso: 1,
          descripcion: "Especialidad"
      }
  },
  escuela: {
      idEscuela: 35,
      name: "Ingeniería de Sistemas"
  }
};

const DocumentComponent: React.FC = () => {
  const handleDownload = async () => {

    // Crear el encabezado
    // Crear el encabezado sin bordes y con texto en mayúsculas
    const header = new Header({
      children: [
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "UNT",
                          bold: true,
                          size: 55,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  margins: { top: 0, bottom: 0, left: 0, right: 0 },
                  borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" } },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${data.curso.facultad.nomFacultad.toUpperCase()}`,
                          bold: true,
                          size: 25,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${data.curso.departamento.nomDepartamento.toUpperCase()}`,
                          bold: true,
                          size: 25,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  margins: { top: 0, bottom: 0, left: 0, right: 0 },
                  borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" } },
                }),
              ],
            }),
          ],
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
        new Paragraph({
          children: [new TextRun({ text: " ", size: 2 })], // Añadir una línea en blanco debajo del encabezado si se desea un espacio.
        }),
      ],
    });

    
     // Calcular horas 
     const horasTeoricas = data.curso.hTeoricas * 5;
     const totalTeoricas = horasTeoricas * 3; // Sumar las horas en las columnas I, II, y III
     const horasPracticas = data.curso.hPracticas * 5;
     const totalPracticas = horasPracticas * 3; // Sumar las horas en las columnas I, II, y III
     const horasLaboratorio = data.curso.hLaboratorio * 5;
     const totalLaboratorio = horasLaboratorio * 3; // Sumar las horas en las columnas I, II, y III
     const horasRetroalimentacion = data.curso.hRetroalimentacion * 5;
     const totalRetroalimentacion = horasRetroalimentacion * 3; // Sumar las horas en las columnas I, II, y III
     const horasTotales = horasTeoricas + horasLaboratorio + horasPracticas + horasRetroalimentacion;
     const totalActividad = totalTeoricas + totalLaboratorio + totalPracticas + totalRetroalimentacion; // Sumar las horas en las columnas I, II, y III
     const sumillaText = [
      "La experiencia curricular de Inteligencia de Negocios es de naturaleza teórico–práctico, se orienta a desarrollar las competencias para el desarrollo de soluciones de información para toma de decisiones; contribuye directamente al logro de las Capacidades terminales CT1.2, CT1.6, CT2.1, CT2.2, y CT2.4, del perfil de egreso.",
      "Esta experiencia curricular permitirá al estudiante plantear estrategias al interior de las empresas y soportar estratégicamente el proceso de toma de decisiones basado en el desarrollo de un sistema de información.",
      "La experiencia curricular de Inteligencia de Negocios, comprende las etapas de definición de requerimientos estratégicos, elaboración de análisis dimensionales, modelamiento y diseño dimensional, Implementación de un DataMart. ETL, Construcción de Aplicaciones y análisis de la información.",
      "Además, contribuye al desarrollo de la competencia para comunicarse eficazmente, mediante la comprensión y redacción de informes eficaces y documentación de diseño, la realización de exposiciones eficaces, y la transmisión y recepción de instrucciones claras."
    ];
    const competenciasText = "El estudiante determina, analiza y especifica los requerimientos estratégicos a través del estudio de las necesidades de un proyecto de software para cualquier dominio del problema de toma de decisiones basado en información, realizando el descubrimiento, documentación y mantenimiento de los requerimientos para transformarlos en un modelo dimensional, asegurando que los requerimientos del sistema estén completos, sean consistentes, relevantes y abarquen completamente las necesidades estratégicas requeridas.";
    const resultadosText = [
      "RE1 Aplica conocimientos de matemáticas, ciencias e ingeniería en la solución de problemas complejos relacionados al área de ingeniería de sistemas.",
      "RE2 Identifica, formula, busca información y analiza problemas complejos de ingeniería de sistemas para llegar conclusiones fundamentadas usando principios básicos de matemáticas y ciencias de la ingeniería.",
      "RE3 Diseña soluciones y productos para problemas complejos de ingeniería y diseña sistemas de información, componentes o procesos para satisfacer necesidades deseadas dentro de restricciones realistas vinculadas a los aspectos socioeconómicos, ambientales, éticos, legales, de salud pública y de seguridad."
    ];

    

     const organizationTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Actividades",
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              rowSpan: 2,
              width: { size: 3000, type: WidthType.DXA },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Total de Horas",
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              rowSpan: 2,
              width: { size: 2000, type: WidthType.DXA },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Unidades",
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              columnSpan: 3,
              width: { size: 4000, type: WidthType.DXA },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "I",
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "II",
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "III",
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Teóricas")] }),
            new TableCell({ children: [new Paragraph(totalTeoricas.toString())] }),
            new TableCell({ children: [new Paragraph(horasTeoricas.toString())] }),
            new TableCell({ children: [new Paragraph(horasTeoricas.toString())] }),
            new TableCell({ children: [new Paragraph(horasTeoricas.toString())] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Prácticas")] }),
            new TableCell({ children: [new Paragraph(totalPracticas.toString())] }),
            new TableCell({ children: [new Paragraph(horasPracticas.toString())] }),
            new TableCell({ children: [new Paragraph(horasPracticas.toString())] }),
            new TableCell({ children: [new Paragraph(horasPracticas.toString())] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Laboratorio")] }),
            new TableCell({ children: [new Paragraph(totalLaboratorio.toString())] }),
            new TableCell({ children: [new Paragraph(horasLaboratorio.toString())] }),
            new TableCell({ children: [new Paragraph(horasLaboratorio.toString())] }),
            new TableCell({ children: [new Paragraph(horasLaboratorio.toString())] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Retroalimentación")] }),
            new TableCell({ children: [new Paragraph(totalRetroalimentacion.toString())] }),
            new TableCell({ children: [new Paragraph(horasRetroalimentacion.toString())] }),
            new TableCell({ children: [new Paragraph(horasRetroalimentacion.toString())] }),
            new TableCell({ children: [new Paragraph(horasRetroalimentacion.toString())] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Total Horas",
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: totalActividad.toString(),
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: horasTotales.toString(),
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: horasTotales.toString(),
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: horasTotales.toString(),
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
    
    const docenteTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "CONDICIÓN", bold: true })],
              })],
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "APELLIDOS Y NOMBRES", bold: true })],
              })],
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "PROFESIÓN", bold: true })],
              })],
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "EMAIL INSTITUCIONAL", bold: true })],
              })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Coordinador(a)")],
            }),
            new TableCell({
              children: [new Paragraph(`${data.apedocente} ${data.nomdocente}`)],
            }),
            new TableCell({
              children: [new Paragraph("Ing. Industrial- Ing. Sistemas (e)")], // Ajusta la profesión según sea necesario
            }),
            new TableCell({
              children: [new Paragraph("rmendoza@unitru.edu.pe")], // Actualiza con el email correspondiente si es necesario
            }),
          ],
        }),
      ],
      width: { size: 10000, type: WidthType.DXA },
      alignment: AlignmentType.LEFT,
    });
    
    // Crear la sección de Sumilla
    const sumillaSection = [
      new Paragraph({
        children: [
          new TextRun({
            text: "II. SUMILLA:",
            bold: true,
          }),
        ],
      }),
      ...sumillaText.map(text => 
        new Paragraph({
          children: [
            new TextRun({
              text,
            }),
          ],
          alignment: AlignmentType.JUSTIFIED, // Justificación del texto
        })
      ),
    ];

    const competenciasSection = [
      new Paragraph({
        children: [
          new TextRun({
            text: "III. COMPETENCIAS",
            bold: true,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: competenciasText,
          }),
        ],
        spacing: { after: 200 }, // Espacio después del párrafo
        alignment: AlignmentType.JUSTIFIED, // Justificación del texto
      }),
      new Paragraph({children: [
        new TextRun({
          text: "RESULTADOS DEL ESTUDIANTE QUE SON ABORDADOS EN EL CURSO",
          bold: true,
        }),
      ]}),
      ...resultadosText.map(text => 
        new Paragraph({
          children: [
            new TextRun({
              text,
            }),
          ],
          alignment: AlignmentType.JUSTIFIED, // Justificación del texto
        })
      ),
    ];

    // Tabla de Programación Académica
    const programacionAcademicaTable = new Table({
      rows: [
        // Fila de encabezados
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "CAPACIDADES", bold: true })] })],
              width: { size: 1500, type: WidthType.DXA },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "RESULTADOS DE APRENDIZAJES", bold: true })] })],
              width: { size: 2000, type: WidthType.DXA },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "CONTENIDOS POR UNIDADES", bold: true })] })],
              width: { size: 2000, type: WidthType.DXA },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "ESTRATEGIAS DIDÁCTICA", bold: true })] })],
              width: { size: 2000, type: WidthType.DXA },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "EVIDENCIAS DE EVALUACIÓN", bold: true })] })],
              width: { size: 2000, type: WidthType.DXA },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "INSTRUMENTOS DE EVALUACIÓN", bold: true })] })],
              width: { size: 2000, type: WidthType.DXA },
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "N° SEMANAS", bold: true })] })],
              width: { size: 1000, type: WidthType.DXA },
            }),
          ],
        }),

        // Fila 2 de Unidad
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Identifica y define los requerimientos estratégicos y del conocimiento de los indicadores de gestión.")],
              rowSpan: 6, // Combina desde la fila 3 hasta la fila 7 en esta columna
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "UNIDAD I: PLANIFICACIÓN, REQUERIMIENTOS Y ANÁLISIS DE UN SISTEMA DE TOMA DE DECISIONES", bold: true })], alignment: AlignmentType.CENTER, })],
              columnSpan: 6, // Combina las celdas de la segunda columna a la séptima columna
            }),
          ],
        }),

        // Fila 3 con contenido detallado
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Identifica los requerimientos de información.")],
              rowSpan: 5, // Combina desde la fila 3 hasta la fila 7 en esta columna
            }),
            new TableCell({
              children: [new Paragraph("Sistemas de Soporte de Decisiones, Introducción, Tipos de Sistemas. Laboratorio 1: Visión General del Curso")],
            }),
            new TableCell({
              children: [new Paragraph("Socialización del Sílabo (video conferencia), exposición del docente con PPT, realización y envío de tarea.")],
            }),
            new TableCell({
              children: [new Paragraph("Informe de tipos de sistema de información.")],
            }),
            new TableCell({
              children: [new Paragraph("Rubrica")],
            }),
            new TableCell({
              children: [new Paragraph("Semana 1")],
            }),
          ],
        }),
        // Fila 4 con contenido detallado
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Data Warehouse. Construcción. Definición del Proceso Metodológico. Conociendo las Bases de Un Sistema Transaccional")],
            }),
            new TableCell({
              children: [new Paragraph("Exposición del docente (video conferencia), lectura de módulo de aprendizaje, realización y envío de tarea, resolución de ejercicio práctico.")],
            }),
            new TableCell({
              children: [new Paragraph("Informe de componentes iniciales de un data warehouse.")],
            }),
            new TableCell({
              children: [new Paragraph("Rubrica")],
            }),
            new TableCell({
              children: [new Paragraph("Semana 2")],
            }),
          ],
        }),
        // Fila 5
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Identificación de Requerimientos Estratégicos Parte I")],
            }),
            new TableCell({
              children: [new Paragraph("Exposición del docente (video conferencia), lectura de módulo de aprendizaje, realización y envío de tarea, resolución de ejercicio práctico.")],
            }),
            new TableCell({
              children: [new Paragraph("Requerimientos estratégicos")],
            }),
            new TableCell({
              children: [new Paragraph("Rubrica")],
            }),
            new TableCell({
              children: [new Paragraph("Semana 3")],
            }),
          ],
        }),
        // Fila 6
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Identificación de Requerimientos Estratégicos Parte II")],
            }),
            new TableCell({
              children: [new Paragraph("Exposición del docente (video conferencia), lectura de módulo de aprendizaje, realización y envío de tarea, resolución de ejercicio práctico.")],
            }),
            new TableCell({
              children: [new Paragraph("Análisis Dimensional Inicial.")],
            }),
            new TableCell({
              children: [new Paragraph("Rubrica")],
            }),
            new TableCell({
              children: [new Paragraph("Semana 4")],
            }),
          ],
        }),
        // Fila 7
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Primer Examen Parcial")],
            }),
            new TableCell({
              children: [new Paragraph("Desarrollo de prueba de conocimientos.")],
            }),
            new TableCell({
              children: [new Paragraph("Prueba.")],
            }),
            new TableCell({
              children: [new Paragraph("Prueba escrita Prueba práctica")],
            }),
            new TableCell({
              children: [new Paragraph("Semana 5")],
            }),
          ],
        }),

        // Fila de Unidad II
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Selecciona y aplica las técnicas y estrategias de modelamiento de base de datos multidimensionales...")],
          rowSpan: 6, // Esta celda ocupa desde la fila 2 hasta la fila 7 en la primera columna
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "UNIDAD II: ANALIZANDO Y DISEÑANDO BAJO EL MODELADO DIMENSIONAL", bold: true })],alignment: AlignmentType.CENTER, })],
          columnSpan: 6, // Esta celda ocupa toda la fila en las columnas 2 a 7
        }),
      ],
    }),

    // Fila 3 con contenido detallado para Unidad II
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Identifica, analiza y diseña los requisitos necesarios para el modelamiento...")],
          rowSpan: 5, // Combina desde la fila 3 hasta la fila 7 en la segunda columna
        }),
        new TableCell({
          children: [new Paragraph("Análisis y Diseño Dimensional. Laboratorio 7: Construyendo un DataWarehouse 5")],
        }),
        new TableCell({
          children: [new Paragraph("1. Exposición del docente (video conferencia)\n2. Lectura de módulo de aprendizaje.\n3. Realización y envío de tarea.\n4. Resolución de ejercicio práctico.")],
        }),
        new TableCell({
          children: [new Paragraph("Hoja de Gestión Cuadro Medidas y Dimensiones.")],
        }),
        new TableCell({
          children: [new Paragraph("Rubrica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 6")],
        }),
      ],
    }),

    // Fila 4 con contenido adicional
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Diseño Dimensional Avanzado. Laboratorio 8. Realizando Mapeo del Modelo Transaccional al Modelo Dimensional.")],
        }),
        new TableCell({
          children: [new Paragraph("1. Exposición del docente (video conferencia)\n2. Lectura de módulo de aprendizaje.\n3. Realización y envío de tarea.\n4. Resolución de ejercicio práctico.")],
        }),
        new TableCell({
          children: [new Paragraph("EL Grano, Implementando el DataWarehouse.")],
        }),
        new TableCell({
          children: [new Paragraph("Rubrica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 7")],
        }),
      ],
    }),

    // Fila 5
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Poblando un DataMart 1. (ETL) Validando calidad de Data. Laboratorio 9. Poblamiento a la BD Multidimensional.")],
        }),
        new TableCell({
          children: [new Paragraph("1. Exposición del docente (video conferencia)\n2. Lectura de módulo de aprendizaje.\n3. Realización y envío de tarea.\n4. Resolución de ejercicio práctico.")],
        }),
        new TableCell({
          children: [new Paragraph("Diseño Integración de Datos")],
        }),
        new TableCell({
          children: [new Paragraph("Rubrica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 8")],
        }),
      ],
    }),

    // Fila 6
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Presentación de avance de Proyecto Final")],
        }),
        new TableCell({
          children: [new Paragraph("1. Exposición de proyectos de estudiantes (video conferencia)")],
        }),
        new TableCell({
          children: [new Paragraph("Informe de avance proyecto")],
        }),
        new TableCell({
          children: [new Paragraph("Rubrica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 9")],
        }),
      ],
    }),

    // Fila 7
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Segundo Examen Parcial")],
        }),
        new TableCell({
          children: [new Paragraph("Desarrollo de prueba de conocimientos.")],
        }),
        new TableCell({
          children: [new Paragraph("Prueba.")],
        }),
        new TableCell({
          children: [new Paragraph("Prueba escrita Prueba práctica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 10")],
        }),
      ],
    }),

    // Fila de Unidad III
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Organiza y utiliza los requerimientos estratégicos...")],
          rowSpan: 7, // Combina desde la fila de la Unidad III
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "UNIDAD III: IMPLEMENTANDO SOLUCIÓN INTELIGENCIA DE NEGOCIOS", bold: true })], alignment: AlignmentType.CENTER, })],
          columnSpan: 6, // Esta celda ocupa toda la fila en las columnas 2 a 7
        }),
      ],
    }),

    // Fila 3 con contenido detallado para Unidad III
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Construye su Cubo Olap como herramienta tecnologica para aprovechar al maximo el modelo multidimensional")],
          rowSpan: 6, // Combina desde la fila 3 hasta la fila 7 en la segunda columna
        }),
        new TableCell({
          children: [new Paragraph("Construcción de Cubos OLAP\nLaboratorio 10: Construcción de Cubos OLAP")],
        }),
        new TableCell({
          children: [new Paragraph("1. Exposición del docente (video conferencia)\n2. Lectura de módulo de aprendizaje.\n3. Realización y envío de tarea.\n4. Resolución de ejercicio práctico.")],
        }),
        new TableCell({
          children: [new Paragraph("Prepara Cubos")],
        }),
        new TableCell({
          children: [new Paragraph("Rubrica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 11")],
        }),
      ],
    }),

    // Fila 4
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Implementando Aplicaciones BI-1")],
        }),
        new TableCell({
          children: [new Paragraph("1. Exposición del docente (video conferencia)\n2. Lectura de módulo de aprendizaje.\n3. Realización y envío de tarea.\n4. Resolución de ejercicio práctico.")],
        }),
        new TableCell({
          children: [new Paragraph("Desarrolla aplicaciones BI - Implementa KPI.")],
        }),
        new TableCell({
          children: [new Paragraph("Rubrica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 12")],
        }),
      ],
    }),

    // Fila 5
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Implementando Aplicaciones BI-2")],
        }),
        new TableCell({
          children: [new Paragraph("1. Exposición del docente (video conferencia)\n2. Lectura de módulo de aprendizaje.\n3. Realización y envío de tarea.\n4. Resolución de ejercicio práctico.")],
        }),
        new TableCell({
          children: [new Paragraph("Desarrolla aplicaciones BI - Implementa Visualizadores.")],
        }),
        new TableCell({
          children: [new Paragraph("Rubrica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 13")],
        }),
      ],
    }),

    // Fila 6
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Presentación de Proyecto Final.")],
        }),
        new TableCell({
          children: [new Paragraph("1. Exposición de proyecto por los estudiantes (video conferencia)")],
        }),
        new TableCell({
          children: [new Paragraph("Informe de proyecto final")],
        }),
        new TableCell({
          children: [new Paragraph("Rubrica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 14")],
        }),
      ],
    }),

    // Fila 7
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Tercer Examen Parcial")],
        }),
        new TableCell({
          children: [new Paragraph("Desarrollo de prueba de conocimientos.")],
        }),
        new TableCell({
          children: [new Paragraph("Prueba")],
        }),
        new TableCell({
          children: [new Paragraph("Prueba escrita Prueba práctica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 15")],
        }),
      ],
    }),

    // Fila 8
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Examen sustitutorio y examen de aplazados")],
        }),
        new TableCell({
          children: [new Paragraph("Desarrollo de prueba de conocimientos.")],
        }),
        new TableCell({
          children: [new Paragraph("Prueba")],
        }),
        new TableCell({
          children: [new Paragraph("Prueba escrita Prueba práctica")],
        }),
        new TableCell({
          children: [new Paragraph("Semana 16")],
        }),
      ],
    }),
      ],
      width: { size: 10000, type: WidthType.DXA },
      alignment: AlignmentType.LEFT,
    });


    // Crear el documento utilizando los datos del objeto y la tabla
    const doc = new Document({
      sections: [
        {
          headers: {
            default: header, // Asigna el encabezado a la sección
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "SÍLABO DE LA EXPERIENCIA CURRICULAR",
                  bold: true,
                  color: "000000",
                  size: 28,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "", }), // Párrafo vacío para crear espacio
            new Paragraph({
              children: [
                new TextRun({
                  text: data.curso.name || "Nombre del Curso",
                  color: "000000",
                  size: 24,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "", }), // Párrafo vacío para crear espacio
            new Paragraph({
              children: [
                new TextRun({
                  text: "I. DATOS DE IDENTIFICACIÓN",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({ text: "", }), // Párrafo vacío para crear espacio
            // Párrafos con tabulación hacia la derecha
            new Paragraph({ text: `1.1. Área: ${data.curso.area.nomArea}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.2. Facultad: ${data.curso.facultad.nomFacultad}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.3. Departamento Académico: ${data.curso.departamento.nomDepartamento}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.4. Programa/carrera profesional: ${data.escuela.name}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.5. Sede: ${data.filial.name}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.6. Año y Semestre académico: ${data.semestre_academico.nomSemestre}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.7. Ciclo: ${data.ciclo}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.8. Código de la experiencia curricular: ${data.idCurso}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.9. Sección(es)/grupo(s): ${data.grupo}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.10. Créditos: ${data.curso.creditos}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.11. Pre requisito: ${data.curso.prerequisitos || "Ninguno"}`, indent: { left: 320 } }),
            new Paragraph({
              text: `1.12. Inicio – término: ${new Date(data.semestre_academico.fInicio).toLocaleDateString()} – ${new Date(data.semestre_academico.fTermino).toLocaleDateString()}`,
              indent: { left: 320 },
            }),
            new Paragraph({ text: `1.13. Tipo: ${data.curso.tipo_curso.descripcion}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.14. Régimen: ${data.curso.regimen_curso.nomRegimen}`, indent: { left: 320 } }),
            new Paragraph({ text: `1.15. Organización semestral del tiempo (semanas):`, indent: { left: 320 } }),
            new Paragraph({ text: "", }), // Espacio antes de la tabla
            organizationTable, // Inserta la tabla aquí con mayor sangría ajustada
            new Paragraph({ text: "", }), // Espacio antes de la tabla de docentes
            new Paragraph({ text: "1.16. Docente / equipo docente(s):", indent: { left: 320 } }),
            new Paragraph({ text: "", }), // Espacio 
            docenteTable, // Nueva tabla de docente
            new Paragraph({ text: "", }), // Espacio antes de la sección SUMILLA
            ...sumillaSection, // Agregar la sección de SUMILLA aquí
            new Paragraph({ text: "", }), // Espacio antes de la sección COMPETENCIAS
            ...competenciasSection, // Agregar la sección de COMPETENCIAS aquí
            new Paragraph({ text: "", }), // Párrafo vacío para crear espacio
            new Paragraph({
              children: [
                new TextRun({
                  text: "IV. PROGRAMACIÓN ACADEMICA",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({ text: "", }), // Párrafo vacío para crear espacio
            programacionAcademicaTable, // Tabla de Programación Académica
            new Paragraph({ text: "", }), // Párrafo vacío para crear espacio
            new Paragraph({
              children: [
                new TextRun({
                  text: "V. SISTEMA DE EVALUACIÓN",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({ text: "", }), // Párrafo vacío para crear espacio
            new Paragraph({
              children: [
                new TextRun({
                  text: "VI. CONSEJERÍA ACADÉMICA",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({ text: "", }), // Párrafo vacío para crear espacio
            new Paragraph({
              children: [
                new TextRun({
                  text: "VII. REFERENCIAS BIBLIOGRÁFICAS",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({ text: "", }), // Párrafo vacío para crear espacio
          ],
        },
      ],
    });

    // Generar y descargar el archivo .docx
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "silabo_Plantilla.docx");
  };

  return (
    <div>
      <button onClick={handleDownload}>Descargar Documento</button>
    </div>
  );
};

export default DocumentComponent;
