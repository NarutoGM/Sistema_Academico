import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import {
  getFiliales,
  getDocentesByFilial,
  Filial,
  Docente,
  getCursosAsignados,
} from '@/pages/services/cargadocente.services';

import AsignarCursosModal from './AsignarCursosModal';
import CHNLmodal from './CHNLmodal';
import PDFcombinado from './PDFcombinado.js';
import ReportePDF from './ReportePDF'; // Importa el nuevo componente
import ReporteObservaciones from './ReporteObservaciones';
import ReporteDocentesFilial from './ReporteDocentesFilial';
import PDFCargaAdicional from './PDFCargaAdicional'; // Ajusta la ruta según la ubicación del componente


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
  const [loadingDocentes, setLoadingDocentes] = useState(false); // Estado para indicar si los docentes están cargando

  const [docentesState, setDocentesState] = useState(() => {
    const storedData = localStorage.getItem('docentesData');
    return storedData ? JSON.parse(storedData) : {};
  });

  // Guardar docentesState en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('docentesData', JSON.stringify(docentesState));
  }, [docentesState]);

  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [showModalCHL, setShowModalCHL] = useState(false);
  const [showModalCHNL, setShowModalCHNL] = useState(false);

  // Estado para los cursos asignados
  const [cursosAsignados, setCursosAsignados] = useState<any[]>([]);

  // Obtener idDirector
  const authData = isAuthenticated();
  const idDirector = authData?.id ? parseInt(authData.id, 10) : null; // Asegúrate de que el id del usuario esté disponible
  if (!idDirector) {
    console.error('No se pudo obtener el idDirector');
    return;
  }

  //Docentes filiales 1 y 3
  const [filial1Docentes, setFilial1Docentes] = useState<Docente[]>([]);
  const [filial3Docentes, setFilial3Docentes] = useState<Docente[]>([]);
  const [docentesComunes, setDocentesComunes] = useState<Docente[]>([]);

  // Cargar docentes para las filiales 1 y 3
  useEffect(() => {
    const fetchDocentesFiliales = async () => {
      try {
        const docentes1 = await getDocentesByFilial(1);
        const docentes3 = await getDocentesByFilial(3);
        setFilial1Docentes(docentes1);
        setFilial3Docentes(docentes3);

        // Identificar docentes que están en ambas filiales
        const comunes = docentes1.filter((docente1) =>
          docentes3.some((docente3) => docente1.id === docente3.id),
        );
        setDocentesComunes(comunes);
      } catch (error) {
        console.error('Error al cargar los docentes de filiales:', error);
      }
    };

    fetchDocentesFiliales();
  }, []);

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
          setLoadingDocentes(true); // Inicia la carga
          // Obtener el número de cursos asignados para cada docente
          const docentesConCursos = await Promise.all(
            data.map(async (docente) => {
              try {
                const cursosAsignados = await getCursosAsignados(
                  docente.id,
                  selectedFilial,
                );
                return {
                  ...docente,
                  nroCursos: cursosAsignados.length, // Número de cursos asignados
                };
              } catch (error) {
                console.error(
                  `Error al cargar cursos asignados para el docente ${docente.id}:`,
                  error,
                );
                return { ...docente, nroCursos: 0 }; // Si falla, asignar 0
              }
            }),
          );

          setDocentes(docentesConCursos);
          setFilteredDocentes(docentesConCursos); // Inicialmente, mostrar todos los docentes
        } catch (error) {
          console.error('Error al cargar docentes por filiales:', error);
        } finally {
          setLoadingDocentes(false); // Finaliza la carga
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

  //CHL
  const handleEditarCHL = (docente: Docente) => {
    setSelectedDocente(docente); // Establece el docente seleccionado
    setShowModalCHL(true); // Muestra el modal
  };

  const handleCloseModalCHL = () => {
    setShowModalCHL(false); // Cierra el modal
    setSelectedDocente(null); // Limpia el docente seleccionado
  };

  //CHNL
  const handleEditarCHNL = (docente: Docente) => {
    setSelectedDocente(docente); // Establece el docente seleccionado
    setShowModalCHNL(true); // Muestra el modal
  };

  const handleCloseModalCHNL = () => {
    setShowModalCHNL(false); // Cierra el modal
    setSelectedDocente(null); // Limpia el docente seleccionado
  };

  // Asignar los cursos desde el modal
  const handleCursosAsignados = (cursos: any[]) => {
    setCursosAsignados(cursos); // Actualizamos el estado con los cursos asignados
  };

  //PDF
  const generatePDF = async (docenteId: number, docenteName: string) => {};

  const handleCheckboxChange = (id: number) => {
    setDocentesState((prevState: any) => {
      const updatedState = { ...prevState };
      updatedState[id] = {
        ...updatedState[id],
        observacion: !updatedState[id]?.observacion,
      };
      return updatedState;
    });
  };

  const generateRandomDate = (id: number): string => {
    if (docentesState[id]?.fechaEnvio) return docentesState[id].fechaEnvio;

    const start = new Date('2024-09-01').getTime();
    const end = new Date('2024-09-30').getTime();
    const randomTimestamp = Math.random() * (end - start) + start;
    const randomDate = new Date(randomTimestamp).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    setDocentesState((prevState: any) => ({
      ...prevState,
      [id]: { ...prevState[id], fechaEnvio: randomDate },
    }));

    return randomDate;
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
        <h3 className="text-1x3 font-bold mb-4">Docentes por filial</h3>
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
                Acciones
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
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        docente.nroCursos === 0
                          ? 'bg-red-100 text-red-800' // Sin iniciar
                          : 'bg-yellow-100 text-yellow-800' // En proceso
                      }`}
                    >
                      {docente.nroCursos === 0 ? 'Sin iniciar' : 'En proceso'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">
                    <button
                      onClick={() => handleEditarCHL(docente)}
                      className="bg-green-500 text-white px-4 py-2 m-3 rounded hover:bg-green-600 transition duration-300"
                    >
                      CHL
                    </button>

                    <button
                      onClick={() => handleEditarCHNL(docente)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                      CHNL
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 flex gap-2">
                    {/* Botón para descargar el reporte PDF */}

                    <PDFcombinado
                      docente={{
                        id: docente.id,
                        nombre: docente.nombre,
                        apellido: docente.apellido,
                        dni: docente.dni,
                      }}
                      idFilial={selectedFilial ?? 0}
                      idDirector={idDirector}
                    />

                    {/* Botón CA */}
                    <PDFCargaAdicional docente={docente} />
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
        <ReportePDF
          disabled={loadingDocentes || docentes.length === 0}
          docentes={filteredDocentes}
          idFilial={selectedFilial ?? 0}
          idDirector={idDirector}
        />

        <h3 className="text-1x3 font-bold mb-4">Observaciones</h3>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Observaciones
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Accion
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Fecha de Envío
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDocentes
              .filter((docente) => docente.nroCursos > 0)
              .map((docente) => {
                const observacion =
                  docentesState[docente.id]?.observacion || false;
                const fechaEnvio = generateRandomDate(docente.id);

                return (
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
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          observacion
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {observacion ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={observacion}
                        onChange={() => handleCheckboxChange(docente.id)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {fechaEnvio}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {/* Componente para el reporte de observaciones */}
        <ReporteObservaciones
          docentes={filteredDocentes.map((docente) => ({
            id: docente.id,
            nombre: docente.nombre,
            apellido: docente.apellido,
            nrocursos: docente.nroCursos,
            observacion: docentesState[docente.id]?.observacion ? 'Sí' : 'No',
            descripcion: docentesState[docente.id]?.observacion || false,
            fechaEnvio:
              docentesState[docente.id]?.fechaEnvio ||
              generateRandomDate(docente.id),
          }))}
        />

        <h3 className="text-2xl font-bold mb-4">Docentes en Ambas Filiales</h3>
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Filial Trujillo
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Filial ValleJequeteque
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Ambas Filiales
              </th>
            </tr>
          </thead>
          <tbody>
            {filial1Docentes.map((docente1, index) => (
              <tr
                key={docente1.id}
                className="hover:bg-gray-100 transition duration-300"
              >
                <td className="px-6 py-4 text-sm text-gray-800">
                  {docente1.nombre} {docente1.apellido}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {filial3Docentes[index]
                    ? `${filial3Docentes[index].nombre} ${filial3Docentes[index].apellido}`
                    : ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {docentesComunes.some((doc) => doc.id === docente1.id)
                    ? `${docente1.nombre} ${docente1.apellido}`
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Componente para el reporte de docentes por filiales */}
        <ReporteDocentesFilial
          docentesFilial={[
            ...filial1Docentes.map((docente1) => ({
              id: docente1.id,
              nombre: docente1.nombre,
              apellido: docente1.apellido,
              enFilial1: true, // Pertenece a Filial 1 porque está en `filial1Docentes`
              enFilial3: filial3Docentes.some((doc) => doc.id === docente1.id), // Verificar si también está en Filial 3
              enAmbas: docentesComunes.some((doc) => doc.id === docente1.id), // Verificar si está en ambas
            })),
            ...filial3Docentes
              .filter(
                (docente3) =>
                  !filial1Docentes.some((doc) => doc.id === docente3.id),
              ) // Excluir los que ya están en Filial 1
              .map((docente3) => ({
                id: docente3.id,
                nombre: docente3.nombre,
                apellido: docente3.apellido,
                enFilial1: false, // No pertenece a Filial 1
                enFilial3: true, // Pertenece a Filial 3 porque está en `filial3Docentes`
                enAmbas: false, // No está en ambas porque no está en Filial 1
              })),
          ]}
        />

        {/* Modal */}
        {showModalCHL && selectedDocente && selectedFilial !== null && (
          <AsignarCursosModal
            docente={selectedDocente}
            idFilial={selectedFilial}
            idDirector={idDirector}
            onClose={handleCloseModalCHL}
          />
        )}

        {showModalCHNL && selectedDocente && selectedFilial !== null && (
          <CHNLmodal
            docente={selectedDocente}
            idFilial={selectedFilial}
            idDirector={idDirector}
            onClose={handleCloseModalCHNL}
          />
        )}
      </div>
    </div>
  );
};

export default CargaDocente;
