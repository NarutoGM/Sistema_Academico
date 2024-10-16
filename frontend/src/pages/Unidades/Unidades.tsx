import React, { useState,useRef , useEffect } from 'react';
import { ChevronUp, ChevronDown, Plus , Edit, Download, Trash2 } from 'lucide-react';
import { To, useNavigate } from 'react-router-dom';
import axios from 'axios';
//modal para eliminar
const ModalEliminar = ({ isDeleteModalOpen, closeDeleteModal, handleDelete }) => {
  
  const handleBackgroundClick = (e) => {
    // Si el clic fue en el fondo (no en el modal), cerramos el modal
    if (e.target === e.currentTarget) {
      closeDeleteModal();
    }
  };

  return (
    isDeleteModalOpen && (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackgroundClick} // Manejador de clic en el fondo
      >
        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h2 className="text-lg font-semibold mb-4">Confirmar Eliminación</h2>
          <p>¿Estás seguro de que deseas eliminar esta unidad?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={closeDeleteModal}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )
  );
};



//modal para crear y editar
const ModalUnidad = ({ isModalOpen, closeModal, modalType, formData, setFormData, handleSubmit }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal(); // Cierra el modal si se hace clic fuera de él
    }
  };

  return (
    isModalOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleClickOutside} // Detecta clics fuera del modal
      >
        <div ref={modalRef} className="bg-white p-6 ml-70 rounded shadow-lg max-w-md w-full">
          <h2 className="text-lg font-semibold mb-4">{modalType === 1 ? 'Crear Unidad' : 'Editar Unidad'}</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Unidad</label>
              <input
                type="text"
                value={formData.unidad}
                onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Solo muestra el campo de Estado si modalType es 2 */}
            {modalType === 2 && (
              <div className="mb-4">
                <label className="block text-gray-700">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccione Estado</option>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSubmit}
              >
                {modalType === 1 ? 'Crear' : 'Actualizar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};




const FilteredUnidad = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado del modal de eliminación
  const [modalType, setModalType] = useState(null); // 1 para crear, 2 para editar
  const [formData, setFormData] = useState({
    id: '',
    unidad: '',
    estado: ''
  });  
  const [unidadToDelete, setUnidadToDelete] = useState(null); // Para almacenar la unidad que se va a eliminar



  const openModal = (type, data = null) => {
    setModalType(type);
    if (type === 2 && data) {
      setFormData(data); // Si es editar, carga los datos
    } else {
      setFormData({ id: '', unidad: '', estado: '' }); // Si es crear, limpia el formulario
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };



  const openDeleteModal = (unidad) => {
    setUnidadToDelete(unidad);
    setIsDeleteModalOpen(true);
  };  
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const handleDelete = () => {
    const apiUrl = `http://127.0.0.1:8000/api/unidades/${unidadToDelete.id}`;
    axios.delete(apiUrl)
      .then(response => {
        console.log('Unidad eliminada:', response.data.message);
        setData(prevData => prevData.filter(item => item.id !== unidadToDelete.id)); // Actualiza los datos locales
        closeDeleteModal();
      })
      .catch(error => console.error('Error al eliminar la unidad:', error));
  };

//Llamado a las api de crear y editar

  const handleSubmit = () => {
    const apiUrl = 'http://127.0.0.1:8000/api/unidades'; 
    const method = modalType === 1 ? 'post' : 'put'; 
    const url = modalType === 2 ? `${apiUrl}/${formData.id}` : apiUrl; 
    
    axios({
      method: method,
      url: url,
      data: formData,
    })
      .then(response => {
        console.log('Mensaje:', response.data.message); // Imprimir el mensaje de éxito
        closeModal(); // Cierra el modal después de la operación
        
        // Actualiza los datos llamando a la API
        return axios.get(apiUrl); // Llama a la API para obtener los datos actualizados
      })
      .then(response => {
        const fetchedData = response.data.map(item => ({
          id: parseInt(item.idUnidad),  // Convertir a número
          unidad: item.unidad,
          estado: item.estado
        }));
        setData(fetchedData); // Almacena los datos en el estado
        applyFilters(fetchedData); // Aplica filtros con fetchedData
      })
      .catch(error => {
        console.error('Error al enviar los datos:', error);
      });
  };
  
  
  



  const navigate = useNavigate();

  const handleNavigate = (path: To) => {
    navigate(path);
  };



  const [data, setData] = useState([]);
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({
    unidad: '',
    estado: ''
  });



//Actualiza la tabla de la bd segun filtros

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/unidades')
      .then(response => {
        const fetchedData = response.data.map(item => ({
          id: parseInt(item.idUnidad),  // Convertir a número
          unidad: item.unidad,
          estado: item.estado
        }));
        setData(fetchedData); // Almacena los datos en el estado
        applyFilters(fetchedData); // Aplica filtros con fetchedData

        console.log(fetchedData);  // Ver los datos cargados
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [filters]); // El efecto se ejecuta cada vez que filters cambia




  const applyFilters = (fetchedData) => { // Recibe fetchedData como parámetro
    let filteredData = fetchedData.filter(item => {
      return (
        (filters.unidad === '' || item.unidad.toLowerCase().includes(filters.unidad.toLowerCase())) &&
        (filters.estado === '' || item.estado === filters.estado)
      );
    });

    setData(filteredData); // Actualiza el estado con los datos filtrados
  };

  const handleFilterChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const sortData = (key: string | null) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key , direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key: string | null) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    }
    return <div className="w-3.5 h-3.5" />;  // Placeholder to maintain consistent spacing
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Estado'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.unidad,
       
        item.estado,
        
      ].join(','))
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
            name="unidad"
            value={filters.unidad}
            onChange={handleFilterChange}
            placeholder="Título" 
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
        onClick={() => openModal(1)} // Crear nuevo
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
              {['nombre', 'estado'].map((key) => (
                <th 
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => sortData(key)}
                >
                  <div className="flex items-center">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {getSortIcon(key)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody >
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">

                <td className="border-b border-gray-200 py-4 px-6">{item.unidad}</td>
                <td className="border-b border-gray-200 py-4 px-6">
                
                  <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        item.estado === '1'
                          ? 'bg-success text-success'
                          : item.estado === '2'
                          ? 'bg-warning text-warning'
                          : 'bg-danger text-danger'
                      }`}
                    >
                    {item.estado === '1' ? 'Activo' : item.estado === '0' ? 'Inactivo' : 'Desconocido'}
                  </p>
                </td>
                <td className="border-b border-gray-200 py-4 px-6">
                  <div className="flex items-center space-x-4">
                  <Edit
                    className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer"
                    onClick={() => openModal(2, item)} // Editar con datos actuales
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
      {/* El modal de confirmación de eliminación */}
      <ModalEliminar
        isDeleteModalOpen={isDeleteModalOpen}
        closeDeleteModal={closeDeleteModal}
        handleDelete={handleDelete}
      />
    

    </div>

    
  );

  
};

export default FilteredUnidad;

