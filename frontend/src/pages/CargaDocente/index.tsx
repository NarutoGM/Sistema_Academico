// src/CargaDocente/index.tsx
import React, { useState, useEffect } from 'react';
import {getFiliales} from '@/pages/services/cargadocente.services';
import AsignarCursosModal from '@/pages/CargaDocente/AsignarCursosModal';

interface Filial {
  id: number;
  name: string;
}

interface Docente {
  id: number;
  name: string;
  courseCount: number;
  status: 'Sin Iniciar' | 'Incompleto' | 'Completado';
}

interface Curso {
  id: number;
  name: string;
  ciclo: string;
  escuela: string;
}

const CargaDocente: React.FC = () => {
  const [selectedFilial, setSelectedFilial] = useState<number | null>(null);
  const [filiales, setFiliales] = useState<Filial[]>([]);
  const [searchDocente, setSearchDocente] = useState<string>('');
  

  const [docentes] = useState<Docente[]>([
    { id: 1, name: 'Profesor A', courseCount: 0, status: 'Sin Iniciar' },
    { id: 2, name: 'Profesor B', courseCount: 2, status: 'Incompleto' },
    { id: 3, name: 'Profesor C', courseCount: 3, status: 'Completado' },
  ]);

  const [cursos] = useState<Curso[]>([
    { id: 1, name: 'Curso 1', ciclo: 'Ciclo 1', escuela: 'Escuela A' },
    { id: 2, name: 'Curso 2', ciclo: 'Ciclo 2', escuela: 'Escuela B' },
    { id: 3, name: 'Curso 3', ciclo: 'Ciclo 1', escuela: 'Escuela A' },
  ]);

  useEffect(() => {
    // Obtener las filiales al montar el componente
    const fetchFiliales = async () => {
      try {
        console.log('Llamando a getFiliales...');
        const filialesData = await getFiliales();
        console.log('Datos de filiales recibidos:', filialesData);
        setFiliales(filialesData);
      } catch (error) {
        console.error('Error al cargar las filiales:', error);
      }
    };

    fetchFiliales();
  }, []);


  const [showAsignarCursosModal, setShowAsignarCursosModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null);
  const [selectedCursos, setSelectedCursos] = useState<Curso[]>([]);

  const handleFilialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilial(Number(event.target.value));
  };

  const handleSearchDocente = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDocente(event.target.value);
  };

  const filteredDocentes = docentes.filter((docente) =>
    docente.name.toLowerCase().includes(searchDocente.toLowerCase())
  );

  const handleOpenAsignarCursosModal = (docente: Docente) => {
    setSelectedDocente(docente);
    setShowAsignarCursosModal(true);
  };

  const handleSaveCursos = (cursosSeleccionados: Curso[]) => {
    setSelectedCursos(cursosSeleccionados);
    setShowAsignarCursosModal(false);
  };

  return (
    <div className="p-4 text-gray-100">
      <h2 className="text-2xl mb-4">Carga Docente</h2>

      <div className="mb-4">
        <label htmlFor="filialSelect" className="block mb-1">
          Filial:
        </label>
        <select
          id="filialSelect"
          className="p-2 bg-gray-700 border border-gray-500 rounded w-2/ "
          value={selectedFilial ?? ''}
          onChange={handleFilialChange}
        >
          <option value="" disabled>
            Seleccione una filial
          </option>
          {filiales.map((filial) => (
            <option key={filial.id} value={filial.id}>
              {filial.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="searchDocente" className="block mb-1">
          Buscar docente:
        </label>
        <div className="flex w-1/2">
          <input
            id="searchDocente"
            type="text"
            className="p-2 bg-gray-700 border border-gray-500 rounded-l w-full"
            placeholder="Ingrese el nombre del docente"
            value={searchDocente}
            onChange={handleSearchDocente}
          />  
          <button className="bg-blue-500 text-white px-4 rounded-r">
            Buscar
          </button>
        </div>
      </div>

      {selectedFilial && (
        <table className="w-full bg-gray-800 text-gray-100 rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 border-b border-gray-600">Id</th>
              <th className="p-3 border-b border-gray-600">Docente</th>
              <th className="p-3 border-b border-gray-600">Nro de Cursos</th>
              <th className="p-3 border-b border-gray-600">Estado</th>
              <th className="p-3 border-b border-gray-600">Acción</th>
              <th className="p-3 border-b border-gray-600">Reporte</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocentes.map((docente) => (
              <tr key={docente.id} className="hover:bg-gray-700">
                <td className="p-3 border-b border-gray-600">{docente.id}</td>
                <td className="p-3 border-b border-gray-600">{docente.name}</td>
                <td className="p-3 border-b border-gray-600">{docente.courseCount}</td>
                <td className="p-3 border-b border-gray-600">{docente.status}</td>
                <td className="p-3 border-b border-gray-600">
                  <button
                    className="bg-green-500 px-2 py-1 text-white rounded"
                    onClick={() => handleOpenAsignarCursosModal(docente)}
                  >
                    Editar
                  </button>
                </td>
                <td className="p-3 border-b border-gray-600">
                  <button className="bg-red-500 px-2 py-1 text-white rounded">
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para asignar cursos */}
      {selectedDocente && (
        <AsignarCursosModal
          isOpen={showAsignarCursosModal}
          onClose={() => setShowAsignarCursosModal(false)}
          onSave={handleSaveCursos}
          cursos={cursos}
          selectedCursos={selectedCursos} // Pasamos selectedCursos como prop para mantener el estado
          setSelectedCursos={setSelectedCursos} // Pasamos setSelectedCursos para actualizar el estado desde el modal
        />
      )}

      {/* Mostrar cursos asignados para el docente seleccionado */}
      {selectedDocente && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Cursos Asignados a {selectedDocente.name}</h3>
          <ul>
            {selectedCursos.map((curso) => (
              <li key={curso.id} className="py-1">{curso.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CargaDocente;
