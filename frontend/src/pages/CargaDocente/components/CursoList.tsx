// src/pages/CargaDocente/components/CursoList.tsx
import React from 'react';

interface Curso {
  id: number;
  name: string;
}

interface CursoListProps {
  availableCourses: Curso[];
  assignedCourses: Curso[];
  addCourse: (curso: Curso) => void;
  removeCourse: (curso: Curso) => void;
}

const CursoList: React.FC<CursoListProps> = ({
  availableCourses,
  assignedCourses,
  addCourse,
  removeCourse,
}) => {
  return (
    <div className="flex space-x-4">
      {/* Cursos Disponibles */}
      <div className="w-1/2">
        <h4 className="text-lg font-medium mb-2">Cursos Disponibles</h4>
        <ul className="border rounded-md p-2 max-h-64 overflow-y-auto">
          {availableCourses.map((curso) => (
            <li
              key={curso.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => addCourse(curso)}
            >
              {curso.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Cursos Asignados */}
      <div className="w-1/2">
        <h4 className="text-lg font-medium mb-2">Cursos Asignados</h4>
        <ul className="border rounded-md p-2 max-h-64 overflow-y-auto">
          {assignedCourses.map((curso) => (
            <li
              key={curso.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => removeCourse(curso)}
            >
              {curso.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CursoList;
