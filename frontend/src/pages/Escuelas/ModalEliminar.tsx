// src/components/DeleteConfirmationModal.tsx
import React from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Confirmación de Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar esta escuela? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
