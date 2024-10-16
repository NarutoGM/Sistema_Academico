import React, { useEffect, useState } from 'react';
import { getResponsables,  getResponsable,createResponsable, Responsable, deleteResponsable } from '../services/responsable.service';
import { getUnidades, Unidad } from '../services/unidad.service'; 
import { Plus, Edit, Trash2, Eye } from 'react-feather';
import ResponsableModal from '../Responsable/ResponsableModal';
import ResponsableEditModal from '../Responsable/ResponsableEditModal'; // Importa el nuevo modal
import ConfirmationModal from '../Responsable/ResponsableConfirmation'; // Asegúrate de importar el modal de confirmación
import FirmaModal from '../Responsable/ResponsableFirma'; // Cambia el nombre del modal

const ITEMS_PER_PAGE = 6;

const ResponsableTable: React.FC = () => {
  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false); // Estado para el modal de edición
  const [responsableToEdit, setResponsableToEdit] = useState<any>(null); // Responsable a editar
  const [filterApellidos, setFilterApellidos] = useState<string>('');
  const [filterNombres, setFilterNombres] = useState<string>('');
  const [filterUnidad, setFilterUnidad] = useState<string>(''); 
  const [filterRol, setFilterRol] = useState<string>('');       
  const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [responsableToDelete, setResponsableToDelete] = useState<Responsable | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [selectedFirma, setSelectedFirma] = useState<string | null>(null); // Para almacenar la firma seleccionada
  const [isFirmaModalOpen, setFirmaModalOpen] = useState<boolean>(false);
  const [selectedResponsable, setSelectedResponsable] = useState<Responsable | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsablesData = await getResponsables();
        const unidadesData = await getUnidades(); // Cargar unidades también
        setResponsables(responsablesData);
        setUnidades(unidadesData); // Guardar unidades
      } catch (err: any) {
        console.error('Error al obtener datos:', err);
        setError('No se pudo cargar la lista de responsables o unidades.');
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


  const openEditModal = (responsable: any) => {
    setResponsableToEdit(responsable);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setResponsableToEdit(null);
  };

  const openFirmaModal = async (responsableId: number) => {
    try {
      const responsable = await getResponsable(responsableId);
      setSelectedResponsable(responsable); // Guarda el responsable seleccionado
      setFirmaModalOpen(true); // Abre el modal de la firma
    } catch (error) {
      console.error('Error al obtener responsable:', error);
    }
  };

  const closeFirmaModal = () => {
    setFirmaModalOpen(false);
    setSelectedResponsable(null); // Resetea el responsable seleccionado
  };

  const handleEdit = (responsable: Responsable) => {
    setResponsableToEdit(responsable); // Asigna el responsable a editar
    setEditModalOpen(true); // Abre el modal de edición
  };


    // Función para mostrar la firma digital
    const handleShowFirma = async (id: number) => {
      try {
        const responsable = await getResponsable(id); // Obtener el responsable por ID
        setSelectedFirma(responsable.firmadigital); // Guardar la URL de la firma digital
        setModalOpen(true); // Abrir el modal para mostrar la imagen
      } catch (error) {
        console.error('Error al obtener la firma digital:', error);
      }
    };


  const openConfirmModal = (responsable: Responsable) => {
    setResponsableToDelete(responsable);
    setConfirmModalOpen(true);
  };
  
  const handleDelete = async () => {
    if (responsableToDelete) {
      try {
        await deleteResponsable(responsableToDelete.id);
        setResponsables(responsables.filter(r => r.id !== responsableToDelete.id)); // Actualiza el estado local
        setConfirmModalOpen(false); // Cierra el modal
        setResponsableToDelete(null); // Resetea el responsable a eliminar
        setConfirmationMessage(`El responsable ${responsableToDelete.nombres} ${responsableToDelete.apellidos} fue eliminado correctamente.`);
        
        // Configura un temporizador para borrar el mensaje después de 3 segundos
        setTimeout(() => {
          setConfirmationMessage(null);
        }, 2000);
      } catch (error) {
        console.error('Error al eliminar responsable:', error);
      }
    }
  };
  
  
  const handleSaveEdit = async (formData: FormData) => {
    try {
      // Lógica para guardar los cambios del responsable editado
      setEditModalOpen(false);
      const data = await getResponsables();
      setResponsables(data);
    } catch (error) {
      console.error('Error al editar responsable:', error);
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      await createResponsable(formData);
      setModalOpen(false);
      const data = await getResponsables();
      setResponsables(data);
    } catch (error) {
      console.error('Error al guardar responsable:', error);
    }
  };

  const handleNextPage = () => {
    if ((currentPage * ITEMS_PER_PAGE) < filteredResponsables.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredResponsables = responsables.filter((item) =>
    item.apellidos.toLowerCase().includes(filterApellidos.toLowerCase()) &&
    item.nombres.toLowerCase().includes(filterNombres.toLowerCase()) &&
    (filterUnidad === '' || item.unidad.toLowerCase().includes(filterUnidad.toLowerCase())) &&
    (filterRol === '' || item.rol.toLowerCase().includes(filterRol.toLowerCase()))
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentResponsables = filteredResponsables.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredResponsables.length / ITEMS_PER_PAGE);

  const renderPagination = () => {
    return (
      <div className="flex items-center justify-center space-x-4">
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
    );
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-gray-50">

                {/* Mensaje de confirmación */}
                {confirmationMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {confirmationMessage}
            </div>
          )}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        {/* Inputs para los filtros */}
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Filtrar por Apellidos"
            value={filterApellidos}
            onChange={(e) => setFilterApellidos(e.target.value)}
            className="border rounded-lg p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Filtrar por Nombres"
            value={filterNombres}
            onChange={(e) => setFilterNombres(e.target.value)}
            className="border rounded-lg p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Filtrar por Unidad"
            value={filterUnidad}
            onChange={(e) => setFilterUnidad(e.target.value)}
            className="border rounded-lg p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Filtrar por Rol"
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="border rounded-lg p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="w-full max-w-full rounded-lg shadow-lg bg-white p-6 dark:bg-boxdark">
        <button
          className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mb-4"
          onClick={openModal}
        >
          <Plus className="w-5 h-5 text-white mr-2" />
          Agregar
        </button>

        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr className="bg-primary text-left text-white">
              <th className="px-6 py-3">Apellidos</th>
              <th className="px-6 py-3">Nombres</th>
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3">Unidad</th>
              <th className="px-6 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {currentResponsables.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="border-b border-gray-200 py-4 px-6">{item.apellidos}</td>
                <td className="border-b border-gray-200 py-4 px-6">{item.nombres}</td>
                <td className="border-b border-gray-200 py-4 px-6">{item.rol}</td>
                <td className="border-b border-gray-200 py-4 px-6">{item.unidad}</td>
                <td className="border-b border-gray-200 py-4 px-6">
                  <div className="flex items-center space-x-4">
                  <button onClick={() => openEditModal(item)} className="mr-2">
              <Edit className="w-5 h-5 text-blue-500" />
            </button>

            <Eye
                              onClick={() => openFirmaModal(item.id)}
                  className="text-blue-500 hover:text-blue-700"
               />
            <Trash2
             className="w-5 h-5 text-gray-600 hover:text-yellow-600 cursor-pointer"
              onClick={() => openConfirmModal(item)} // Cambiado para abrir el modal de confirmación
               />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-center">
          {renderPagination()}
        </div>
      </div>
      {/* Modal de edición */}
      <ResponsableEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
        responsableToEdit={responsableToEdit}
      />

 {/* Modal para mostrar la firma */}
 {isFirmaModalOpen && selectedResponsable && (
        <FirmaModal
          responsable={selectedResponsable}
          onClose={closeFirmaModal}
        />
      )}
<ConfirmationModal
  isOpen={isConfirmModalOpen}
  onClose={() => setConfirmModalOpen(false)}
  onConfirm={handleDelete}
/>


      <ResponsableModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} />
    </div>
  );
};

export default ResponsableTable;
