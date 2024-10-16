// src/components/CreateActivity.tsx

import { useState } from 'react';
import { FaSearch, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para la navegación

interface Package {
  id: number;
  requisito: string;
  validacion: string;
  status: string;
}

const tesisData: Package[] = [
  { id: 1, requisito: 'Solicitud', validacion: 'Sin validación', status: 'Activo' },
  { id: 2, requisito: 'Documentación', validacion: 'Pendiente', status: 'Activo' },
  { id: 3, requisito: 'Revisión de anteproyecto', validacion: 'Aprobado', status: 'Activo' },
  { id: 4, requisito: 'Entrega de primer borrador', validacion: 'Pendiente', status: 'Pendiente' },
  { id: 5, requisito: 'Revisión final', validacion: 'Aprobado', status: 'Activo' },
  { id: 6, requisito: 'Pago de derechos', validacion: 'Sin validación', status: 'Pendiente' },
  { id: 7, requisito: 'Asignación de asesor', validacion: 'Completado', status: 'Activo' },
  { id: 8, requisito: 'Defensa propuesta', validacion: 'Pendiente', status: 'Pendiente' },
  { id: 9, requisito: 'Corrección anteproyecto', validacion: 'Pendiente', status: 'Pendiente' },
  { id: 10, requisito: 'Entrega documento final', validacion: 'Aprobado', status: 'Activo' },
];

const desarrolloData: Package[] = [
  { id: 1, requisito: 'Código fuente', validacion: 'Revisión', status: 'Pendiente' },
  { id: 2, requisito: 'Pruebas unitarias', validacion: 'Completado', status: 'Activo' },
  { id: 3, requisito: 'Revisión de código', validacion: 'Pendiente', status: 'Pendiente' },
  { id: 4, requisito: 'Pruebas de integración', validacion: 'Aprobado', status: 'Activo' },
  { id: 5, requisito: 'Despliegue en ambiente de pruebas', validacion: 'Pendiente', status: 'Pendiente' },
];

const sustentacionData: Package[] = [
  { id: 1, requisito: 'Presentación', validacion: 'Pendiente', status: 'Activo' },
  { id: 2, requisito: 'Defensa oral', validacion: 'Aprobado', status: 'Activo' },
  { id: 3, requisito: 'Entrega de informe de sustentación', validacion: 'Pendiente', status: 'Pendiente' },
  { id: 4, requisito: 'Revisión de observaciones', validacion: 'Aprobado', status: 'Activo' },
  { id: 5, requisito: 'Entrega final de tesis', validacion: 'Pendiente', status: 'Pendiente' },
];

const CreateActivity = () => {
  const [selectedCategory, setSelectedCategory] = useState('Proyecto de tesis');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<Package[]>(tesisData);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hiddenRows, setHiddenRows] = useState<Set<number>>(new Set());
  const navigate = useNavigate();  // Instancia de useNavigate

  const getDataForCategory = () => {
    switch (selectedCategory) {
      case 'Desarrollo':
        return desarrolloData;
      case 'Sustentacion':
        return sustentacionData;
      default:
        return tesisData;
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setShowModal(true);
    setHiddenRows((prev) => new Set(prev).add(id)); // Oculta la fila seleccionada
  };

  const confirmDelete = () => {
    if (selectedId !== null) {
      const updatedData = data.filter((item) => item.id !== selectedId);
      setData(updatedData);
      setHiddenRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedId);
        return newSet;
      });
    }
    setShowModal(false);
    setSelectedId(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedId(null);
    setHiddenRows((prev) => {
      const newSet = new Set(prev);
      if (selectedId !== null) newSet.delete(selectedId);
      return newSet;
    });
  };

  const filteredData = getDataForCategory().filter(
    (item) => item.requisito.toLowerCase().includes(searchTerm.toLowerCase()) && !hiddenRows.has(item.id)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-primary animate-pulse">Lista flujo - requisitos</h2>

      {/* Select para elegir la categoría y botón Agregar */}
      <div className="w-full max-w-full flex justify-between items-center mb-6">
        <div className="w-1/3">
          <label className="block mb-2 font-medium text-gray-700">Seleccionar Flujo:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded p-4 w-full dark:bg-boxdark dark:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Proyecto de tesis">Proyecto de tesis</option>
            <option value="Desarrollo">Desarrollo</option>
            <option value="Sustentacion">Sustentacion</option>
          </select>
        </div>

        {/* Botón Agregar */}
        <button
          onClick={() => navigate('/activity')}
          className="ml-4 bg-primary text-white px-6 py-3 rounded shadow hover:bg-primary-dark transition duration-200"
        >
          Agregar
        </button>
      </div>

      {/* Tabla de actividades */}
      <div className="w-full max-w-full rounded-lg shadow-lg bg-white p-6 dark:bg-boxdark">
        {/* Input de búsqueda dentro de la tabla */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Buscar requisito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 dark:bg-gray-800 dark:text-white"
          />
          <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-primary text-left text-white">
                <th           className="py-4 px-6 font-medium">ID</th>
                <th className="py-4 px-6 font-medium">Requisito</th>
                <th className="py-4 px-6 font-medium">Validación</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="border-b border-gray-200 py-4 px-6">{item.id}</td>
                  <td className="border-b border-gray-200 py-4 px-6">
                    <h5 className="font-medium text-gray-700 dark:text-white">{item.requisito}</h5>
                  </td>
                  <td className="border-b border-gray-200 py-4 px-6">
                    <p className="text-gray-600 dark:text-white">{item.validacion}</p>
                  </td>
                  <td className="border-b border-gray-200 py-4 px-6">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        item.status === 'Activo'
                          ? 'bg-success text-success'
                          : item.status === 'Pendiente'
                          ? 'bg-warning text-warning'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {item.status}
                    </p>
                  </td>
                  <td className="border-b border-gray-200 py-4 px-6">
                    <div className="flex items-center space-x-3.5">
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors duration-150"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">¿Seguro que deseas eliminar este requisito del flujo?</h3>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={confirmDelete}
              >
                Aceptar
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateActivity;

