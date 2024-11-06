import React, { useState, ChangeEvent } from 'react';

interface Curso {
  id: number;
  name: string;
  ciclo: string;
  escuela: string;
}

interface AsignarCursosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedCursos: Curso[]) => void;
  cursos: Curso[];
  selectedCursos: Curso[]; // Recibir los cursos seleccionados desde el componente principal
  setSelectedCursos: React.Dispatch<React.SetStateAction<Curso[]>>; // Función para actualizar cursos seleccionados
}

const AsignarCursosModal: React.FC<AsignarCursosModalProps> = ({
  isOpen,
  onClose,
  onSave,
  cursos,
  selectedCursos,
  setSelectedCursos, // Función para actualizar cursos seleccionados
}) => {
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>(cursos);
  const [cicloFilter, setCicloFilter] = useState('');
  const [escuelaFilter, setEscuelaFilter] = useState('');

  const handleAddCurso = (curso: Curso) => {
    if (!selectedCursos.some((c) => c.id === curso.id)) {
      setSelectedCursos([...selectedCursos, curso]);
    }
  };

  const handleRemoveCurso = (cursoId: number) => {
    setSelectedCursos(selectedCursos.filter((curso) => curso.id !== cursoId));
  };

  const handleFilterChange = () => {
    setFilteredCursos(
      cursos.filter((curso) =>
        curso.ciclo.includes(cicloFilter) && curso.escuela.includes(escuelaFilter)
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Cierra el modal al hacer clic en el fondo
    >
      <div
        className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro del modal
      >
        <h3 className="text-lg font-semibold mb-4">Asignar Cursos</h3>
        
        {/* Filtros de ciclo y escuela */}
        <div className="mb-4">
          <label className="block text-gray-700">Ciclo:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={cicloFilter}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCicloFilter(e.target.value)}
            placeholder="Filtrar por ciclo"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Escuela:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={escuelaFilter}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEscuelaFilter(e.target.value)}
            placeholder="Filtrar por escuela"
          />
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full mb-4"
          onClick={handleFilterChange}
        >
          Aplicar filtros
        </button>

        {/* Lista de cursos filtrados */}
        <table className="w-full text-left mb-4">
          <thead>
            <tr>
              <th className="py-2">Curso</th>
              <th className="py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredCursos.map((curso) => (
              <tr key={curso.id} className="border-t">
                <td className="py-2">{curso.name}</td>
                <td className="py-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleAddCurso(curso)}
                  >
                    Agregar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Lista de cursos seleccionados */}
        <h5 className="font-semibold mb-2">Cursos seleccionados</h5>
        <table className="w-full text-left mb-4">
          <thead>
            <tr>
              <th className="py-2">Curso</th>
              <th className="py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {selectedCursos.map((curso) => (
              <tr key={curso.id} className="border-t">
                <td className="py-2">{curso.name}</td>
                <td className="py-2">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleRemoveCurso(curso.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botones para cerrar y guardar */}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => onSave(selectedCursos)}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarCursosModal;
