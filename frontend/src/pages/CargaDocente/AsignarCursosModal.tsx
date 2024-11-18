import React, { useState, useEffect } from 'react';
import { getCursos, asignarCursosADocente, Curso } from '@/pages/services/cargadocente.services';

interface AsignarCursosModalProps {
  docente: { id: number; nombre: string; apellido: string }; // Información del docente
  onClose: () => void; // Función para cerrar el modal
}

const AsignarCursosModal: React.FC<AsignarCursosModalProps> = ({ docente, onClose }) => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedCursos, setSelectedCursos] = useState<Curso[]>([]); // Cursos seleccionados

  useEffect(() => {
    const fetchCursos = async () => {
      const data = await getCursos();
      setCursos(data);
    };
    fetchCursos();
  }, []);

  const handleAgregarCurso = (curso: Curso) => {
    if (!selectedCursos.find((c) => c.id === curso.id)) {
      setSelectedCursos([...selectedCursos, curso]);
    }
  };

  const handleEliminarCurso = (cursoId: number) => {
    setSelectedCursos(selectedCursos.filter((curso) => curso.id !== cursoId));
  };

  const handleGuardar = async () => {
    const cursoIds = selectedCursos.map((curso) => curso.id);
    await asignarCursosADocente(docente.id, cursoIds);
    alert('Cursos asignados correctamente');
    onClose(); // Cierra el modal
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-2/3">
        <h2 className="text-xl font-bold mb-4">
          Asignar Cursos a {docente.nombre} {docente.apellido}
        </h2>

        {/* Buscar y agregar curso */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Buscar curso:
          </label>
          <input
            type="text"
            placeholder="Escriba el nombre del curso"
            className="w-full border border-gray-300 rounded p-2"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
            onClick={() => handleAgregarCurso(cursos[0])} // Simula agregar un curso
          >
            Agregar
          </button>
        </div>

        {/* Lista de cursos seleccionados */}
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nro</th>
              <th className="px-4 py-2 border-b">Curso</th>
              <th className="px-4 py-2 border-b">Acción</th>
            </tr>
          </thead>
          <tbody>
            {selectedCursos.map((curso, index) => (
              <tr key={curso.id}>
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{curso.nombre}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleEliminarCurso(curso.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botón de guardar */}
        <div className="mt-4">
          <button
            onClick={handleGuardar}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarCursosModal;
