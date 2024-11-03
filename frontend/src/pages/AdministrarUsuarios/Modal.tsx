import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop, DragSourceMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DocenteModal from './DocenteModal';
import DirectorEscuelaModal from './DirectorEscuelaModal';
import {  User,Escuela, Docente, DirectorEscuela,FilialInfo, Categoria,Condicion,Regimen,Filial, Rol } from "@/pages/services/rolesyusuarios.services";

interface Activity {
  id: number;
  name: string;
}



interface ModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  originalBoxBActivities: Activity[];
  handleSave: (selectedActivities: Activity[], escuelaSeleccionada: Escuela | null, docenteData: any) => void;
  initialFormData: any;
  escuelas: Escuela[];
  condicion: Array<{ idCondicion: number; nombreCondicion: string }>;
  regimen: Array<{ idRegimen: number; nombreRegimen: string }>;
  categoria: Array<{ idCategoria: number; nombreCategoria: string }>;
  filial: Array<{ idFilial: number; name: string }>;
  docente: Docente | null; // Permitir null
  director: DirectorEscuela | null;
  miidfilial: Array<{ idFilial: number }>;
  infofilial: FilialInfo | null;

}

const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  closeModal,
  originalBoxBActivities = [],
  handleSave,
  initialFormData,
  escuelas,
  condicion,
  regimen,
  categoria,
  filial,
  docente,
  director: initialDirector,
  miidfilial,
  infofilial,
}) => {
  const [tempDirector, setTempDirector] = useState<DirectorEscuela | null>(initialDirector);
  const [tempFormData, setTempFormData] = useState(initialFormData);
  const [selectedPermisosAsActivities, setSelectedPermisosAsActivities] = useState<Activity[]>([]);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
  const [searchTermMain, setSearchTermMain] = useState<string>('');
  const [searchTermEscuela, setSearchTermEscuela] = useState<string>('');
  const [searchTermDocente, setSearchTermDocente] = useState<string>('');
  const [isBuscarEscuelaModalOpen, setIsBuscarEscuelaModalOpen] = useState(false);
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState<null | Escuela>(null);
  const [currentRole, setCurrentRole] = useState<string>('');
  const [docenteData, setDocenteData] = useState<any>(null);


  
  useEffect(() => {
    if (isModalOpen) {
      setTempFormData(initialFormData);
      setTempDirector(initialDirector);
      console.log(initialDirector);

      if (initialDirector) {
        setEscuelaSeleccionada({
          idEscuela: initialDirector.idEscuela,
          name: '',
        });
      }
      console.log(miidfilial); // Verifica que miidfilial esté en el formato correcto
      const transformedFiliales = { idFilial: miidfilial.map(filial => filial.idFilial) };

      setDocenteData({
        escuela: docente?.idEscuela || '',
        condicion: infofilial?.idCondicion || '',
        regimen: infofilial?.idRegimen || '',
        categoria: infofilial?.idCategoria || '',
        filiales: transformedFiliales // Se asegura de usar miidfilial o un array vacío
      });

      console.log(docenteData); // Verifica que miidfilial esté en el formato correcto
      {docenteData && (
        <p className="mt-2 text-gray-700">Docente: {JSON.stringify(docenteData)}</p>
      )}

   //   console.log("Datos enviados a DocenteModal:", {
  //      escuela: initialDirector.idEscuela,
  //      condicion: infofilial.idCondicion,
  //      regimen: infofilial.idRegimen,
 //       categoria: infofilial.idCategoria,
 //       filiales: miidfilial.map(String),
//      });

      setSearchTermMain('');

      const selected = (initialFormData.roles || []).map((rol: any) => ({
        id: rol.id,
        name: rol.name,
      }));
      setSelectedPermisosAsActivities(selected);

const available = originalBoxBActivities.filter(
  (activity) => !selected.some((sel: { id: number; name: string }) => sel.id === activity.id)
);
      setAvailableActivities(available);
    }
  }, [isModalOpen, initialFormData, originalBoxBActivities, initialDirector, infofilial, miidfilial]);

  const handleSaveClick = () => {
    // Guardamos los datos actuales en `docenteData` antes de cerrar
    handleSave(selectedPermisosAsActivities, escuelaSeleccionada, docenteData);
  //  console.log("Datos guardados del docente:", docenteData);
    closeModal();
  };

  const handleMoveToSelected = (activity: Activity) => {
    setSelectedPermisosAsActivities((prev) => [...prev, activity]);
    setAvailableActivities((prev) => prev.filter((item) => item.id !== activity.id));
  };

  const handleMoveToAvailable = (activity: Activity) => {
    setAvailableActivities((prev) => [...prev, activity]);
    setSelectedPermisosAsActivities((prev) => prev.filter((item) => item.id !== activity.id));
  };

  if (!isModalOpen) return null;

  const handleSelectEscuela = (escuela: Escuela) => {
    setEscuelaSeleccionada(escuela);
    setTempDirector({
      ...tempDirector,
      idEscuela: escuela.idEscuela,
      idDirector: tempDirector?.idDirector ?? 0, // Default to 0 if null or undefined
    });
  };

  const closeModalBuscarEscuela = () => {
    setIsBuscarEscuelaModalOpen(false);
    setSearchTermEscuela('');
  };

  const DraggableActivity: React.FC<{
    activity: Activity;
    moveActivity: (activity: Activity) => void;
    showRemoveButton?: boolean;
  }> = ({ activity, moveActivity, showRemoveButton = false }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'activity',
      item: { ...activity },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const canAssignEscuela = ['Docente', 'Director de Escuela'].includes(activity.name);

    return (
      <div
        ref={drag}
        className={`p-2 border rounded flex items-center mb-2 ${isDragging ? 'opacity-50' : 'opacity-100'} bg-blue-500`}
      >
        <span className='text-md text-white'>{activity.name}</span>
        {showRemoveButton && canAssignEscuela && (
          <button
            onClick={() => {
              setCurrentRole(activity.name);
              setIsBuscarEscuelaModalOpen(true);
            }}
            className="ml-auto bg-green-500 text-white hover:bg-green-600 py-1 px-4 rounded"
          >
            Asignar información
          </button>
        )}
      </div>
    );
  };

  const DroppableArea: React.FC<{
    children: React.ReactNode;
    moveActivity: (activity: Activity) => void;
    areaType: 'selected' | 'available';
  }> = ({ children, moveActivity, areaType }) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'activity',
      drop: (item: Activity) => {
        if (areaType === 'selected' && !selectedPermisosAsActivities.some((activity) => activity.id === item.id)) {
          moveActivity(item);
        } else if (areaType === 'available' && !availableActivities.some((activity) => activity.id === item.id)) {
          moveActivity(item);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        className={`border ${isOver ? 'bg-gray-100' : 'bg-white'} p-4 rounded-lg w-full md:w-1/2`}
      >
        {children}
      </div>
    );
  };

  const filteredAvailableActivities = availableActivities.filter((activity) =>
    activity.name.toLowerCase().includes(searchTermMain.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-6">Administrar Roles</h3>
        <h4 className="text-lg font-medium mb-3">{tempFormData.name || 'Nombre no disponible'}</h4>

        <input
          type="text"
          placeholder="Buscar roles disponibles..."
          className="mb-4 border p-2 rounded w-full"
          value={searchTermMain}
          onChange={(e) => setSearchTermMain(e.target.value || '')}
        />

        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
            <DroppableArea areaType="selected" moveActivity={handleMoveToSelected}>
              {selectedPermisosAsActivities.length === 0 && (
                <p className="text-red-500">No hay roles seleccionados.</p>
              )}
              <div className="max-h-64 overflow-y-scroll">
                {selectedPermisosAsActivities.map((activity) => (
                  <DraggableActivity
                    key={`selected-${activity.id}`}
                    activity={activity}
                    moveActivity={handleMoveToAvailable}
                    showRemoveButton={true}
                  />
                ))}
              </div>
            </DroppableArea>

            <DroppableArea areaType="available" moveActivity={handleMoveToAvailable}>
              <h4 className="text-lg font-medium mb-3">Roles disponibles</h4>
              {filteredAvailableActivities.length === 0 && (
                <p className="text-red-500">No hay roles disponibles.</p>
              )}
              <div className="max-h-64 overflow-y-scroll">
                {filteredAvailableActivities.map((activity) => (
                  <DraggableActivity
                    key={`available-${activity.id}`}
                    activity={activity}
                    moveActivity={handleMoveToSelected}
                  />
                ))}
              </div>
            </DroppableArea>
          </div>
        </DndProvider>

        
        
  
  <p className="mt-2 text-gray-700">
    {escuelaSeleccionada ? (
      <>DirectorEscuela // id Escuela: (ID: {escuelaSeleccionada.idEscuela})</>
    ) : (
      <>DirectorEscuela: Información no disponible</>
    )}
  </p>

  {docenteData && (
    <p className="mt-2 text-gray-700">Docente: {JSON.stringify(docenteData)}</p>
  )}
  



        <button
          onClick={handleSaveClick}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Guardar Cambios
        </button>

        {isBuscarEscuelaModalOpen && currentRole === 'Director de Escuela' && (
          <DirectorEscuelaModal
            escuelas={escuelas}
            director={tempDirector}
            closeModal={closeModalBuscarEscuela}
            handleSelectEscuela={handleSelectEscuela}
            searchTermEscuela={searchTermEscuela}
            setSearchTermEscuela={setSearchTermEscuela}
          />
        )}

        {isBuscarEscuelaModalOpen && currentRole === 'Docente' && (
          <DocenteModal
            escuelas={escuelas}
            docenteData={docenteData} // Paso directo de docenteData
            condicion={condicion}
            regimen={regimen}
            categoria={categoria}
            filial={filial}
            closeModal={closeModalBuscarEscuela}
            handleSaveDocenteData={(data) => {
              setDocenteData(data);
          //    console.log('Datos del docente:', data);
            }}
            searchTermDocente={searchTermDocente}
            setSearchTermDocente={setSearchTermDocente}
          />

        )}
      </div>
    </div>
  );
};

export default Modal;
