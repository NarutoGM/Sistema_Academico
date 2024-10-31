// src/pages/CargaDocentePage.js
import React, { useState } from 'react';
import CargaDocenteModal from './cargaDocenteModal';

const CargaDocentePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Asignación de Carga Docente</h1>
      <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Asignar Cursos a Docente
      </button>

      {isModalOpen && (
        <CargaDocenteModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          // Puedes pasar ciclos, docentes y cursos aquí como props, si lo necesitas
        />
      )}
    </div>
  );
};

export default CargaDocentePage;
