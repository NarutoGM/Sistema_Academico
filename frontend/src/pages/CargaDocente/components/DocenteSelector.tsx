// src/pages/CargaDocente/components/DocenteSelector.tsx
import React from 'react';

interface Docente {
  id: number;
  name: string;
}

interface DocenteSelectorProps {
  docentes: Docente[];
  onSelect: (docenteId: number) => void;
}

const DocenteSelector: React.FC<DocenteSelectorProps> = ({ docentes, onSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Seleccionar Docente</label>
      <select
        onChange={(e) => onSelect(Number(e.target.value))}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">--Seleccione un docente--</option>
        {docentes.map((docente) => (
          <option key={docente.id} value={docente.id}>
            {docente.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DocenteSelector;
