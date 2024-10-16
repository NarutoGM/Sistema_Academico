// ConfirmationModal.tsx
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">¿Estás seguro de que deseas eliminar este responsable?</h2>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">
            Cancelar
          </button>
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
