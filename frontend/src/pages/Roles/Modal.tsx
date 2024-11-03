import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop, DragSourceMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Activity {
  id: number;
  descripcion: string;
}

interface ModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  originalBoxBActivities: Activity[];
  handleSave: (selectedActivities: Activity[]) => void;
  initialFormData: any;
}

const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  closeModal,
  originalBoxBActivities = [],
  handleSave,
  initialFormData,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [selectedPermisosAsActivities, setSelectedPermisosAsActivities] =
    useState<Activity[]>([]);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda

  useEffect(() => {
    if (isModalOpen) {
      setFormData(initialFormData);
      setSearchTerm(''); // Resetear el término de búsqueda a vacío al abrir el modal

      // Inicializar permisos seleccionados desde initialFormData
      const selected = (initialFormData.permisos || []).map((permiso: any) => ({
        id: permiso.id,
        descripcion: permiso.descripcion,
      }));
      setSelectedPermisosAsActivities(selected);

      // Inicializar actividades disponibles filtrando las seleccionadas
      const available = originalBoxBActivities.filter(
        (activity) => !selected.some((sel: Activity) => sel.id === activity.id),
      );
      setAvailableActivities(available);
    }
  }, [isModalOpen, initialFormData, originalBoxBActivities]);

  const handleMoveToSelected = (activity: Activity) => {
    setSelectedPermisosAsActivities((prev) => [...prev, activity]);
    setAvailableActivities((prev) =>
      prev.filter((item) => item.id !== activity.id),
    );
  };

  const handleMoveToAvailable = (activity: Activity) => {
    setAvailableActivities((prev) => [...prev, activity]);
    setSelectedPermisosAsActivities((prev) =>
      prev.filter((item) => item.id !== activity.id),
    );
  };

  if (!isModalOpen) return null;

  const handleSaveClick = () => {
    handleSave(selectedPermisosAsActivities);
    closeModal();
  };

  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Filtrar las actividades disponibles según el término de búsqueda
  const filteredAvailableActivities = availableActivities.filter((activity) =>
    activity.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Componente para actividades arrastrables
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

    return (
      <div
        ref={drag}
        className={`p-2 border rounded flex items-center mb-2 ${isDragging ? 'opacity-50' : 'opacity-100'} bg-blue-500`}
      >
        <span className="text-md text-white">{activity.descripcion}</span>
        {showRemoveButton && (
          <button
            onClick={() => moveActivity(activity)}
            className="ml-auto bg-green-500 text-white hover:bg-green-600 py-1 px-4 rounded"
          >
            Mover
          </button>
        )}
      </div>
    );
  };

  // Componente para áreas de soltado
  const DroppableArea: React.FC<{
    children: React.ReactNode;
    moveActivity: (activity: Activity) => void;
    areaType: 'selected' | 'available';
  }> = ({ children, moveActivity, areaType }) => {
    const [{ isOver }, drop] = useDrop({
      accept: 'activity',
      drop: (item: Activity) => {
        if (
          areaType === 'selected' &&
          !selectedPermisosAsActivities.some(
            (activity) => activity.id === item.id,
          )
        ) {
          moveActivity(item);
        } else if (
          areaType === 'available' &&
          !availableActivities.some((activity) => activity.id === item.id)
        ) {
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

        <h3 className="text-xl font-semibold mb-6">Administrar Permisos</h3>
        <h4 className="text-lg font-medium mb-3">
          {formData.name || 'Nombre no disponible'}
        </h4>

        {/* Campo de búsqueda */}
        <input
          type="text"
          placeholder="Buscar permisos disponibles..."
          className="mb-4 border p-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* BoxA: Permisos seleccionados */}
            <DroppableArea
              areaType="selected"
              moveActivity={handleMoveToSelected}
            >
              {selectedPermisosAsActivities.length === 0 && (
                <p className="text-red-500">No hay permisos seleccionados.</p>
              )}

              {/* Aquí añadimos el contenedor desplazable */}
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

            {/* BoxB: Permisos disponibles */}
            <DroppableArea
              areaType="available"
              moveActivity={handleMoveToAvailable}
            >
              <h4 className="text-lg font-medium mb-3">Permisos disponibles</h4>
              {filteredAvailableActivities.length === 0 && (
                <p className="text-red-500">No hay permisos disponibles.</p>
              )}

              {/* Aquí añadimos el contenedor desplazable */}
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

        <button
          onClick={handleSaveClick}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default Modal;
