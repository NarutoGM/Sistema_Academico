import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Plus, Edit, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPermisos, createPermiso, updatePermiso, deletePermiso } from "@/pages/services/permisos.services";
import ModalUnidad from './ModalUnidad';
import ModalEliminar from './ModalEliminar';

const FilteredUnidad = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState<1 | 2 | null>(null);
  const [formData, setFormData] = useState<{
    id: number | '';
    descripcion: string;
    estado: boolean; 
  }>({
    id: '',
    descripcion: '',
    estado: true,
  });
  const [permisoToDelete, setPermisoToDelete] = useState<null | { id: number; descripcion: string; estado: boolean }>(null);
  const [data, setData] = useState<Permiso[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Permiso | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({
    descripcion: '',
    estado: '',
  });
  const navigate = useNavigate();

  const openModal = (type: 1 | 2, data: Permiso | null = null) => {
    setModalType(type);
    if (type === 2 && data) {
      setFormData({
        id: data.id,
        descripcion: data.descripcion,
        estado: data.estado,
      });
    } else {
      setFormData({ id: '', descripcion: '', estado: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const openDeleteModal = (permiso: Permiso) => {
    setPermisoToDelete(permiso);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {

    
    if (!permisoToDelete) return;
  
    console.log('Eliminando permiso con ID:', permisoToDelete.id);
  
    try {
      await deletePermiso(permisoToDelete.id);
      setData((prevData) => prevData.filter((item) => item.id !== permisoToDelete.id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar permiso:', error);
    }
  };
  

  const handleSubmit = async () => {
    try {
      const permisoData = {
        descripcion: formData.descripcion,
        estado: formData.estado,
      };

      if (modalType === 1) {
        const nuevoPermiso = await createPermiso(permisoData);
        setData((prevData) => [...prevData, nuevoPermiso]);
      } else if (modalType === 2 && typeof formData.id === 'number') {
        const permisoActualizado = await updatePermiso(formData.id, permisoData);
        setData((prevData) =>
          prevData.map((item) =>
            item.id === permisoActualizado.id ? permisoActualizado : item
          )
        );
      }
      closeModal();
    } catch (error) {
      console.error('Error al crear/editar permiso:', error);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else {
        alert('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      }
    }
  };

  const filteredData = data.filter((item) => {
    const matchesDescripcion = filters.descripcion === '' || item.descripcion.toLowerCase().includes(filters.descripcion.toLowerCase());
    const matchesEstado = filters.estado === '' || (item.estado ? '1' : '0') === filters.estado;
    return matchesDescripcion && matchesEstado;
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const permisos = await getPermisos(); // Llamada simplificada sin pasar el token
        setData(permisos);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
        
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const sortData = (key: keyof Permiso) => {
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

  const getSortIcon = (key: keyof Permiso) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    }
    return <div className="w-3.5 h-3.5" />;
  };

  const exportToCSV = () => {
    const headers = ['Descripción', 'Estado'];
    const csvContent = [
      headers.join(','),
      ...data.map((item) => [item.descripcion, item.estado ? '1' : '0'].join(',')),
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

  return (
    <div className="p-4 bg-gray-50">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <input 
              type="text" 
              name="descripcion"
              value={filters.descripcion}
              onChange={handleFilterChange}
              placeholder="Descripción" 
              className="w-full p-2 border rounded-md" 
            />
          </div>
          <div>
            <select 
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="">Estado</option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full max-w-full rounded-lg shadow-lg bg-white p-6 dark:bg-boxdark">
        <button 
          className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
          onClick={() => openModal(1)}
        >
          <Plus className="w-5 h-5 text-white mr-2" />
          Agregar
        </button>

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
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr className="bg-primary text-left text-white">
              {['Descripción', 'Estado'].map((key) => (
                <th 
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => sortData(key as keyof Permiso)}
                >
                  <div className="flex items-center">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {getSortIcon(key as keyof Permiso)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="border-b border-gray-200 py-4 px-6">{item.descripcion}</td>
                <td className="border-b border-gray-200 py-4 px-6">
                  <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${item.estado ? 'bg-success text-success' : 'bg-danger text-danger'}`}>
                    {item.estado ? 'Activo' : 'Inactivo'}
                  </p>
                </td>
                <td className="border-b border-gray-200 py-4 px-6">
                  <div className="flex items-center space-x-4">
                    <Edit
                      className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer"
                      onClick={() => openModal(2, item)}
                    />
                    <Trash2
                      className="w-5 h-5 text-gray-600 hover:text-yellow-600 cursor-pointer"
                      onClick={() => openDeleteModal(item)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalUnidad 
        isModalOpen={isModalOpen} 
        closeModal={closeModal} 
        modalType={modalType} 
        formData={formData} 
        setFormData={setFormData} 
        handleSubmit={handleSubmit} 
      />
      <ModalEliminar
        isDeleteModalOpen={isDeleteModalOpen}
        closeDeleteModal={closeDeleteModal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default FilteredUnidad;