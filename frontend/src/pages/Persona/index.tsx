import React, { useEffect, useState } from 'react';
import { getPersonas, createPersona, Persona } from '../services/persona.service'; // Importar servicios de personas
import { Plus, Edit, Trash2 } from 'react-feather';
import PersonaModal from './createModal'; // Importar el modal

const ITEMS_PER_PAGE = 6;

const PersonaTable: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Estados para los filtros
  const [nombresFilter, setNombresFilter] = useState<string>('');
  const [apellidosFilter, setApellidosFilter] = useState<string>('');
  const [docIdentidadFilter, setDocIdentidadFilter] = useState<string>('');
  const [emailFilter, setEmailFilter] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personasData = await getPersonas();
        setPersonas(personasData);
      } catch (err: any) {
        console.error('Error al obtener datos:', err);
        setError('No se pudo cargar la lista de personas.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSave = async (formData: FormData) => {
    try {
      await createPersona(formData); // Llama al servicio para guardar la persona
      setModalOpen(false); // Cierra el modal
      const data = await getPersonas(); // Recarga la lista de personas
      setPersonas(data); // Actualiza la lista de personas
    } catch (error) {
      console.error('Error al guardar persona:', error);
    }
  };

  const handleNextPage = () => {
    if ((currentPage * ITEMS_PER_PAGE) < filteredPersonas.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filtrado de personas
  const filteredPersonas = personas.filter(persona => {
    return (
      persona.Nombres.toLowerCase().includes(nombresFilter.toLowerCase()) &&
      persona.Apellidos.toLowerCase().includes(apellidosFilter.toLowerCase()) &&
      persona.DocIdentidad.toLowerCase().includes(docIdentidadFilter.toLowerCase()) &&
      persona.Email.toLowerCase().includes(emailFilter.toLowerCase())
    );
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPersonas = filteredPersonas.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredPersonas.length / ITEMS_PER_PAGE);

  return (
    <div className="p-4 bg-gray-50">
     {/* Filtros para buscar personas */}
     <div className="mb-4">
          <input
            type="text"
            placeholder="Filtrar por Nombres"
            className="border border-gray-300 rounded p-2 mr-2"
            value={nombresFilter}
            onChange={(e) => setNombresFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por Apellidos"
            className="border border-gray-300 rounded p-2 mr-2"
            value={apellidosFilter}
            onChange={(e) => setApellidosFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por Doc. Identidad"
            className="border border-gray-300 rounded p-2 mr-2"
            value={docIdentidadFilter}
            onChange={(e) => setDocIdentidadFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por Email"
            className="border border-gray-300 rounded p-2 mr-2"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>
    
      <div className="w-full max-w-full rounded-lg shadow-lg bg-white p-6 dark:bg-boxdark">
        <button
          className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mb-4"
          onClick={openModal} // Abre el modal al hacer clic
        >
          <Plus className="w-5 h-5 text-white mr-2" />
          Agregar Persona
        </button>

       

        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr className="bg-primary text-left text-white">
              <th className="px-6 py-3">Nombres</th>
              <th className="px-6 py-3">Apellidos</th>
              <th className="px-6 py-3">Doc. Identidad</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {currentPersonas.map((persona) => (
              <tr key={persona.DocIdentidad} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="border-b border-gray-200 py-4 px-6">{persona.Nombres}</td>
                <td className="border-b border-gray-200 py-4 px-6">{persona.Apellidos}</td>
                <td className="border-b border-gray-200 py-4 px-6">{persona.DocIdentidad}</td>
                <td className="border-b border-gray-200 py-4 px-6">{persona.Email}</td>
                <td className="border-b border-gray-200 py-4 px-6">
                  <div className="flex items-center space-x-4">
                    <Edit className="w-5 h-5 text-blue-500 cursor-pointer" />
                    <Trash2 className="w-5 h-5 text-red-500 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>{currentPage} de {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de registro de personas */}
      <PersonaModal
        isOpen={isModalOpen} // Estado que controla si el modal está abierto o cerrado
        onClose={closeModal}  // Función para cerrar el modal
        onSave={handleSave}   // Función para guardar la persona
      />
    </div>
  );
};

export default PersonaTable;
