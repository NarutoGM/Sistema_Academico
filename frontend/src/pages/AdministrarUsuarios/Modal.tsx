import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop, DragSourceMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Activity {
  id: number;
  name: string;
}

interface Escuela {
  idEscuela: number;
  name: string;
  idFacultad: number;
}

interface ModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  originalBoxBActivities: Activity[];
  handleSave: (selectedActivities: Activity[]) => void;
  initialFormData: any;
  escuelas: Escuela[];
  condicion: Array<{ idCondicion: number; nombreCondicion: string }>;
  regimen: Array<{ idRegimen: number; nombreRegimen: string }>;
  categoria: Array<{ idCategoria: number; nombreCategoria: string }>;
  filial: Array<{ idFilial: number; name: string }>;

}


const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  closeModal,
  originalBoxBActivities = [],
  handleSave,
  initialFormData,
  escuelas,
  condicion, // Agrega este prop
  regimen, // Agrega este prop
  categoria, // Agrega este prop
  filial, // Agrega este prop
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedPermisosAsActivities, setSelectedPermisosAsActivities] = useState<Activity[]>([]);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
  const [searchTermMain, setSearchTermMain] = useState<string>('');
  const [isBuscarEscuelaModalOpen, setIsBuscarEscuelaModalOpen] = useState(false);
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState<null | Escuela>(null);
  const [searchTermEscuela, setSearchTermEscuela] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<string>('');

  useEffect(() => {
    if (isModalOpen) {
      setFormData(initialFormData);
      setSearchTermMain('');

      const selected = (initialFormData.roles || []).map((rol: any) => ({
        id: rol.id,
        name: rol.name,
      }));
      setSelectedPermisosAsActivities(selected);

      const available = originalBoxBActivities.filter(
        (activity) => !selected.some((sel) => sel.id === activity.id)
      );
      setAvailableActivities(available);
    }
  }, [isModalOpen, initialFormData, originalBoxBActivities]);

  const handleMoveToSelected = (activity: Activity) => {
    setSelectedPermisosAsActivities((prev) => [...prev, activity]);
    setAvailableActivities((prev) => prev.filter((item) => item.id !== activity.id));
  };

  const handleMoveToAvailable = (activity: Activity) => {
    setAvailableActivities((prev) => [...prev, activity]);
    setSelectedPermisosAsActivities((prev) =>
      prev.filter((item) => item.id !== activity.id)
    );
  };

  if (!isModalOpen) return null;

  const handleSaveClick = () => {
    handleSave(selectedPermisosAsActivities);
    closeModal();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const filteredAvailableActivities = availableActivities.filter((activity) =>
    activity.name.toLowerCase().includes(searchTermMain.toLowerCase())
  );

  const DraggableActivity: React.FC<{ activity: Activity; moveActivity: (activity: Activity) => void; showRemoveButton?: boolean }> = ({
    activity,
    moveActivity,
    showRemoveButton = false,
  }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'activity',
      item: { ...activity },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const canAssignEscuela = ['Docente', 'Director de escuela'].includes(activity.name);

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
            Asignar Escuela
          </button>
        )}
      </div>
    );
  };

  const DroppableArea: React.FC<{ children: React.ReactNode; moveActivity: (activity: Activity) => void; areaType: 'selected' | 'available' }> = ({ children, moveActivity, areaType }) => {
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

  const handleSelectEscuela = (escuela: Escuela) => {
    setEscuelaSeleccionada(escuela);
  };

  const closeModalBuscarEscuela = () => {
    setIsBuscarEscuelaModalOpen(false);
    setSearchTermEscuela('');
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-6">Administrar Roles</h3>
        <h4 className="text-lg font-medium mb-3">{formData.name || 'Nombre no disponible'}</h4>

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

        {escuelaSeleccionada && (
          <p className="mt-2 text-gray-700">Escuela seleccionada: {escuelaSeleccionada.name}</p>
        )}

        <button
          onClick={handleSaveClick}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Guardar Cambios
        </button>

        {isBuscarEscuelaModalOpen && currentRole === 'Director de escuela' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 relative">
              <button
                onClick={closeModalBuscarEscuela}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h3 className="text-xl font-semibold mb-4">Seleccionar Escuela</h3>

              <input
                type="text"
                placeholder="Buscar escuela..."
                className="border p-2 mb-4 w-full rounded"
                value={searchTermEscuela}
                onChange={(e) => setSearchTermEscuela(e.target.value || '')}
              />

              <ul className="max-h-64 overflow-y-scroll">
                {escuelas
                  .filter((escuela) => escuela.name.toLowerCase().includes(searchTermEscuela.toLowerCase()))
                  .map((escuela) => (
                    <li
                      key={escuela.idEscuela}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSelectEscuela(escuela)}
                    >
                      {escuela.name}
                    </li>
                  ))}
              </ul>

              <button
                onClick={closeModalBuscarEscuela}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Guardar y Cerrar
              </button>
            </div>
          </div>
        )}

        {isBuscarEscuelaModalOpen && currentRole === 'Docente' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 relative">
              <button
                onClick={() => setIsBuscarEscuelaModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h3 className="text-xl font-semibold mb-4">Detalles Adicionales para Docente</h3>

              {/* Campo de Escuela */}
              <select className="border p-2 mb-4 w-full rounded" defaultValue="">
                <option value="" disabled>Seleccione una Escuela</option>
                {escuelas.map((escuela) => (
                  <option key={escuela.idEscuela} value={escuela.idEscuela}>
                    {escuela.name} - {escuela.facultad.nomFacultad}
                  </option>
                ))}
              </select>

              {/* Campo de Condición */}
              <select className="border p-2 mb-4 w-full rounded" defaultValue="">
                <option value="" disabled>Seleccione una Condición</option>
                {condicion.map((cond) => (
                  <option key={cond.idCondicion} value={cond.idCondicion}>
                    {cond.nombreCondicion}
                  </option>
                ))}
              </select>

              {/* Campo de Régimen */}
              <select className="border p-2 mb-4 w-full rounded" defaultValue="">
                <option value="" disabled>Seleccione un Régimen</option>
                {regimen.map((reg) => (
                  <option key={reg.idRegimen} value={reg.idRegimen}>
                    {reg.nombreRegimen}
                  </option>
                ))}
              </select>

              {/* Campo de Categoría */}
              <select className="border p-2 mb-4 w-full rounded" defaultValue="">
                <option value="" disabled>Seleccione una Categoría</option>
                {categoria.map((cat) => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombreCategoria}
                  </option>
                ))}
              </select>

              {/* Campo de Filial */}
              <select className="border p-2 mb-4 w-full rounded" defaultValue="">
                <option value="" disabled>Seleccione la sede</option>
                {filial.map((cat) => (
                  <option key={cat.idFilial} value={cat.idFilial}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsBuscarEscuelaModalOpen(false)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Guardar y Cerrar
              </button>
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default Modal;