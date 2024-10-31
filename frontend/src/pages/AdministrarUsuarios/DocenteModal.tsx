import React, { useState, useEffect } from 'react';

interface Escuela {
  idEscuela: number;
  name: string;
  idFacultad: number;
}

interface DocenteModalProps {
  escuelas: Escuela[];
  docente: { idDocente: number; id: number; idEscuela: number };
  miidfilial: number[]; // Array de IDs de filiales
  infofilial: { idRegimen: number; idCategoria: number; idCondicion: number };
  condicion: Array<{ idCondicion: number; nombreCondicion: string }>;
  regimen: Array<{ idRegimen: number; nombreRegimen: string }>;
  categoria: Array<{ idCategoria: number; nombreCategoria: string }>;
  filial: Array<{ idFilial: number; name: string }>;
  closeModal: () => void;
  handleSaveDocenteData: (data: any) => void;
}

const DocenteModal: React.FC<DocenteModalProps> = ({
  escuelas,
  docente,
  miidfilial,
  infofilial,
  condicion,
  regimen,
  categoria,
  filial,
  closeModal,
  handleSaveDocenteData,
}) => {
  // Estado inicial usando valores de las props
  const [selectedEscuela, setSelectedEscuela] = useState<string>(docente.idEscuela.toString());
  const [selectedCondicion, setSelectedCondicion] = useState<string>(infofilial.idCondicion.toString());
  const [selectedRegimen, setSelectedRegimen] = useState<string>(infofilial.idRegimen.toString());
  const [selectedCategoria, setSelectedCategoria] = useState<string>(infofilial.idCategoria.toString());
  const [selectedFiliales, setSelectedFiliales] = useState<string[]>(miidfilial.map(id => id.toString()));

  const handleFilialChange = (idFilial: string) => {
    setSelectedFiliales((prevSelected) =>
      prevSelected.includes(idFilial)
        ? prevSelected.filter((id) => id !== idFilial)
        : [...prevSelected, idFilial]
    );
  };

  const handleSave = () => {
    const docenteData = {
      escuela: selectedEscuela,
      condicion: selectedCondicion,
      regimen: selectedRegimen,
      categoria: selectedCategoria,
      filiales: selectedFiliales,
    };
    handleSaveDocenteData(docenteData);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 relative">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
        <h3 className="text-xl font-semibold mb-4">Detalles Adicionales para Docente</h3>
        
        <select
          className="border p-2 mb-4 w-full rounded"
          value={selectedEscuela}
          onChange={(e) => setSelectedEscuela(e.target.value)}
        >
          <option value="" disabled>Seleccione una Escuela</option>
          {escuelas.map((escuela) => (
            <option key={escuela.idEscuela} value={escuela.idEscuela.toString()}>
              {escuela.name} 
            </option>
          ))}
        </select>

        <select
          className="border p-2 mb-4 w-full rounded"
          value={selectedCondicion}
          onChange={(e) => setSelectedCondicion(e.target.value)}
        >
          <option value="" disabled>Seleccione una Condición</option>
          {condicion.map((cond) => (
            <option key={cond.idCondicion} value={cond.idCondicion.toString()}>
              {cond.nombreCondicion}
            </option>
          ))}
        </select>

        <select
          className="border p-2 mb-4 w-full rounded"
          value={selectedRegimen}
          onChange={(e) => setSelectedRegimen(e.target.value)}
        >
          <option value="" disabled>Seleccione un Régimen</option>
          {regimen.map((reg) => (
            <option key={reg.idRegimen} value={reg.idRegimen.toString()}>
              {reg.nombreRegimen}
            </option>
          ))}
        </select>

        <select
          className="border p-2 mb-4 w-full rounded"
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
        >
          <option value="" disabled>Seleccione una Categoría</option>
          {categoria.map((cat) => (
            <option key={cat.idCategoria} value={cat.idCategoria.toString()}>
              {cat.nombreCategoria}
            </option>
          ))}
        </select>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Seleccionar Sedes</h4>
          {filial.map((fil) => (
            <label key={fil.idFilial} className="block">
              <input
                type="checkbox"
                value={fil.idFilial.toString()}
                checked={selectedFiliales.includes(fil.idFilial.toString())}
                onChange={() => handleFilialChange(fil.idFilial.toString())}
                className="mr-2"
              />
              {fil.name}
            </label>
          ))}
        </div>

        <button onClick={handleSave} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full">
          Guardar y Cerrar
        </button>
      </div>
    </div>
  );
};

export default DocenteModal;
