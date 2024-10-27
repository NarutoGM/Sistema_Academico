// src/pages/Escuelas.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getEscuelas, createEscuela, updateEscuela, deleteEscuela } from '@/pages/services/escuela.services';
import { getFacultades } from '@/pages/services/facultades.services';
import CreateEditModal from '@/pages/Escuelas/Modal';
import DeleteConfirmationModal from '@/pages/Escuelas/ModalEliminar';

// Definición de tipos para Escuela y Facultad
interface Escuela {
  idEscuela: number;
  name: string;
  facultad?: Facultad;
}

interface Facultad {
  idFacultad: string;
  nomFacultad: string;
}

const Escuelas: React.FC = () => {
  const [escuelas, setEscuelas] = useState<Escuela[]>([]);
  const [facultades, setFacultades] = useState<Facultad[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEscuela, setCurrentEscuela] = useState<{ name: string; idFacultad: string | '' }>({ name: '', idFacultad: '' });
  const [selectedEscuela, setSelectedEscuela] = useState<Escuela | null>(null);

  // Estado para filtros y paginación
  const [filters, setFilters] = useState<{ name: string; idFacultad: string }>({ name: '', idFacultad: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchEscuelas();
    fetchFacultades();
  }, []);

  const fetchEscuelas = async () => {
    try {
      const data = await getEscuelas();
      setEscuelas(data);
    } catch (error) {
      console.error('Error al cargar las escuelas');
    }
  };

  const fetchFacultades = async () => {
    try {
      const data = await getFacultades();
      setFacultades(data);
    } catch (error) {
      console.error('Error al cargar las facultades');
    }
  };

  const openModal = (escuela: Partial<Escuela> = { name: '', idFacultad: '' }) => {
    setCurrentEscuela({ name: escuela.name || '', idFacultad: escuela.facultad?.idFacultad || '' });
    setIsEditing(!!escuela.idEscuela);
    setIsModalOpen(true);
  };

  const openDeleteModal = (escuela: Escuela) => {
    setSelectedEscuela(escuela);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEscuela) return;
    try {
      await deleteEscuela(selectedEscuela.idEscuela);
      fetchEscuelas();
      setIsDeleteModalOpen(false);
      setSelectedEscuela(null);
    } catch (error) {
      console.error('Error al eliminar la escuela');
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && selectedEscuela) {
        await updateEscuela(selectedEscuela.idEscuela, currentEscuela);
      } else {
        await createEscuela(currentEscuela);
      }
      fetchEscuelas();
      setIsModalOpen(false);
      setCurrentEscuela({ name: '', idFacultad: '' });
    } catch (error) {
      console.error('Error al guardar la escuela');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEscuela((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reinicia a la primera página cuando se aplica un filtro
  };

  // Filtra las escuelas en función de los filtros actuales
  const filteredEscuelas = escuelas.filter((escuela) => {
    const matchesName = escuela.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesFacultad = filters.idFacultad === '' || escuela.facultad?.idFacultad === filters.idFacultad;
    return matchesName && matchesFacultad;
  });

  // Paginación
  const totalPages = Math.ceil(filteredEscuelas.length / itemsPerPage);
  const paginatedEscuelas = filteredEscuelas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Gestión de Escuelas</h2>
        <button
          className="flex items-center bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => openModal()}
        >
          <Plus className="w-5 h-5 text-white mr-2" />
          Crear Escuela
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 mb-6 shadow rounded-md">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Nombre de la Escuela"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <select
            name="idFacultad"
            value={filters.idFacultad}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Todas las Facultades</option>
            {facultades.map((facultad) => (
              <option key={facultad.idFacultad} value={facultad.idFacultad}>
                {facultad.nomFacultad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Escuelas */}
      <div className="bg-white shadow-lg rounded-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-gray-600">Nombre de la Escuela</th>
              <th className="px-4 py-3 text-gray-600">Facultad</th>
              <th className="px-4 py-3 text-gray-600">Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEscuelas.map((escuela) => (
              <tr key={escuela.idEscuela} className="border-b">
                <td className="px-4 py-3">{escuela.name}</td>
                <td className="px-4 py-3">{escuela.facultad?.nomFacultad || 'Sin facultad'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-4">
                    <Edit
                      className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer"
                      onClick={() => openModal(escuela)}
                    />
                    <Trash2
                      className="w-5 h-5 text-gray-600 hover:text-red-600 cursor-pointer"
                      onClick={() => openDeleteModal(escuela)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">
          Página {currentPage} de {totalPages}
        </p>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal para crear/editar escuela */}
      <CreateEditModal
        isOpen={isModalOpen}
        isEditing={isEditing}
        currentEscuela={currentEscuela}
        facultades={facultades}
        onClose={() => setIsModalOpen(false)}
        onChange={handleChange}
        onSubmit={handleFormSubmit}
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Escuelas;
