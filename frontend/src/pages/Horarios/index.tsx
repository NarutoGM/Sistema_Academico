import React, { useState } from 'react';

interface Curso {
  nombre: string;
  horasTeoria: number;
  horasPractica: number;
  horasLaboratorio: number;
  numLaboratorios: number;
}

const cursos: Curso[] = [
  {
    nombre: "Administración General",
    horasTeoria: 2,
    horasPractica: 2,
    horasLaboratorio: 0,
    numLaboratorios: 0,
  },
  {
    nombre: "Estadística Aplicada",
    horasTeoria: 2,
    horasPractica: 1,
    horasLaboratorio: 2,
    numLaboratorios: 1,
  },
  {
    nombre: "Programación Orientada a Objetos II",
    horasTeoria: 3,
    horasPractica: 2,
    horasLaboratorio: 2,
    numLaboratorios: 2,
  },
];

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const TablaHorario: React.FC = () => {
  const [horario, setHorario] = useState<{ [key: string]: string }>({});

  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, cellId: string) => {
    e.preventDefault();
    const cursoNombre = e.dataTransfer.getData("cursoNombre");
    setHorario((prevHorario) => ({ ...prevHorario, [cellId]: cursoNombre }));
  };

  const allowDrop = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
  };

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
              {dias.map((dia) => (
                <td
                  key={dia}
                  className="px-4 py-2 border border-gray-300"
                  onDrop={(e) => handleDrop(e, `${dia}-${hourIndex}`)}
                  onDragOver={allowDrop}
                >
                  {horario[`${dia}-${hourIndex}`] || "Arrastra aquí"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Horarios: React.FC = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, cursoNombre: string) => {
    e.dataTransfer.setData("cursoNombre", cursoNombre);
  };

  return (
    <div className="flex p-6 bg-gray-100 min-h-screen">
      {/* Lista de Cursos */}
      <div className="w-1/4 p-4 bg-white border border-gray-300 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Cursos</h2>
        {cursos.map((curso) => (
          <div
            key={curso.nombre}
            className="p-2 mb-2 bg-blue-200 rounded cursor-pointer"
            draggable
            onDragStart={(e) => handleDragStart(e, curso.nombre)}
          >
            {curso.nombre}
          </div>
        ))}
      </div>

      {/* Horario */}
      <div className="w-3/4 p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Horario de Cursos</h1>
        <TablaHorario />
      </div>
    </div>
  );
};

export default Horarios;
