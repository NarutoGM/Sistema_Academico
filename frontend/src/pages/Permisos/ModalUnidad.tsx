import React, { useRef } from 'react';

interface ModalUnidadProps {
  isModalOpen: boolean;
  closeModal: () => void;
  modalType: 1 | 2 | null;
  formData: {
    id: number | '';
    descripcion: string;
    estado: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    id: number | '';
    descripcion: string;
    estado: boolean;
  }>>;
  handleSubmit: () => void;
}

const ModalUnidad: React.FC<ModalUnidadProps> = ({ isModalOpen, closeModal, modalType, formData, setFormData, handleSubmit }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  return (
    isModalOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleClickOutside}
        aria-modal="true"
        role="dialog"
      >
        <div ref={modalRef} className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h2 className="text-lg font-semibold mb-4">
            {modalType === 1 ? 'Crear Permiso' : 'Editar Permiso'}
          </h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Descripción</label>
              <input
                type="text"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {modalType === 2 && (
              <div className="mb-4">
                <label className="block text-gray-700">Estado</label>
                <select
                  value={formData.estado ? '1' : '0'}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value === '1' })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccione Estado</option>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSubmit}
              >
                {modalType === 1 ? 'Crear' : 'Actualizar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ModalUnidad;
