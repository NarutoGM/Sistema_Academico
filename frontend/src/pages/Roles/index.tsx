import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronUp, ChevronDown, Plus, Edit, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRoles, login, getPermisos ,deleteRol,createRol,savePermisos} from "@/pages/services/rolesypermisos.services";
import Modal from './Modal';
import ModalCrear from './ModalCrear';
import ModalEliminar from './ModalEliminar';

// Interfaces para tipado
interface Roles {
  id: number;
  name: string;
}

interface Permiso {
  id: number;
  descripcion: string;
  estado: string;
}

interface Activity {
  id: number;
  descripcion: string;
  estado?: string;
}

const FilteredUnidad: React.FC = () => {
  const [formData, setFormData] = useState<{
    id: number | '';
    name: string;
    permisos: any[];
  }>({
    id: '',
    name: '',
    permisos: [],
  });
  
  const [unidadToDelete, setUnidadToDelete] = useState<null | { id: number; Descripcion: string; AsesorFree: boolean }>(null);
  const [data, setData] = useState<Roles[]>([]);
  const [filters, setFilters] = useState({
    name: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Roles | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);

  const [boxBActivities, setBoxBActivities] = useState<Activity[]>([]);
  const [originalBoxBActivities, setOriginalBoxBActivities] = useState<Activity[]>([]);
  const [selectedPermisosAsActivities, setSelectedPermisosAsActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  // Función para obtener datos al montar el componente
  const fetchData = async () => {
    setLoading(true); // Comienza la carga
    try {
      const tokenResponse = await login('t1053300121@unitru.edu.pe', 'password');
      setToken(tokenResponse);
      const roles = await getRoles(tokenResponse);
      setData(roles);
      const permisos = await getPermisos(tokenResponse);
      setOriginalBoxBActivities(permisos);
      const updatedActivities = permisos.map((permiso) => ({
        id: permiso.id,
        descripcion: permiso.descripcion,
        estado: permiso.estado,
      }));
      setBoxBActivities(updatedActivities);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Termina la carga
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manejar cambios en los filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Ordenar datos
  const sortData = (key: keyof Roles) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  // Obtener icono de orden
  const getSortIcon = (key: keyof Roles) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    }
    return <div className="w-3.5 h-3.5" />;
  };

  // Filtrar datos
  const filteredData = data.filter((item) => {
    const matchesName = filters.name === '' || item.name.toLowerCase().includes(filters.name.toLowerCase());
    return matchesName && matchesGuardName;
  });

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ['Rol', 'GuardName'];
    const csvContent = [
      headers.join(','),
      ...data.map((item) => [item.name].join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tabla_filtrada.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Función para manejar la asignación de permisos a un rol
  const handleSave = async (selectedActivities: Activity[]) => {
    try {
      const tokenResponse = token || await login('t1053300121@unitru.edu.pe', 'password');
      const rolId = formData.id;

      const permisosToSave = selectedActivities.map((permiso) => ({
        id: permiso.id,
      }));

      const result = await savePermisos(tokenResponse, rolId, permisosToSave);
      
      console.log('Permisos guardados:', result);
      await fetchData(); // Actualiza la lista después de guardar
      setBoxBActivities(originalBoxBActivities); // Resetea las actividades
      closeModalCrear(); // Cierra el modal
    } catch (error: any) {
      console.error('Error guardando permisos:', error.message);
    }
  };

  // Función para manejar el clic en guardar permisos
  const handleSaveClick = () => {
    handleSave(selectedPermisosAsActivities); // Pasa los permisos seleccionados
    closeModal(); // Cierra el modal de permisos
  };  

  // Función para abrir el modal de creación
  const openCreateModal = () => {
    setFormData({
      id: '',
      name: '',
      permisos: [],
    });
    setSelectedPermisosAsActivities([]); // Reiniciar permisos seleccionados
    setBoxBActivities([...originalBoxBActivities]); // Copiar permisos originales
    setIsModalCrearOpen(true); // Abrir el modal de creación
  };

  // Función para cerrar el modal de creación
  const closeModalCrear = () => {
    setIsModalCrearOpen(false);
  };

  // Funciones para editar roles (no modificar)
  const openModal = (data: Roles | null = null) => {
    if (!loading) { // Solo abrir si no está cargando
      if (data) { // Modal de edición
        setFormData({
          id: data.id,
          name: data.name,
          permisos: data.permisos || [],
        });
      } else { // Modal de creación
        setFormData({
          id: '',
          name: '',
          permisos: [],
        });
      }
      setSelectedPermisosAsActivities([]); // Reiniciar permisos seleccionados
      setBoxBActivities([...originalBoxBActivities]); // Copiar permisos originales
      setIsModalOpen(true); // Abrir el modal de edición
    }
  };
  const closeModal = () => setIsModalOpen(false);

  // Funciones para eliminar roles (no modificar)
  const openDeleteModal = (unidad: Roles) => {
    setUnidadToDelete(unidad);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    if (!unidadToDelete) return;
    try {
      await deleteRol(unidadToDelete.id);
      setData((prevData) => prevData.filter((item) => item.id !== unidadToDelete.id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar rol:', error);
    }
  };

  // Función para crear rol
  const handleSubmit = async () => {
    try {
      if (!token) {
        alert('No estás autenticado. Por favor, inicia sesión nuevamente.');
        return;
      }
  
      await createRol(token, formData); // Llamada a la función del servicio
  
      closeModalCrear();
      fetchData(); // Actualizar la lista de roles
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error al crear el rol: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-gray-50">
      {/* Filtros */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <input 
              type="text" 
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Rol" 
              className="w-full p-2 border rounded-md" 
            />
          </div>

        </div>
      </div>

      {/* Tabla y Botones */}
      <div className="w-full max-w-full rounded-lg shadow-lg bg-white p-6 dark:bg-boxdark">
        {/* Botón Agregar */}
        <button 
          onClick={openCreateModal} // Abrir el modal de creación
          className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mb-4"
        >
          <Plus className="w-5 h-5 text-white mr-2" />
          Agregar
        </button>

        {/* Título y Botón Exportar */}
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Resultados</h3>
          <button 
            onClick={exportToCSV}
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <Download size={18} className="mr-2" />
            Exportar a CSV
          </button>
        </div>

        {/* Tabla de Roles */}
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr className="bg-primary text-left text-white">
              {['Name', 'Permisos'].map((key) => (
                <th 
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => sortData(key as keyof Roles)}
                >
                  <div className="flex items-center">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {getSortIcon(key as keyof Roles)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="border-b border-gray-200 py-4 px-6">{item.name}</td>
                <td className="border-b border-gray-200 py-4 px-6">
                  <div className="flex items-center space-x-4">
                    {/* Botón Editar */}
                    <Edit
                      className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer"
                      onClick={() => openModal(item)} // Abrir modal de edición
                    />
                    {/* Botón Eliminar */}
                    <Trash2
                      className="w-5 h-5 text-gray-600 hover:text-yellow-600 cursor-pointer"
                      onClick={() => openDeleteModal(item)} // Abrir modal de eliminación
                    />
              
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Otros Modales */}
      <DndProvider backend={HTML5Backend}> 
        <Modal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          originalBoxBActivities={boxBActivities}
          handleSave={handleSave} // Asegúrate de que esto esté pasando correctamente
          initialFormData={formData}
        /> 
      </DndProvider>
      <ModalEliminar
        isDeleteModalOpen={isDeleteModalOpen}
        closeDeleteModal={closeDeleteModal}
        handleDelete={handleDelete}
      />

      {/* Modal Crear */}
      <ModalCrear
        isModalCrearOpen={isModalCrearOpen}
        closeModalCrear={closeModalCrear}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default FilteredUnidad;
