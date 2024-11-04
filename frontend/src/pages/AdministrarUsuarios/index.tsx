import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronUp, ChevronDown, Plus, Edit, Download, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveRoles, createUsuario, getInfoAdministrarUsuarios, User,FilialInfo , Docente, DirectorEscuela, Categoria, Condicion, Regimen, Filial, Rol, Escuela } from "@/pages/services/rolesyusuarios.services";

import Modal from './Modal';
import ModalCrear from './ModalCrear';

interface Activity {
  id: number;
  name: string;
  estado?: string;
}


const FilteredUnidad: React.FC = () => {
  const [formData, setFormData] = useState<{
    id: number | '';
    name: string;
    roles: Rol[]; // Asegúrate de definir esta propiedad
    permisos: any[];
  }>({
    id: '',
    name: '',
    roles: [], // Asegúrate de definir esta propiedad
    permisos: [],
  });




  //const [unidadToDelete, setUnidadToDelete] = useState<null | { id: number; Name: string; AsesorFree: boolean }>(null);
  const [data, setData] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    name: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof User | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const navigate = useNavigate();
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false); // State for PersonaModal
  // Función para abrir PersonaModal
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);

  const openPersonaModal = () => setIsPersonaModalOpen(true);
  const closePersonaModal = () => setIsPersonaModalOpen(false);

  const closeModalCrear = () => {
    setIsModalCrearOpen(false);
  };

 // const handleSavePersona = (formData: FormData) => {
 //   console.log('Contenido de formData:');

    // Convertir FormData a objeto plano
 //   const personaData: any = Object.fromEntries(formData.entries());

    // Crear un objeto solo con los campos necesarios
  //  const cleanedData = {
 //     name: personaData.Nombres,
 //     telefono: personaData.Celular,
  //    direccion: personaData.Direccion,
 //     foto: formData.get('Foto'), // Aquí obtenemos el archivo directamente de formData
 //     email: personaData.Email,
  //    password: personaData.Password,
 //   };

 //   console.log('Datos de la persona antes de enviar:', cleanedData);

    // Crear una nueva instancia de FormData para enviar al servidor
 //   const newFormData = new FormData();
 //   for (const key in cleanedData) {
 //     if (cleanedData.hasOwnProperty(key)) {
        // Aquí se añade el archivo como un objeto File
  //      newFormData.append(key, cleanedData[key]);
  //    }
   // }

    // Llamar a createUsuario con el nuevo FormData
  //  createUsuario(newFormData)
  //    .then(result => {
  //      console.log('Usuario creado:', result);
   //   })
   //   .catch(error => {
   //     console.error('Error al crear usuario:', error);
   //   });

    // Cerrar el modal de persona
  //  closePersonaModal();
  //};




  const [escuelas, setEscuelas] = useState<Escuela[]>([]);
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [condicion, setCondicion] = useState<Condicion[]>([]);
  const [regimen, setRegimen] = useState<Regimen[]>([]);
  const [filial, setFilial] = useState<Filial[]>([]);

  const [filialInfo, setFilialInfo] = useState<FilialInfo | null>(null);
  const [docente, setDocente] = useState<Docente | null>(null);
  const [director, setDirector] = useState<DirectorEscuela | null>(null);
  const [misidfilial, setmisidFilial] = useState<number[]>([]);

  const [boxBActivities, setBoxBActivities] = useState<Activity[]>([]);
  const [originalBoxBActivities, setOriginalBoxBActivities] = useState<Activity[]>([]);
  const [selectedPermisosAsActivities, setSelectedPermisosAsActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  // Función para obtener datos al montar el componente
  const fetchData = async () => {
    setLoading(true); // Comienza la carga
    try {
      const data = await getInfoAdministrarUsuarios(); // Llamada a la función para obtener datos
      console.log('Datos obtenidos:', data); // Ver los datos en la consola

      // Almacena los datos en el estado
      setData(data.users);
      setOriginalBoxBActivities(data.roles);

      const updatedActivities = data.roles.map((rol) => ({
        id: rol.id,
        name: rol.name,
      }));
      setBoxBActivities(updatedActivities);

      // Almacena las otras entidades en el estado
      setEscuelas(data.escuelas);
      setCategoria(data.categorias);
      setCondicion(data.condiciones);
      setFilial(data.filiales);
      setRegimen(data.regimenes);

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




  // Obtener icono de orden
  const getSortIcon = (key: keyof User) => {
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
      // Asegurarte que formData.id es un número antes de este punto
      if (typeof formData.id !== 'number') {
        throw new Error("El ID de formData no es válido. Debe ser un número.");
      }

      const rolesToSave = selectedActivities.map((rol) => ({
        id: rol.id,
      }));

      // Agregar campos adicionales (ej. escuelaSeleccionada, docenteData)
      const additionalData = {
        escuela: escuelaSeleccionada ? { id: escuelaSeleccionada.idEscuela, name: escuelaSeleccionada.name } : null,
        docente: docenteData ? { ...docenteData } : null,
      };

      // Llamada a saveRoles con formData.id garantizado como número
      const result = await saveRoles(formData.id, rolesToSave, additionalData);

      await fetchData(); // Actualiza la lista después de guardar
      setBoxBActivities(originalBoxBActivities); // Resetea las actividades
      closeModalCrear(); // Cierra el modal
    } catch (error: any) {
      console.error('Error guardando permisos:', error.message);
    }
  };




  // Funciones para editar Users (no modificar)
  const openModal = (data: User | null = null) => {



    if (!loading) { // Solo abrir si no está cargando
      if (data) {

        setFilialInfo(data.filialInfo ?? null);
        setDocente(data.docente ?? null);
        setDirector(data.directorEscuela ?? null);
        setmisidFilial(data.filialId ?? []);

        //    console.log(data.docente);
        //    console.log(data.directorEscuela);
        //   console.log(data.filialId);
        //   console.log(data.filialInfo);

        // Modal de edición
        setFormData({
          id: data.id,
          name: data.name,
          roles: data.roles || [],
          permisos: [], // Ajusta según tu lógica
        });
      }
      setSelectedPermisosAsActivities([]); // Reiniciar permisos seleccionados
      setBoxBActivities([...originalBoxBActivities]); // Copiar permisos originales
      setIsModalOpen(true); // Abrir el modal de edición
    }
  };


  const closeModal = () => setIsModalOpen(false);


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
                //   onClick={() => sortData(key as keyof User)}
                >
                  <div className="flex items-center">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {getSortIcon(key as keyof User)}
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
                <td className="border-b border-gray-200 py-4 px-6">    {item.roles.map(role => role.name).join(', ')}
                </td>

                <td className="border-b border-gray-200 py-4 px-6">
                  <div className="flex items-center space-x-4">
                    {/* Botón Editar */}
                    <Eye
                      className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer"
                      onClick={() => openModal(item)} // Abrir modal de edición
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
          infofilial={filialInfo}
          docente={docente}
          director={director}
          miidfilial={misidfilial.map(id => ({ idFilial: id }))} // Transformar aquí

        />



      </DndProvider>

      {/*       <ModalCrear
        isOpen={isPersonaModalOpen}
        onClose={closePersonaModal}
        onSave={handleSavePersona}
      /> */}


    </div>
  );
};

export default FilteredUnidad;
