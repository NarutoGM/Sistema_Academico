import React, { useRef } from 'react';

const ModalUnidad = ({ isModalOpen, closeModal, modalType, formData, setFormData, handleSubmit }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  return (
    isModalOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleClickOutside}
      >
        <div ref={modalRef} className="bg-white p-6 ml-70 rounded shadow-lg max-w-md w-full">
          <h2 className="text-lg font-semibold mb-4">
            {modalType === 1 ? 'Crear Especialidad' : 'Editar Especialidad'}
          </h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Especialidad</label>
              <input
                type="text"
                value={formData.Descripcion}
                onChange={(e) => setFormData({ ...formData, Descripcion: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {modalType === 2 && (
              <div className="mb-4">
                <label className="block text-gray-700">AsesorFree</label>
                <select
                  value={formData.AsesorFree}
                  onChange={(e) => setFormData({ ...formData, AsesorFree: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccione AsesorFree</option>
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