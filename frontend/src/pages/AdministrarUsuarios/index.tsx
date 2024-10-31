import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronUp, ChevronDown, Plus, Edit, Download,Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveRoles, createUsuario, getInfoAdministrarUsuarios } from "@/pages/services/rolesyusuarios.services";

import Modal from './Modal';
import ModalCrear from './ModalCrear';
import ModalEliminar from './ModalEliminar';
import { getEscuelas } from '../services/escuela.services';

// Interfaces para tipado
interface Users {
  id: number;
  name: string;
}

interface Permiso {
  id: number;
  name: string;
  estado: string;
}

interface Activity {
  id: number;
  name: string;
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

  const [formData2, setFormData2] = useState<{
    id: number | '';
    name: string;
    permisos: any[];
  }>({
    id: '',
    name: '',
    permisos: [],
  });



  const [unidadToDelete, setUnidadToDelete] = useState<null | { id: number; Name: string; AsesorFree: boolean }>(null);
  const [data, setData] = useState<Users[]>([]);
  const [filters, setFilters] = useState({
    name: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Users | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false); // State for PersonaModal
  // Función para abrir PersonaModal
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);

  const openPersonaModal = () => setIsPersonaModalOpen(true);
  const closePersonaModal = () => setIsPersonaModalOpen(false);

  const closeModalCrear = () => {
    setIsModalCrearOpen(false);
  };

  const handleSavePersona = (formData: FormData) => {
    console.log('Contenido de formData:');

    // Convertir FormData a objeto plano
    const personaData: any = Object.fromEntries(formData.entries());

    // Crear un objeto solo con los campos necesarios
    const cleanedData = {
      name: personaData.Nombres,
      telefono: personaData.Celular,
      direccion: personaData.Direccion,
      foto: formData.get('Foto'), // Aquí obtenemos el archivo directamente de formData
      email: personaData.Email,
      password: personaData.Password,
    };

    console.log('Datos de la persona antes de enviar:', cleanedData);

    // Crear una nueva instancia de FormData para enviar al servidor
    const newFormData = new FormData();
    for (const key in cleanedData) {
      if (cleanedData.hasOwnProperty(key)) {
        // Aquí se añade el archivo como un objeto File
        newFormData.append(key, cleanedData[key]);
      }
    }

    // Llamar a createUsuario con el nuevo FormData
    createUsuario(newFormData)
      .then(result => {
        console.log('Usuario creado:', result);
      })
      .catch(error => {
        console.error('Error al crear usuario:', error);
      });

    // Cerrar el modal de persona
    closePersonaModal();
  };






  const [escuelas, setEscuelas] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [condicion, setCondicion] = useState([]);
  const [regimen, setRegimen] = useState([]);
  const [filial, setFilial] = useState([]);



  const [boxBActivities, setBoxBActivities] = useState<Activity[]>([]);
  const [originalBoxBActivities, setOriginalBoxBActivities] = useState<Activity[]>([]);
  const [selectedPermisosAsActivities, setSelectedPermisosAsActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  // Función para obtener datos al montar el componente
  const fetchData = async () => {
    setLoading(true); // Comienza la carga
    try {
      const data = await getInfoAdministrarUsuarios(); // Llamada optimizada
     // console.log('Datos obtenidos:', data); // Ver los datos en la consola

      // Almacena los datos en el estado
      setData(data.users);
      setOriginalBoxBActivities(data.roles);

      const updatedActivities = data.roles.map((rol) => ({
        id: rol.id,
        name: rol.name,
        estado: rol.estado,
      }));
      setBoxBActivities(updatedActivities);

      // Almacena las otras entidades en el estado
      setEscuelas(data.escuelas);
      setCategoria(data.categorias);
      setCondicion(data.condiciones);
      setFilial(data.filiales);
      setRegimen(data.regimenes);

      // Registra los datos en la consola
   //   console.log(data.escuelas);
    //  console.log(data.categorias);
    //  console.log(data.condiciones);
   //   console.log(data.filiales);
   //   console.log(data.regimenes);
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
  const sortData = (key: keyof Users) => {
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
  const getSortIcon = (key: keyof Users) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    }
    return <div className="w-3.5 h-3.5" />;
  };

  // Filtrar datos
  const filteredData = data.filter((item) => {
    const matchesName = filters.name === '' || item.name.toLowerCase().includes(filters.name.toLowerCase());
    return matchesName;
  });



  // Función para manejar la asignación de permisos a un rol
  const handleSave = async (
    selectedActivities: Activity[],
    escuelaSeleccionada: Escuela | null,
    docenteData: any | null
) => {
    try {
        const rolId = formData.id;
     //   console.log('Rol ID:', rolId);

        // Mapea las actividades seleccionadas para crear un array de roles a guardar
        const rolesToSave = selectedActivities.map((rol) => ({
            id: rol.id,
        }));
      //  console.log('Roles a guardar:', rolesToSave);

        // Agregar campos adicionales (ej. escuelaSeleccionada, docenteData)
        const additionalData = {
            escuela: escuelaSeleccionada ? { id: escuelaSeleccionada.idEscuela, name: escuelaSeleccionada.name } : null,
            docente: docenteData ? { ...docenteData } : null,
        };
     //   console.log('Datos adicionales:', additionalData);

        // Aquí ejecuta la lógica de guardado si es necesario
         const result = await saveRoles(rolId, rolesToSave, additionalData);
      //   console.log('Roles guardados:', result);

         await fetchData(); // Actualiza la lista después de guardar
         setBoxBActivities(originalBoxBActivities); // Resetea las actividades
        closeModalCrear(); // Cierra el modal
    } catch (error: any) {
        console.error('Error guardando permisos:', error.message);
    }
};



  // Funciones para editar Users (no modificar)
  const openModal = (data: Users | null = null) => {
    if (!loading) { // Solo abrir si no está cargando
      if (data) { // Modal de edición
        setFormData({
          id: data.id,
          name: data.name,
          roles: data.roles || [],
        });
      } else { // Modal de creación
        setFormData({
          id: '',
          name: '',
          roles: [],
        });
      }
      setSelectedPermisosAsActivities([]); // Reiniciar permisos seleccionados
      setBoxBActivities([...originalBoxBActivities]); // Copiar permisos originales
      setIsModalOpen(true); // Abrir el modal de edición
    }
  };
  const closeModal = () => setIsModalOpen(false);

  // Funciones para eliminar Users (no modificar)
  const openDeleteModal = (unidad: Users) => {
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
              placeholder="Nombre de Usuario"
              className="w-full p-2 border rounded-md"
            />
          </div>

        </div>
      </div>

      {/* Tabla y Botones */}
      <div className="w-full max-w-full rounded-lg shadow-lg bg-white p-6 dark:bg-boxdark">
        {/* Botón Agregar */}
        <button

          onClick={openPersonaModal} // Abrir PersonaModal
          className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mb-4"
        >
          <Plus className="w-5 h-5 text-white mr-2" />
          Agregar
        </button>

        {/* Título y Botón Exportar */}
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Resultados</h3>
          <button
            // onClick={exportToCSV}
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <Download size={18} className="mr-2" />
            Exportar en excel
          </button>
        </div>

        {/* Tabla de Users */}
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr className="bg-primary text-left text-white">
              {['Nombres', 'Correo', 'Roles'].map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => sortData(key as keyof Users)}
                >
                  <div className="flex items-center">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {getSortIcon(key as keyof Users)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="border-b border-gray-200 py-4 px-6">{item.lastname + ' ' + item.name}</td>

                <td className="border-b border-gray-200 py-4 px-6">{item.email}</td>

                <td className="border-b border-gray-200 py-4 px-6">
                  <div className="flex items-center space-x-4">
                    {/* Botón Editar */}
                    <Eye
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
          handleSave={handleSave}
          initialFormData={formData}
          escuelas={escuelas} // Pasar la lista de escuelas
          regimen={regimen}
          filial={filial}
          condicion={condicion}
          categoria={categoria}
        />



      </DndProvider>
      <ModalEliminar
        isDeleteModalOpen={isDeleteModalOpen}
        closeDeleteModal={closeDeleteModal}
        handleDelete={handleDelete}
      />

      <ModalCrear
        isOpen={isPersonaModalOpen}
        onClose={closePersonaModal}
        onSave={handleSavePersona}
      />
    </div>
  );
};

export default FilteredUnidad;
