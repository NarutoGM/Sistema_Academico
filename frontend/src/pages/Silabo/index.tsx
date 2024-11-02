import React from 'react';
import FileUploadComponent from './FileUploadComponent';

const App = () => {
  const courseData = {
    nombreCurso: "Matemáticas Avanzadas",
    docente: "Prof. Juan Pérez",
    objetivos: "Desarrollar habilidades en cálculos avanzados...",
    temas: ["Álgebra", "Cálculo Diferencial", "Geometría Analítica"],
    cronograma: "Semana 1-4: Álgebra, Semana 5-8: Cálculo...",
  };

  return (
    <div>
      <FileUploadComponent courseInfo={courseData} />
    </div>
  );
};

export default App;
