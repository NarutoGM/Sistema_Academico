import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type Activity = {
  id: number;
  name: string;
};

type DraggableActivityProps = {
  activity: Activity;
  moveActivity: (activity: Activity, toBox: string) => void;
  removeActivity: (activity: Activity) => void;
  boxName: string;
};

const ITEM_TYPE = 'ACTIVITY';

const DraggableActivity: React.FC<DraggableActivityProps> = ({
  activity,
  moveActivity,
  removeActivity,
  boxName,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { activity, boxName },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`relative flex w-full border-l-6 px-7 py-8 shadow-md rounded-lg cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{
        backgroundColor: boxName === 'BoxA' ? '#34D3991F' : '#F871711F',
        borderColor: boxName === 'BoxA' ? '#34D399' : '#F87171',
        flexDirection: boxName === 'BoxA' && isDragging ? 'row' : 'column',
      }}
    >
      {boxName === 'BoxA' && (
        <button
          onClick={() => removeActivity(activity)}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 flex items-center justify-center"
        >
          -
        </button>
      )}
      <div className="flex">
        <div
          className={`mr-5 flex h-9 w-9 items-center justify-center rounded-lg ${
            boxName === 'BoxA' ? 'bg-[#34D399]' : 'bg-[#F87171]'
          }`}
        >
          <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 0L16 12H0L8 0Z"
              fill="white"
              stroke="white"
            />
          </svg>
        </div>
        <div className="w-full">
          <h5 className={`text-lg font-semibold ${boxName === 'BoxA' ? 'text-black' : 'text-[#B45454]'}`}>
            {activity.name}
          </h5>
        </div>
      </div>
    </div>
  );
};

type DroppableAreaProps = {
  children: React.ReactNode;
  moveActivity: (activity: Activity, toBox: string) => void;
  removeActivity: (activity: Activity) => void;
  boxName: string;
  setBoxBActivities?: React.Dispatch<React.SetStateAction<Activity[]>>;
  originalBoxBActivities?: Activity[];
  isBoxAFull?: boolean;
};

const DroppableArea: React.FC<DroppableAreaProps> = ({
  children,
  moveActivity,
  removeActivity,
  boxName,
  setBoxBActivities,
  originalBoxBActivities,
  isBoxAFull,
}) => {
  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { activity: Activity; boxName: string }) => {
      if (item.boxName === 'BoxB' && boxName === 'BoxA') {
        moveActivity(item.activity, boxName);
      }
    },
  }));

  return (
    <div
      ref={drop}
      className={`flex flex-col gap-7.5 p-4 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
        isBoxAFull ? 'w-full grid grid-cols-2' : 'w-1/2 flex'
      }`}
      style={{
        minHeight: '80vh',
        margin: '10px',
      }}
    >
      {boxName === 'BoxB' && setBoxBActivities && originalBoxBActivities && (
        <input
          type="text"
          placeholder="Buscar actividades..."
          className="mb-4 p-2 border border-stroke rounded"
          onChange={(e) => {
            const searchValue = e.target.value.toLowerCase();
            const filteredActivities = originalBoxBActivities.filter(activity =>
              activity.name.toLowerCase().includes(searchValue)
            );
            setBoxBActivities(filteredActivities);
          }}
        />
      )}
      {children}
    </div>
  );
};

const FlujoActividades: React.FC = () => {
  const originalBoxBActivities: Activity[] = [
    { id: 1, name: 'Presentar ejemplar' },
    { id: 2, name: 'Solicitud' },
    { id: 3, name: 'Asignar jurads' },
    { id: 4, name: 'Actividad 4' },
  ];

  const [boxAActivities, setBoxAActivities] = useState<Activity[]>([]);
  const [boxBActivities, setBoxBActivities] = useState<Activity[]>(originalBoxBActivities);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const moveActivity = (activity: Activity, toBox: string) => {
    if (toBox === 'BoxA') {
      setBoxBActivities((prevActivities) => prevActivities.filter(a => a.id !== activity.id));
      setBoxAActivities((prevActivities) => [...prevActivities, activity]);
    }
  };

  const removeActivity = (activity: Activity) => {
    setBoxAActivities((prevActivities) => prevActivities.filter(a => a.id !== activity.id));
    setBoxBActivities((prevActivities) => {
      if (!prevActivities.some(a => a.id === activity.id)) {
        return [...prevActivities, activity];
      }
      return prevActivities;
    });
  };

  const handleSave = () => {
    setConfirmationMessage('Actividades agregadas correctamente.');
    setTimeout(() => {
      setConfirmationMessage(null);
    }, 3000);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
        <DroppableArea
          moveActivity={moveActivity}
          removeActivity={removeActivity}
          boxName="BoxA"
          isBoxAFull={boxAActivities.length > 5}
        >
          <h3 className="text-lg font-semibold mb-3">Flujo proyecto de tesis</h3>
          {boxAActivities.map((activity) => (
            <DraggableActivity
              key={activity.id}
              activity={activity}
              moveActivity={moveActivity}
              removeActivity={removeActivity}
              boxName="BoxA"
            />
          ))}
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700"
          >
            Guardar
          </button>
          {confirmationMessage && (
            <div className="mt-4 text-green-600 font-semibold">
              {confirmationMessage}
            </div>
          )}
        </DroppableArea>

        <DroppableArea
          moveActivity={moveActivity}
          removeActivity={removeActivity}
          boxName="BoxB"
          setBoxBActivities={setBoxBActivities}
          originalBoxBActivities={originalBoxBActivities}
        >
          <h3 className="text-lg font-semibold mb-3">Lista de actividades</h3>
          {boxBActivities.map((activity) => (
            <DraggableActivity
              key={activity.id}
              activity={activity}
              moveActivity={moveActivity}
              removeActivity={removeActivity}
              boxName="BoxB"
            />
          ))}
        </DroppableArea>
      </div>
    </DndProvider>
  );
};

export default FlujoActividades;
