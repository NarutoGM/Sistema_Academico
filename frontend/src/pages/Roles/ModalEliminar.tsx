interface ModalEliminarProps {
  isDeleteModalOpen: boolean;
  closeDeleteModal: () => void;
  handleDelete: () => void;
}

const ModalEliminar: React.FC<ModalEliminarProps> = ({
  isDeleteModalOpen,
  closeDeleteModal,
  handleDelete,
}) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeDeleteModal();
    }
  };

  return (
    isDeleteModalOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleBackgroundClick}
      >
        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h2 className="text-lg font-semibold mb-4">Confirmar Eliminación</h2>
          <p>¿Estás seguro de que deseas eliminar este rol?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={closeDeleteModal}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleDelete}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ModalEliminar;
