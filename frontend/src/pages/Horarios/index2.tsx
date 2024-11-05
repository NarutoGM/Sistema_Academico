import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface Curso {
  nombre: string;
  horasTeoria?: number;
  horasPractica?: number;
  horasLaboratorio?: number;
}

const cursosInicial: Curso[] = [
  { nombre: "Administración General - Teoría", horasTeoria: 2 },
  { nombre: "Administración General - Práctica", horasPractica: 2 },
  { nombre: "Estadística Aplicada - Teoría", horasTeoria: 2 },
  { nombre: "Estadística Aplicada - Práctica", horasPractica: 1 },
  { nombre: "Estadística Aplicada - Lab 1", horasLaboratorio: 2 },
  { nombre: "Programación Orientada a Objetos II - Teoría", horasTeoria: 3 },
  { nombre: "Programación Orientada a Objetos II - Práctica", horasPractica: 2 },
  { nombre: "Programación Orientada a Objetos II - Lab 1", horasLaboratorio: 2 },
  { nombre: "Programación Orientada a Objetos II - Lab 2", horasLaboratorio: 2 },
];

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Mapa de colores para cada curso (puedes personalizar los colores)
const cursoColores: { [key: string]: string } = {
  "Administración General": "#FFDDC1",
  "Estadística Aplicada": "#C1FFD7",
  "Programación Orientada a Objetos II": "#C1E1FF",
};

// Función para obtener el color de fondo basado en el nombre del curso
const obtenerColorCurso = (nombreCurso: string) => {
  const cursoBase = nombreCurso.split(" - ")[0]; // Solo obtener el nombre principal del curso
  return cursoColores[cursoBase] || "#E0E0E0"; // Color por defecto si no está en el mapa
};

const TablaHorario: React.FC<{ 
  horario: { [key: string]: string[] };
  handleDrop: (e: React.DragEvent<HTMLTableCellElement>, cellId: string, horas: number) => void;
  allowDrop: (e: React.DragEvent<HTMLTableCellElement>) => void;
}> = ({ horario, handleDrop, allowDrop }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border border-gray-300 font-bold text-center">Hora</th>
            {dias.map((dia) => (
              <th key={dia} className="px-4 py-2 border border-gray-300 font-bold text-center">{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, hourIndex) => (
            <tr key={hourIndex} className="text-center">
              <td className="px-4 py-2 border border-gray-300">{hourIndex + 8} AM</td>
              {dias.map((dia) => {
                const cellId = `${dia}-${hourIndex}`;
                return (
                  <td
                    key={cellId}
                    className="px-4 py-2 border border-gray-300"
                    onDrop={(e) => handleDrop(e, cellId, 1)}
                    onDragOver={allowDrop}
                  >
                    {horario[cellId] ? (
                      horario[cellId].map((curso, index) => (
                        <div
                          key={index}
                          className="p-1 mb-1 rounded"
                          style={{ backgroundColor: obtenerColorCurso(curso) }}
                        >
                          {curso}
                        </div>
                      ))
                    ) : (
                      <span>Arrastra aquí</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Horarios: React.FC = () => {
  const [horario, setHorario] = useState<{ [key: string]: string[] }>({});
  const [cursosDisponibles, setCursosDisponibles] = useState(cursosInicial);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, cursoNombre: string, horas: number) => {
    e.dataTransfer.setData("cursoNombre", cursoNombre);
    e.dataTransfer.setData("horas", horas.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, cellId: string, horas: number) => {
    e.preventDefault();
    const cursoNombre = e.dataTransfer.getData("cursoNombre");
    const horasNecesarias = parseInt(e.dataTransfer.getData("horas"), 10);

    const [dia, hourIndexStr] = cellId.split("-");
    const hourIndex = parseInt(hourIndexStr, 10);

    const celdasNecesarias = Array.from({ length: horasNecesarias }).map((_, i) => `${dia}-${hourIndex + i}`);
    const isAvailable = celdasNecesarias.every((celda) => !horario[celda] || horario[celda].length < 2);

    if (isAvailable) {
      const newHorario = { ...horario };
      celdasNecesarias.forEach((celda) => {
        if (!newHorario[celda]) {
          newHorario[celda] = [];
        }
        newHorario[celda].push(cursoNombre);
      });

      setHorario(newHorario);

      setCursosDisponibles((prevCursos) => prevCursos.filter((curso) => curso.nombre !== cursoNombre));
    } else {
      alert("No hay suficientes horas disponibles para asignar este curso en este bloque.");
    }
  };

  const allowDrop = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
  };

  const exportToExcel = () => {
    const worksheetData = [["Hora", ...dias]];

    Array.from({ length: 8 }).forEach((_, hourIndex) => {
      const row = [`${hourIndex + 8} AM`];
      dias.forEach((dia) => {
        const cellId = `${dia}-${hourIndex}`;
        row.push(horario[cellId] ? horario[cellId].join(", ") : "");
      });
      worksheetData.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Horario");

    XLSX.writeFile(workbook, "Horario_Cursos.xlsx");
  };

  return (
    <div className="flex p-6 bg-gray-100 min-h-screen">
      <div className="w-1/4 p-4 bg-white border border-gray-300 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Cursos</h2>
        {cursosDisponibles.map((curso) => (
          <div
            key={curso.nombre}
            className="p-2 mb-2 rounded cursor-pointer"
            style={{ backgroundColor: obtenerColorCurso(curso.nombre) }}
            draggable
            onDragStart={(e) => handleDragStart(e, curso.nombre, curso.horasTeoria || curso.horasPractica || curso.horasLaboratorio || 0)}
          >
            {curso.nombre} ({curso.horasTeoria || curso.horasPractica || curso.horasLaboratorio || 0}h)
          </div>
        ))}
        <button
          onClick={exportToExcel}
          className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Descargar Horario en Excel
        </button>
      </div>

      <div className="w-3/4 p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Horario de Cursos</h1>
        <TablaHorario horario={horario} handleDrop={handleDrop} allowDrop={allowDrop} />
      </div>
    </div>
  );
};

export default Horarios;
