import React from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import { To, useNavigate } from 'react-router-dom';

const ThesisDetails = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: To) => {
    navigate(path);
  };
  return (
    <div className="bg-gray-100 p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Detalle de Tesis</h1>
      
      <div className="w-full max-w-full rounded-lg shadow-lg bg-white p-6 dark:bg-boxdark">
        <h2 className="text-xl font-bold mb-2">DATAMART Y AGILIZACIÓN DE TOMA DE DECISIONES EN LA EMPRESA X</h2>
        
        <div className="mb-4">
          <p><strong>Autor:</strong> Juan Carlos</p>
          <p><strong>Turnitin:</strong> 12%</p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Estado:</h3>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ipsum dui, pretium
            malesuada tincidunt at, vehicula nec enim. In aliquet lacus ac egestas euismod. Cras eu lorem
            quis enim molestie volutpat. Maecenas maximus eros neque, non sollicitudin est eleifend sed.
            Nunc ut fringilla velit. Maecenas sed justo euismod, semper libero a, aliquet erat. Etiam justo
            lectus, aliquet non sem ac, convallis pellentesque sapien.
          </p>
        </div>
        
        <div className="flex space-x-4 mb-6">
          <button className="flex items-center px-4 py-2 bg-gray-200 rounded-md">
            <Download size={18} className="mr-2" />
            Turnitin.pdf
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-200 rounded-md">
            <Download size={18} className="mr-2" />
            Tesis.pdf
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Calificaciones:</h3>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Persona</th>
                <th className="py-2 px-4 text-left">Nota</th>
                <th className="py-2 px-4 text-left">Firma</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">J</div>
                    Jurado
                  </div>
                </td>
                <td className="py-2 px-4">18</td>
                <td className="py-2 px-4">✅</td>
              </tr>
              <tr>
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-2">S</div>
                    Secretario
                  </div>
                </td>
                <td className="py-2 px-4">15</td>
                <td className="py-2 px-4">✅</td>
              </tr>
              <tr>
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-2">V</div>
                    Vocero
                  </div>
                </td>
                <td className="py-2 px-4">16</td>
                <td className="py-2 px-4">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Archivos generados:</h3>
          <div className="space-y-2">
            <button className="flex items-center px-4 py-2 bg-gray-200 rounded-md w-full">
              <Download size={18} className="mr-2" />
              Hoja de evaluación
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-200 rounded-md w-full">
              <Download size={18} className="mr-2" />
              Acta de evaluación
            </button>
          </div>
        </div>
      </div>
      
      <button className="flex items-center text-blue-600"
                      onClick={() => handleNavigate('/thesis')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Volver
          </button>
    </div>
  );
};

export default ThesisDetails;