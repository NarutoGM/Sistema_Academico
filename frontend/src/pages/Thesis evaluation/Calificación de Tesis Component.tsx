import React from 'react';
import { Download, ArrowLeft, Edit, Image } from 'lucide-react';
import { To, useNavigate } from 'react-router-dom';

const ThesisEvaluation = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: To) => {
    navigate(path);
  };

  return (
    <div className="bg-gray-100 p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Calificación de Tesis</h1>
      
      <div className="w-full max-w-full rounded-lg shadow-lg bg-white p-6 dark:bg-boxdark">
        <h2 className="text-xl font-bold mb-2">DATAMART Y AGILIZACIÓN DE TOMA DE DECISIONES EN LA EMPRESA X</h2>
        
        <div className="mb-4">
          <p><strong>Autor:</strong> Juan Carlos</p>
          <p><strong>Turnitin:</strong> 12% 
            <button className="ml-2 text-blue-600">
              <Download size={18} />
            </button>
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center">

            <div>
                <label className="mb-3 block text-black dark:text-white">
                <p><strong>Nota(*):</strong></p>
                </label>
                <input
                  type="text"
                  placeholder="Default Input"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
          </div>
        </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                <p><strong>Comentarios:</strong></p>
                </label>
                <textarea
                  rows={6}
                  placeholder="Default textarea"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                <p><strong>Firma Digital(*):</strong></p>
                </label>
                <input
                  type="file"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>
        <div className="flex justify-between items-center mt-6">
          <button className="flex items-center text-blue-600"
                      onClick={() => handleNavigate('/thesis')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Volver
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThesisEvaluation;