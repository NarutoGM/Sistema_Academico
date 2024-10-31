import React, { useState, useEffect } from 'react';
import DocenteSelector from './components/DocenteSelector';
import CicloSelector from './components/CicloSelector';
import CursoList from './components/CursoList';

const CargaDocenteModal = ({ isOpen, closeModal, onSave }) => {
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [selectedCiclo, setSelectedCiclo] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  const handleSave = () => {
    onSave({ docente: selectedDocente, ciclo: selectedCiclo, courses: assignedCourses });
    closeModal();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
          <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
          <h3 className="text-xl font-semibold mb-6">Asignar Cursos a Docente</h3>

          {/* Seleccionar Docente y Ciclo */}
          <DocenteSelector onSelect={setSelectedDocente} />
          <CicloSelector onSelect={setSelectedCiclo} />

          {/* Lista de Cursos */}
          <CursoList 
            availableCourses={availableCourses} 
            assignedCourses={assignedCourses} 
            setAvailableCourses={setAvailableCourses} 
            setAssignedCourses={setAssignedCourses} 
          />

          <button onClick={handleSave} className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Guardar Asignación
          </button>
        </div>
      </div>
    )
  );
};

export default CargaDocenteModal;
