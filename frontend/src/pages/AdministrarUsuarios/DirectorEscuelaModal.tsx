import React, { useState } from 'react';

interface Escuela {
  idEscuela: number;
  name: string;
}

interface DirectorEscuelaModalProps {
  escuelas: Escuela[];
  closeModal: () => void;
  handleSelectEscuela: (escuela: Escuela) => void;
  searchTermEscuela: string;
  setSearchTermEscuela: (term: string) => void;
}

const DirectorEscuelaModal: React.FC<DirectorEscuelaModalProps> = ({
  escuelas,
  closeModal,
  handleSelectEscuela,
  searchTermEscuela,
  setSearchTermEscuela,
}) => {
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState<Escuela | null>(null);

  const guardarYCerrar = () => {
    if (escuelaSeleccionada) {
      handleSelectEscuela(escuelaSeleccionada);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 relative">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
        <h3 className="text-xl font-semibold mb-4">Seleccionar Escuela</h3>
        
        <input
          type="text"
          placeholder="Buscar escuela..."
          className="border p-2 mb-4 w-full rounded"
          value={searchTermEscuela}
          onChange={(e) => setSearchTermEscuela(e.target.value)}
        />
        
        <ul className="max-h-64 overflow-y-scroll">
          {escuelas
            .filter((escuela) => escuela.name.toLowerCase().includes(searchTermEscuela.toLowerCase()))
            .map((escuela) => (
              <li
                key={escuela.idEscuela}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${escuelaSeleccionada?.idEscuela === escuela.idEscuela ? 'bg-gray-300' : ''}`}
                onClick={() => setEscuelaSeleccionada(escuela)}
              >
                {escuela.name}
              </li>
            ))}
        </ul>

        <button
          onClick={guardarYCerrar}
          disabled={!escuelaSeleccionada} // Deshabilitar botón si no hay selección
          className={`mt-4 py-2 px-4 rounded w-full ${escuelaSeleccionada ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Guardar y Cerrar
        </button>
      </div>
    </div>
  );
};

export default DirectorEscuelaModal;
