// src/components/CreateEditModal.tsx
import React, { ChangeEvent, FormEvent } from 'react';
import { Facultad } from '@/types'; // Ajusta la ruta si tienes la interfaz en otro archivo

interface CreateEditModalProps {
  isOpen: boolean;
  isEditing: boolean;
  currentEscuela: { name: string; idFacultad: string };
  facultades: Facultad[];
  onClose: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

const CreateEditModal: React.FC<CreateEditModalProps> = ({
  isOpen,
  isEditing,
  currentEscuela,
  facultades,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Editar Escuela' : 'Crear Escuela'}</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre de la Escuela</label>
            <input
              type="text"
              name="name"
              value={currentEscuela.name}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Facultad</label>
            <select
              name="idFacultad"
              value={currentEscuela.idFacultad}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              <option value="">Seleccione una facultad</option>
              {facultades.map((facultad) => (
                <option key={facultad.idFacultad} value={facultad.idFacultad}>
                  {facultad.nomFacultad}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditModal;
