import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  getEscuelas,
  getMallaByEscuela,
  getSemestres,
  getCursosByMallaAndSemestre,
  getCursosAsignados,
  saveCursosAsignados
} from '@/pages/services/cargadocente.services';

interface AsignarCursosModalProps {
  docente: { id: number; nombre: string; apellido: string };
  idFilial: number;
  idDirector: number;
  onClose: () => void; // Función para cerrar el modal
}

interface Escuela {
  idEscuela: number;
  name: string;
}

interface SemestreAcademico {
  idSemestreAcademico: number;
  nomSemestre: string;
  añoAcademico: string;
}

// interface Malla{
//   idMalla: number;
//   año: number;
//   estado: string;
// }

interface Curso {
  idCurso: number;
  nombreCurso: string;
}

interface CargaDocente {
  idCargaDocente: number;
  idFilial: number;
  id: number;
  idSemestreAcademico: number;
  idMalla: number;
  idCurso: number;
  nombreCurso: string;
  idEscuela: number;
  idDirector: number;
  isNuevo:boolean;
}

const AsignarCursosModal: React.FC<AsignarCursosModalProps> = ({
  docente,
  idFilial,
  idDirector,
  onClose,
}) => {
  const [escuelas, setEscuelas] = useState<Escuela[]>([]);
  const [selectedEscuela, setSelectedEscuela] = useState<number | null>(null);
  const [malla, setMalla] = useState<{ idMalla: number; año: number } | null>(
    null,
  );
  const [semestres, setSemestres] = useState<SemestreAcademico[]>([]);
  const [selectedSemestre, setSelectedSemestre] = useState<number | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursosAsignados, setCursosAsignados] = useState<CargaDocente[]>([]); // Estado para cursos asignados

  const [cursosFiltrados, setCursosFiltrados] = useState<Curso[]>([]);

  // Opciones para React Select
  const escuelaOptions = escuelas.map((escuela) => ({
    value: escuela.idEscuela,
    label: escuela.name,
  }));

  // Cargar las escuelas al montar el componente
  useEffect(() => {
    const fetchEscuelas = async () => {
      try {
        const data = await getEscuelas();
        setEscuelas(data); // Actualiza las escuelas con los datos obtenidos
      } catch (error) {
        console.error('Error al cargar las escuelas:', error);
      }
    };

    fetchEscuelas();
  }, []);

  useEffect(() => {
    const fetchSemestres = async () => {
      try {
        const data = await getSemestres();
        setSemestres(data); // Carga los semestres en el estado
      } catch (error) {
        console.error('Error al cargar los semestres académicos:', error);
      }
    };

    fetchSemestres();
  }, []);

  // Cargar la malla cuando se selecciona la escuela
  const handleEscuelaChange = async (
    selectedOption: { value: number; label: string } | null,
  ) => {
    if (selectedOption) {
      const escuelaId = selectedOption.value;
      setSelectedEscuela(escuelaId);

      try {
        const mallaData = await getMallaByEscuela(escuelaId);
        setMalla(mallaData); // Guarda la malla obtenida
      } catch (error) {
        console.error('Error al obtener la malla:', error);
        setMalla(null); // Limpia la malla si ocurre un error
      }
    } else {
      setSelectedEscuela(null);
    }
  };

  // Cargar los cursos cuando se seleccionan la malla y el semestre
  useEffect(() => {
    if (selectedEscuela && malla && selectedSemestre) {
      const fetchCursos = async () => {
        try {
          const cursosData = await getCursosByMallaAndSemestre(
            selectedEscuela,
            malla.idMalla,
            selectedSemestre,
          );
          setCursos(cursosData);
        } catch (error) {
          console.error('Error al obtener los cursos:', error);
          setCursos([]);
        }
      };

      fetchCursos();
    }
  }, [selectedEscuela, malla, selectedSemestre]);

  const handleSemestreChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const semestreId = parseInt(event.target.value);
    setSelectedSemestre(!isNaN(semestreId) ? semestreId : null); // Actualiza el semestre seleccionado
  };

  // Cargar los cursos asignados a un docente
  useEffect(() => {
    const fetchCursosAsignados = async () => {
      try {
        const asignados = await getCursosAsignados(docente.id, idFilial);
        setCursosAsignados(
          asignados.map((curso) => ({
            ...curso,
            isNuevo: false, // Cursos existentes no son nuevos
          })),
        ); // Guardar cursos asignados en el estado
      } catch (error) {
        console.error('Error al obtener los cursos asignados:', error);
        setCursosAsignados([]); // Tabla vacía si hay error
      }
    };

    fetchCursosAsignados();
  }, [docente, idFilial]);

  //Cursos - cursos asignados
  useEffect(() => {
    const filtered = cursos.filter(
      (curso) =>
        !cursosAsignados.some((asignado) => asignado.idCurso === curso.idCurso),
    );
    setCursosFiltrados(filtered);
  }, [cursos, cursosAsignados]);

  //Agregar curso a cursos asignados
  const handleAgregarCurso = (curso: Curso) => {
    // Mover el curso a cursosAsignados
    setCursosAsignados((prev) => [
      ...prev,
      { ...curso,
         idCargaDocente: Date.now(), // Generar ID temporal para front
         isNuevo: true, // Marca el curso como nuevo
         } as CargaDocente, 
    ]);

    // Eliminar el curso de cursosFiltrados
    setCursosFiltrados((prev) =>
      prev.filter((disponible) => disponible.idCurso !== curso.idCurso),
    );
  };

  //Eliminar curso de cursos asignados
  const handleEliminarCurso = (curso: CargaDocente) => {
    // Eliminar el curso de cursosAsignados
    setCursosAsignados((prev) =>
      prev.filter((asignado) => asignado.idCurso !== curso.idCurso),
    );

    // Agregar el curso de nuevo a cursosFiltrados
    if (curso.isNuevo) {
      setCursosFiltrados((prev) => [
        ...prev,
        { idCurso: curso.idCurso, nombreCurso: curso.nombreCurso },
      ]);
    }
  };

  //Guardar curso asignado a docente
  const handleGuardar = async () => {
    try {

       // Filtrar los cursos nuevos
      const cursosNuevos = cursosAsignados.filter((curso) => curso.isNuevo);

      const dataToSave = cursosNuevos.map((curso) => ({
        idFilial,
        idDocente: docente.id,
        idSemestreAcademico: selectedSemestre!,
        idMalla: malla?.idMalla!,
        idCurso: curso.idCurso,
        idEscuela: selectedEscuela!,
        idDirector: 2, // Este valor ya se pasa al modal
        estado: true, // Estado por defecto
      }));
      
      // Mostrar información en la consola
      console.log('Datos a guardar:', JSON.stringify(dataToSave, null, 2));

      await saveCursosAsignados(dataToSave); // Llama a la función para guardar los datos
      alert('Cursos asignados correctamente');
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al guardar los cursos asignados:', error);
      alert('Ocurrió un error al guardar los cursos.');
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Asignar Cursos a {docente.nombre} {docente.apellido}
        </h2>

        <div className="mb-4">
          <p className="text-gray-700">ID Director: {idDirector}</p>
        </div>

        {/* Select para Escuelas */}
        <div className="mb-1">
          <label
            htmlFor="select-escuela"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Selecciona una Escuela:
          </label>
          <Select
            id="select-escuela"
            options={escuelaOptions}
            onChange={handleEscuelaChange}
            placeholder="Seleccione una escuela"
            className="basic-single"
            classNamePrefix="select"
          />
        </div>

        {/* Mostrar información de la malla */}
        {malla ? (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="text-gray-700">ID de Malla: {malla.idMalla}</p>
            <p className="text-gray-700">Año: {malla.año}</p>
          </div>
        ) : selectedEscuela ? (
          <p className="text-red-500">
            No se encontró una malla para esta escuela en el año 2018.
          </p>
        ) : (
          <div className="mb-2 p-4 bg-gray-100 rounded">
            <p className="text-gray-500">
              Seleccione una escuela para ver su malla.
            </p>
          </div>
        )}

        {/* Select para Semestres Académicos */}
        <div className="mb-4">
          <label
            htmlFor="select-semestre"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Selecciona un Semestre Académico:
          </label>
          <select
            id="select-semestre"
            onChange={handleSemestreChange}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Seleccione un semestre</option>
            {semestres.map((semestre) => (
              <option
                key={semestre.idSemestreAcademico}
                value={semestre.idSemestreAcademico}
              >
                {semestre.nomSemestre}
              </option>
            ))}
          </select>
        </div>

        {/* Tabla de Cursos */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Cursos Disponibles</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Nombre del Curso
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Accion
                  </th>
                </tr>
              </thead>
              <tbody>
                {cursosFiltrados.length > 0 ? (
                  cursosFiltrados.map((curso) => (
                    <tr key={curso.idCurso}>
                      <td className="px-4 py-2 text-sm">{curso.idCurso}</td>
                      <td className="px-4 py-2 text-sm">{curso.nombreCurso}</td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => handleAgregarCurso(curso)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                          Agregar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p className="text-gray-500">No hay cursos disponibles.</p>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla de Cursos Asignados */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Cursos Asignados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Nombre del Curso
                  </th>
                </tr>
              </thead>
              <tbody>
                {cursosAsignados.length > 0 ? (
                  cursosAsignados.map((cursoDocente) => (
                    <tr key={cursoDocente.idCargaDocente}>
                      <td className="px-4 py-2 text-sm">
                        {cursoDocente.idCurso}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {cursoDocente.nombreCurso}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => handleEliminarCurso(cursoDocente)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p className="text-gray-500">No hay cursos asignados.</p>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            disabled={!cursosAsignados.length} // Deshabilitar el botón si no hay malla
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarCursosModal;
