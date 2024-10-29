import React from 'react';

interface Escuela {
  idEscuela: number;
  name: string;
  idFacultad: number;
}

interface DocenteModalProps {
  escuelas: Escuela[];
  condicion: Array<{ idCondicion: number; nombreCondicion: string }>;
  regimen: Array<{ idRegimen: number; nombreRegimen: string }>;
  categoria: Array<{ idCategoria: number; nombreCategoria: string }>;
  filial: Array<{ idFilial: number; name: string }>;
  closeModal: () => void;
}

const DocenteModal: React.FC<DocenteModalProps> = ({
  escuelas,
  condicion,
  regimen,
  categoria,
  filial,
  closeModal,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 relative">
      <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
      <h3 className="text-xl font-semibold mb-4">Detalles Adicionales para Docente</h3>
      
      {/* Campo de Escuela */}
      <select className="border p-2 mb-4 w-full rounded" defaultValue="">
        <option value="" disabled>Seleccione una Escuela</option>
        {escuelas.map((escuela) => (
          <option key={escuela.idEscuela} value={escuela.idEscuela}>
            {escuela.name} 
          </option>
        ))}
      </select>

      {/* Campo de Condición */}
      <select className="border p-2 mb-4 w-full rounded" defaultValue="">
        <option value="" disabled>Seleccione una Condición</option>
        {condicion.map((cond) => (
          <option key={cond.idCondicion} value={cond.idCondicion}>
            {cond.nombreCondicion}
          </option>
        ))}
      </select>

      {/* Campo de Régimen */}
      <select className="border p-2 mb-4 w-full rounded" defaultValue="">
        <option value="" disabled>Seleccione un Régimen</option>
        {regimen.map((reg) => (
          <option key={reg.idRegimen} value={reg.idRegimen}>
            {reg.nombreRegimen}
          </option>
        ))}
      </select>

      {/* Campo de Categoría */}
      <select className="border p-2 mb-4 w-full rounded" defaultValue="">
        <option value="" disabled>Seleccione una Categoría</option>
        {categoria.map((cat) => (
          <option key={cat.idCategoria} value={cat.idCategoria}>
            {cat.nombreCategoria}
          </option>
        ))}
      </select>

      {/* Campo de Filial */}
      <select className="border p-2 mb-4 w-full rounded" defaultValue="">
        <option value="" disabled>Seleccione la sede</option>
        {filial.map((fil) => (
          <option key={fil.idFilial} value={fil.idFilial}>
            {fil.name}
          </option>
        ))}
      </select>

      <button onClick={closeModal} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full">
        Guardar y Cerrar
      </button>
    </div>
  </div>
);

export default DocenteModal;
