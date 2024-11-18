import React, { useEffect, useState } from 'react';
import {
  getFiliales,
  getDocentesByFilial,
  Filial,
  Docente,
} from '@/pages/services/cargadocente.services';

import AsignarCursosModal from './AsignarCursosModal';

const CargaDocente: React.FC = () => {
  const [filiales, setFiliales] = useState<Filial[]>([]);
  const [docentes, setDocentes] = useState<(Docente & { nroCursos: number })[]>(
    [],
  );
  const [filteredDocentes, setFilteredDocentes] = useState<
    (Docente & { nroCursos: number })[]
  >([]);
  const [selectedFilial, setSelectedFilial] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda
  const [error, setError] = useState<string | null>(null);

  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Cargar filiales al iniciar el componente
  useEffect(() => {
    const fetchFiliales = async () => {
      try {
        const data = await getFiliales();
        setFiliales(data);
      } catch (error) {
        console.error('Error al cargar las filiales:', error);
      }
    };

    fetchFiliales();
  }, []);

  // Cargar docentes cada vez que cambia la filial seleccionada
  useEffect(() => {
    if (selectedFilial !== null) {
      const fetchDocentes = async () => {
        try {
          const data = await getDocentesByFilial(selectedFilial);
          const docentesConCursos = data.map((docente) => ({
            ...docente,
            nroCursos: Math.floor(Math.random() * 5) + 1, // Generar número aleatorio entre 1 y 5
          }));
          setDocentes(docentesConCursos);
          setFilteredDocentes(docentesConCursos); // Inicialmente, mostrar todos los docentes
        } catch (error) {
          console.error('Error al cargar docentes por filiales:', error);
        }
      };

      fetchDocentes();
    } else {
      setDocentes([]);
      setFilteredDocentes([]);
    }
  }, [selectedFilial]);

  // Filtrar docentes cuando el usuario escribe en el campo de búsqueda
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = docentes.filter((docente) =>
      `${docente.nombre} ${docente.apellido}`
        .toLowerCase()
        .includes(lowerCaseSearchTerm),
    );
    setFilteredDocentes(filtered);
  }, [searchTerm, docentes]);

  const handleFilialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filialId = parseInt(event.target.value);
    if (!isNaN(filialId)) {
      setSelectedFilial(filialId);
      setError(null);
    } else {
      setSelectedFilial(null);
    }
  };

  const handleEditar = (docente: Docente) => {
    setSelectedDocente(docente); // Establece el docente seleccionado
    setShowModal(true); // Muestra el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
    setSelectedDocente(null); // Limpia el docente seleccionado
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Carga Docente</h1>

      <div className="grid grid-cols-2 gap-4">
        {/* Select para elegir la filial */}
        <div>
          <label
            htmlFor="filial-select"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Selecciona una filial:
          </label>
          <select
            id="filial-select"
            onChange={handleFilialChange}
            className="block w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Seleccione una filial</option>
            {filiales.map((filial) => (
              <option key={filial.idFilial} value={filial.idFilial}>
                {filial.name}
              </option>
            ))}
          </select>
        </div>

        {/* Campo de búsqueda */}
        <div>
          <label
            htmlFor="search-docente"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Buscar docente:
          </label>
          <input
            type="text"
            id="search-docente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ingrese el nombre o apellido del docente"
            disabled={docentes.length === 0} // Deshabilitar si no hay docentes cargados
            className={`block w-full p-2 border rounded ${
              docentes.length === 0
                ? 'bg-gray-200 cursor-not-allowed'
                : 'border-gray-300'
            }`}
          />
        </div>
      </div>

      {/* Mostrar tabla de docentes */}
      <div className="mt-6">
        <table className="min-w-full bg-white  ">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Nro Cursos
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Acción
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Reporte
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDocentes.length > 0 ? (
              filteredDocentes.map((docente) => (
                <tr
                  key={docente.id}
                  className="hover:bg-gray-100 transition duration-300"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {docente.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {docente.nombre} {docente.apellido}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {docente.nroCursos}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">Activo</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <button
                      onClick={() => handleEditar(docente)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                      Editar
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <button
                      onClick={() =>
                        alert(`Generar reporte para ${docente.nombre}`)
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Reporte
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  {selectedFilial
                    ? 'No hay docentes disponibles para esta filial.'
                    : 'Seleccione una filial para ver los docentes.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Modal */}
        {showModal && selectedDocente && (
          <AsignarCursosModal
            docente={selectedDocente}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default CargaDocente;
