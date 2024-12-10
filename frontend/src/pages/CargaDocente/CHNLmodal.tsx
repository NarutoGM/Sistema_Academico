import React, { useState } from 'react';

interface CHNLmodalProps {
  docente: { id: number; nombre: string; apellido: string };
  idFilial: number;
  idDirector: number;
  onClose: () => void; // Función para cerrar el modal
}

interface Carga {
  codigo: string;
  nombre: string;
  descripcion: string;
  horas: number;
}

const CHNLmodal: React.FC<CHNLmodalProps> = ({ docente, idFilial, idDirector, onClose }) => {
  // Cargas no lectivas (lista original)
  const [cargasNoLectivas, setCargasNoLectivas] = useState<Carga[]>([
    {
      codigo: 'CL001',
      nombre: 'PREPARACION Y EVALUACION',
      descripcion: 'ACTIVIDADES DE PLANIFICACION, IMPLEMENTACION Y EVALUACION DE LAS ACTIVIDADES LECTIVAS.',
      horas: 9,
    },
    {
      codigo: 'CL002',
      nombre: 'ACTIVIDADES DE INVESTIGACION',
      descripcion: 'DESARROLLO DE PROYECTOS DE INVESTIGACION EN EL ÁMBITO DE LA EDUCACION.',
      horas: 12,
    },
    {
      codigo: 'CL003',
      nombre: 'TUTORIA Y CONSEJERIA',
      descripcion: 'PARA ALUMNOS DE LAS ASIGNATURAS CURRICULARES ASIGNADAS EN EL PRESENTE SEMESTRE.',
      horas: 6,
    },
    {
      codigo: 'CL004',
      nombre: 'RESPONSABILIDAD SOCIAL UNIVERSITARIA',
      descripcion: 'ACTIVIDADES RELACIONADAS CON LA INTERACCION DE LA UNIVERSIDAD CON LA COMUNIDAD Y LA SOCIEDAD EN GENERAL.',
      horas: 8,
    },
    {
      codigo: 'CL005',
      nombre: 'ASESORÍA DE TESIS Y EXÁMENES PROFESIONALES',
      descripcion: 'APOYO A LOS ESTUDIANTES EN EL DESARROLLO DE SUS TESIS Y EN LA PREPARACION DE EXAMENES PROFESIONALES.',
      horas: 10,
    },
    {
      codigo: 'CL006',
      nombre: 'FORMACIÓN ACADÉMICA Y CAPACITACIÓN',
      descripcion: 'ACTIVIDADES DE CAPACITACIÓN Y DESARROLLO DE HABILIDADES PARA EL PERSONAL ACADÉMICO Y ESTUDIANTES.',
      horas: 7,
    },
  ]);

  // Cargas asignadas
  const [cargasAsignadas, setCargasAsignadas] = useState<Carga[]>([]);

  // Agregar carga a las cargas asignadas
  const handleAgregarCarga = (carga: Carga) => {
    // Agregar a cargas asignadas
    setCargasAsignadas([...cargasAsignadas, carga]);

    // Eliminar de cargas no lectivas
    setCargasNoLectivas(cargasNoLectivas.filter((item) => item.codigo !== carga.codigo));
  };

  // Eliminar carga de las cargas asignadas
  const handleEliminarCarga = (index: number) => {
    const cargaEliminada = cargasAsignadas[index];
    // Volver a agregar a las cargas no lectivas
    setCargasNoLectivas([...cargasNoLectivas, cargaEliminada]);

    // Eliminar de cargas asignadas
    const nuevasCargas = cargasAsignadas.filter((_, i) => i !== index);
    setCargasAsignadas(nuevasCargas);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Carga Horaria No Lectiva a {docente.nombre} {docente.apellido}
        </h2>

        <div className="mb-4">
          <p className="text-gray-700">ID Director: {idDirector}</p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Carga Horaria No Lectiva</h2>

          {/* Tabla de cargas no lectivas */}
          <table className="min-w-full bg-white mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th> {/* Índice */}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Código</th> {/* Código */}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Nombre de la Carga</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Descripción</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Horas</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Acción</th>
              </tr>
            </thead>
            <tbody>
              {cargasNoLectivas.map((carga, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td> {/* Mostrar el índice */}
                  <td className="px-6 py-4 text-sm text-gray-800">{carga.codigo}</td> {/* Mostrar el código */}
                  <td className="px-6 py-4 text-sm text-gray-800">{carga.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{carga.descripcion}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{carga.horas}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <button
                      onClick={() => handleAgregarCarga(carga)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Agregar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tabla de cargas asignadas */}
          <h3 className="text-xl font-bold text-green-600 mb-4">Cargas Seleccionadas</h3>
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th> {/* Índice */}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Código</th> {/* Código */}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Nombre de la Carga</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Descripción</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Horas</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Acción</th>
              </tr>
            </thead>
            <tbody>
              {cargasAsignadas.length > 0 ? (
                cargasAsignadas.map((carga, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{carga.codigo}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{carga.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{carga.descripcion}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{carga.horas}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <button
                        onClick={() => handleEliminarCarga(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No has seleccionado ninguna carga.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Botones */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CHNLmodal;
