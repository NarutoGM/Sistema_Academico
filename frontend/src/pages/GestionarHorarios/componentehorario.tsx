import * as XLSX from "xlsx";

export const generateExcel = (data: any) => {
  try {
    const { cargadocente } = data; // Obtener la información de los ciclos
    const workbook = XLSX.utils.book_new(); // Crear un nuevo libro de Excel

    // Iterar sobre los ciclos y crear una hoja por ciclo
    Object.keys(cargadocente).forEach((ciclo) => {
      const cursos = cargadocente[ciclo];

      // Verificar que el ciclo tiene cursos
      if (Array.isArray(cursos) && cursos.length > 0) {
        // Crear los datos para la hoja
        const worksheetData: any[] = [
          ["Docente", "Curso", "Grupo",  "Créditos", "Horas Teóricas", "Horas Prácticas", "Horas Laboratorio"],
        ];

        // Agregar los cursos al worksheetData
        cursos.forEach((curso: any) => {
          worksheetData.push([
            `${curso.nomdocente} ${curso.apedocente}`,
            curso.curso.name,
            curso.grupo,
            curso.curso.creditos,
            curso.curso.hTeoricas,
            curso.curso.hPracticas,
            curso.curso.hLaboratorio,
          ]);
        });

        // Crear una hoja de cálculo para el ciclo
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Añadir la hoja al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, `Ciclo ${ciclo}`);
      }
    });

    // Retornar el libro generado
    return workbook;
  } catch (error) {
    console.error("Error al generar el Excel:", error);
    throw new Error("Error al generar el archivo Excel");
  }
};
