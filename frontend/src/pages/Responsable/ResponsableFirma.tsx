import React from 'react';
import { Responsable } from '../services/responsable.service'; // Asegúrate de importar correctamente la interfaz

interface FirmaModalProps {
  responsable: Responsable; // Tipo basado en la interfaz Responsable
  onClose: () => void;
}

const FirmaModal: React.FC<FirmaModalProps> = ({ responsable, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Firma Digital de {responsable.nombres} {responsable.apellidos}</h2>
        <img
          src={responsable.firmadigital}
          alt={`Firma de ${responsable.nombres} ${responsable.apellidos}`}
          className="w-full h-auto"
        />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default FirmaModal;
