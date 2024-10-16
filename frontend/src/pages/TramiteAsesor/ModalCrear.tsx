import React, { useRef } from 'react';

interface ModalCrearProps {
  isModalCrearOpen: boolean;
  closeModalCrear: () => void;
  modalType: number;
  formData: {
    id: number | '';
    name: string;
    guard_name: string;
    permisos: any[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    id: number | '';
    name: string;
    guard_name: string;
    permisos: any[];
  }>>;
  handleSubmit: () => void;
}

const ModalCrear: React.FC<ModalCrearProps> = ({ isModalCrearOpen, closeModalCrear, formData, setFormData, handleSubmit }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !(modalRef.current as any).contains(e.target)) {
      closeModalCrear();
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    isModalCrearOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleClickOutside}
      >
        <div ref={modalRef} className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h2 className="text-lg font-semibold mb-4">Crear Rol</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Rol</label>
              <input
                type="text"
                value={formData.name || ''} // Controlado
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Guard Name</label>
              <input
                type="text"
                value={formData.guard_name || ''} // Controlado
                onChange={(e) => setFormData({ ...formData, guard_name: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={closeModalCrear}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSubmit}
              >Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ModalCrear;
