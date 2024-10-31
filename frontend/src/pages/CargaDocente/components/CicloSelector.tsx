// src/pages/CargaDocente/components/CicloSelector.tsx
import React from 'react';

interface Ciclo {
  id: number;
  name: string;
}

interface CicloSelectorProps {
  ciclos: Ciclo[];
  onSelect: (cicloId: number) => void;
}

const CicloSelector: React.FC<CicloSelectorProps> = ({ ciclos, onSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Seleccionar Ciclo Académico</label>
      <select
        onChange={(e) => onSelect(Number(e.target.value))}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="">--Seleccione un ciclo--</option>
        {ciclos.map((ciclo) => (
          <option key={ciclo.id} value={ciclo.id}>
            {ciclo.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CicloSelector;
