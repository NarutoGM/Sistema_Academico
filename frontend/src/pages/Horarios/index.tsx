import React from 'react';

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

  // Añade más cursos según sea necesario
  // Añade más cursos según sea necesario

    // Añade más cursos según sea necesario
  // Añade más cursos según sea necesario

  // Añade más cursos según sea necesario
];

const TablaHorario: React.FC<{ cursos: Curso[] }> = ({ cursos }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border border-gray-300 font-bold text-center">Curso</th>
            <th className="px-4 py-2 border border-gray-300 font-bold text-center">Teoría</th>
            <th className="px-4 py-2 border border-gray-300 font-bold text-center">Práctica</th>
            <th className="px-4 py-2 border border-gray-300 font-bold text-center">Laboratorio</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border border-gray-300">{curso.nombre}</td>
              <td className={`px-4 py-2 border border-gray-300 ${curso.horasTeoria > 0 ? 'bg-blue-100' : ''}`}>
                {curso.horasTeoria > 0 ? `${curso.horasTeoria} horas` : "N/A"}
              </td>
              <td className={`px-4 py-2 border border-gray-300 ${curso.horasPractica > 0 ? 'bg-green-100' : ''}`}>
                {curso.horasPractica > 0 ? `${curso.horasPractica} horas` : "N/A"}
              </td>
              <td className={`px-4 py-2 border border-gray-300 ${curso.horasLaboratorio > 0 ? 'bg-red-100' : ''}`}>
                {curso.horasLaboratorio > 0 ? `${curso.horasLaboratorio} horas (${curso.numLaboratorios} lab)` : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Horarios: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">Horario de Cursos</h1>
      <TablaHorario cursos={cursos} />
    </div>
  );
};

export default Horarios;
