import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import {
  getFiliales,
  getDocentesByFilial,
  Filial,
  Docente,
  getCursosAsignados
} from '@/pages/services/cargadocente.services';

import AsignarCursosModal from './AsignarCursosModal';
import { isAuthenticated } from '@/utils/auth';

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


  // Obtener idDirector
  const authData = isAuthenticated();
  const idDirector = authData?.id ? parseInt(authData.id, 10) : null; // Asegúrate de que el id del usuario esté disponible
  if (!idDirector) {
    console.error('No se pudo obtener el idDirector');
    return;
  }

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

          // Obtener el número de cursos asignados para cada docente
          const docentesConCursos = await Promise.all(
            data.map(async (docente) => {
              try {
                const cursosAsignados = await getCursosAsignados(docente.id, selectedFilial);
                return {
                  ...docente,
                  nroCursos: cursosAsignados.length, // Número de cursos asignados
                };
              } catch (error) {
                console.error(`Error al cargar cursos asignados para el docente ${docente.id}:`, error);
                return { ...docente, nroCursos: 0 }; // Si falla, asignar 0
              }
            })
          );
          
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


  //PDF
  const generatePDF = async (docenteId: number, docenteName: string) => {
    try {
      // Obtén los cursos asignados para el docente desde tu API
      const response = await fetch(
        `http://localhost:8000/api/cargadocente/${docenteId}/cursos`
      );
      if (!response.ok) {
        throw new Error('Error al obtener los cursos asignados');
      }
  
      const cursos = await response.json();
  
      // Inicializar jsPDF
      const doc = new jsPDF();
  
      // Agregar título
      doc.setFontSize(16);
      doc.text(`Reporte de Cursos Asignados`, 20, 20);
      doc.setFontSize(12);
      doc.text(`Docente: ${docenteName}`, 20, 30);
      doc.text(`ID Docente: ${docenteId}`, 20, 40);
  
      // Crear tabla con los cursos
      doc.setFontSize(10);
      const startY = 50;
      cursos.forEach((curso: { idCurso: number; nombreCurso: string }, index: number) => {
        const y = startY + index * 10;
        doc.text(`ID Curso: ${curso.idCurso}`, 20, y);
        doc.text(`Nombre Curso: ${curso.nombreCurso}`, 60, y);
      });
  
      // Guardar el archivo PDF
      doc.save(`Reporte_Docente_${docenteId}.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Ocurrió un error al generar el reporte.');
    }
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
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      En proceso
                    </span>
                  </td>

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
        {showModal && selectedDocente && selectedFilial !== null && (
          <AsignarCursosModal
            docente={selectedDocente}
            idFilial={selectedFilial}
            idDirector = {idDirector}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default CargaDocente;
