import React, { useEffect, useState } from 'react';
import {
  getMisCursos,
  CargaDocente,
  enviarinfoSilabo,
  getSilaboPasado,
} from '@/pages/services/silabo.services';
import './estilos.css';
import LogoCrear from '../../images/logo/crearsilabo.png';
import Silabos from '../../images/logo/silabos.jpg';
import visualizarenvio from '../../images/logo/visualizarenvio.png';
import Modal from 'react-modal';

import LogoReutilizar from '../../images/logo/reutilizarsilabo.png';
import moment from 'moment'; // O cualquier otra librería de manejo de fechas que prefieras
import { generarSilaboPDF } from '@/utils/pdfUtils';
import { set } from 'zod';

const Index: React.FC = () => {
  const [cargaDocente, setCargaDocente] = useState<CargaDocente[]>([]);
  const [filteredData, setFilteredData] = useState<CargaDocente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false); // Controla la transición entre las caras
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla si el modal1 está abierto

  const [isModalOpen2, setIsModalOpen2] = useState(false); // Controla si el modal2 está abierto
  const [isModalOpen3, setIsModalOpen3] = useState(false); // Controla si el modal2 está abierto

  const [selectedCarga, setSelectedCarga] = useState<CargaDocente>();
  const [selectedCarga2, setSelectedCarga2] = useState<CargaDocente>();
  const [selectedOriginal, setSelectedOriginal] = useState<CargaDocente>();
  const [num, setnum] = useState<number>();

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  Modal.setAppElement('#root');
  useEffect(() => {
    // Función para manejar la tecla F7
    const handleKeyDown = (event) => {
      if (event.key === 'F7') {
        // Abrir el archivo HTML en una nueva ventana
        window.open('/gestionsilabos/index.htm', '_blank');
      }
    };

    // Agregar el event listener
    window.addEventListener('keydown', handleKeyDown);

    // Limpiar el listener al desmontar el componente
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  const fetchCursos = async () => {
    try {
      const data = await getMisCursos();
      setCargaDocente(data.cargadocente);
      setFilteredData(data.cargadocente);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openModal2 = async () => {
    try {

      const data2 = await getSilaboPasado(selectedOriginal?.idCurso);
      console.log(data2);
      setSelectedCarga2(data2.cargadocente[0]);
      setIsModalOpen2(true);
      setnum(1);
    } catch (error) {
      console.error("Error al obtener los datos del silabo:", error);
    }
  };


  const openModal3 = () => {
    setIsModalOpen3(true);
  };
  const closeModal3 = () => {
    setIsModalOpen3(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeModal2 = () => {
    setIsModalOpen2(false);
  };

  const [currentStep, setCurrentStep] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const handleCreateSilabo = async () => {
    try {
      if (num == 1) {
        console.log('Sílabo enviado correctamente:', selectedCarga2);

        const response = await enviarinfoSilabo(selectedCarga2);
        console.log('Sílabo enviado correctamente:', response);

      } else {
        console.log('Sílabo enviado correctamente:', selectedCarga);

        const response = await enviarinfoSilabo(selectedCarga);
        console.log('Sílabo enviado correctamente:', response);

      }

      // Refrescar los datos directamente
      await fetchCursos();
      closeModal();
      setIsFlipped(false);
    } catch (error) {
      console.error('Error al enviar el sílabo:', error);
    }
    setShowModal(false);
  };

  const handleCreateSilabo2 = async () => {
    closeModal2();
    console.log(selectedCarga2);
    // Asegurarse de que selectedCarga2 tenga los valores correctos de selectedCarga
    selectedCarga2.idDirector = selectedOriginal?.idDirector;
    selectedCarga2.idDocente = selectedOriginal?.idDocente;
    selectedCarga2.idCargaDocente = selectedOriginal?.idCargaDocente;
    selectedCarga2.idFilial = selectedOriginal?.idFilial;
    selectedCarga2.silabo.idDocente = selectedOriginal?.idDocente;
    selectedCarga2.silabo.idCargaDocente = selectedOriginal?.idCargaDocente;
    selectedCarga2.silabo.idFilial = selectedOriginal?.idFilial;
    selectedCarga2.filial.name = selectedOriginal?.filial?.name;
    
    selectedCarga2.semestre_academico.nomSemestre = selectedOriginal?.semestre_academico?.nomSemestre;
    selectedCarga2.semestre_academico.fInicio = selectedOriginal?.semestre_academico?.fInicio;
    selectedCarga2.semestre_academico.fTermino = selectedOriginal?.semestre_academico?.fTermino;

    // Actualizar los valores de los campos dinámicamente a partir de selectedCarga
    selectedCarga2.silabo.semanas.forEach((semana, index) => {
      // Aquí, los valores de cada campo provienen de selectedCarga
      semana.idCargaDocente = selectedOriginal?.idCargaDocente || '';  // Valor desde selectedCarga
      semana.idFilial = selectedOriginal?.idFilial || '';
      semana.idDocente = selectedOriginal?.idDocente || '';

    });

    console.log(selectedCarga2);
    setSelectedCarga(selectedCarga2);
    openModal(true);

    setShowModal(false);
  };




  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const steps = [
    { label: 'Datos Básicos', content: '' },
    { label: 'Sumilla Academica', content: 'Escriba la sumilla requerida.' },
    {
      label: 'Competencias academicas',
      content: 'Defina las competencia asociada a cada Contexto.',
    },
    {
      label: 'Capacidades Terminales y Resultados de Aprendizajes',
      content: 'Defina aquí la programación academica del curso',
    },
    {
      label: 'Semanas programadas',
      content: 'Defina aquí el contenido de cada semana del curso',
    },
    {
      label: 'Evaluacion academica',
      content:
        'Defina aquí el la formula q se usara para calificar cada unidad en el curso',
    },
    { label: 'Tutoria', content: 'Defina aquí el horario de tutorías' },
    {
      label: 'Referencias Bibliograficas',
      content: 'Defina aquí las referencias bibliograficas del curso',
    },
    {
      label: 'Generar silabo',
      content:
        'En este apartado usted podra generar su silabo y actualizar la información del mismo en caso ya tenga uno',
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: string,
  ) => {
    const newValue = e.target.value;

    setSelectedCarga((prevCarga) => ({
      ...prevCarga,
      silabo: {
        ...prevCarga.silabo,
        [field]: newValue, // Actualiza dinámicamente el campo correspondiente
      },
    }));
  };

  const handleChange2 = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
    field: string,
  ) => {
    const newValue = e.target.value;

    setSelectedCarga((prevCarga) => {
      const updatedSemanas = [...(prevCarga.silabo?.semanas || [])]; // Copiar el arreglo de semanas existente
      if (!updatedSemanas[index]) {
        updatedSemanas[index] = {}; // Asegurarse de que el objeto en el índice exista
      }
      updatedSemanas[index][field] = newValue; // Actualizar dinámicamente el campo en el índice

      return {
        ...prevCarga,
        silabo: {
          ...prevCarga.silabo,
          semanas: updatedSemanas, // Actualizar el arreglo de semanas
        },
      };
    });
  };

  interface Errors {
    sumilla?: string;
    competenciasgenerales?: string;
    unidadcompetencia?: string;
    resultados?: string;
    resultadosaprendizajes1?: string;
    resultadosaprendizajes2?: string;
    resultadosaprendizajes3?: string;
    capacidadesterminales1?: string;
    capacidadesterminales2?: string;
    capacidadesterminales3?: string;
    sem1organizacion?: string;
    sem2organizacion?: string;
    sem3organizacion?: string;
    sem4organizacion?: string;
    sem5organizacion?: string;
    sem6organizacion?: string;
    sem7organizacion?: string;
    sem8organizacion?: string;
    sem9organizacion?: string;
    sem10organizacion?: string;
    sem11organizacion?: string;
    sem12organizacion?: string;
    sem13organizacion?: string;
    sem14organizacion?: string;
    sem15organizacion?: string;
    sem16organizacion?: string;
    sem1estrategias?: string;
    sem2estrategias?: string;
    sem3estrategias?: string;
    sem4estrategias?: string;
    sem5estrategias?: string;
    sem6estrategias?: string;
    sem7estrategias?: string;
    sem8estrategias?: string;
    sem9estrategias?: string;
    sem10estrategias?: string;
    sem11estrategias?: string;
    sem12estrategias?: string;
    sem13estrategias?: string;
    sem14estrategias?: string;
    sem15estrategias?: string;
    sem16estrategias?: string;
    sem1evidencias?: string;
    sem2evidencias?: string;
    sem3evidencias?: string;
    sem42evidencias?: string;
    sem5evidencias?: string;
    sem6evidencias?: string;
    sem7evidencias?: string;
    sem8evidencias?: string;
    sem9evidencias?: string;
    sem10evidencias?: string;
    sem11evidencias?: string;
    sem12evidencias?: string;
    sem13evidencias?: string;
    sem14evidencias?: string;
    sem15evidencias?: string;
    sem16evidencias?: string;
    sem1instrumentos?: string;
    sem2instrumentos?: string;
    sem3instrumentos?: string;
    sem4instrumentos?: string;
    sem5instrumentos?: string;
    sem6instrumentos?: string;
    sem7instrumentos?: string;
    sem8instrumentos?: string;
    sem9instrumentos?: string;
    sem10instrumentos?: string;
    sem11instrumentos?: string;
    sem12instrumentos?: string;
    sem13instrumentos?: string;
    sem14instrumentos?: string;
    sem15instrumentos?: string;
    sem16instrumentos?: string;
    sem1nomSem?: string;
    sem2nomSem?: string;
    sem3nomSem?: string;
    sem4nomSem?: string;
    sem5nomSem?: string;
    sem6nomSem?: string;
    sem7nomSem?: string;
    sem8nomSem?: string;
    sem9nomSem?: string;
    sem10nomSem?: string;
    sem11nomSem?: string;
    sem12nomSem?: string;
    sem13nomSem?: string;
    sem14nomSem?: string;
    sem15nomSem?: string;
    sem16nomSem?: string;
    sistemaevaluacion?: string;
    infosistemaevaluacion?: string;
    tutoria?: string;
    referencias?: string;
  }

  const [errors, setErrors] = useState<Errors>({});

  const validateStep = () => {
    const newErrors: Errors = {};

    if (currentStep === 0) {
    }
    if (currentStep === 1) {
      if (!selectedCarga?.silabo?.sumilla)
        newErrors.sumilla = 'La sumilla es obligatoria';
    }
    if (currentStep === 2) {
      if (!selectedCarga?.silabo?.unidadcompetencia)
        newErrors.unidadcompetencia = 'La unidadcompetencia es obligatoria';
    }
    if (currentStep === 2) {
      if (!selectedCarga?.silabo?.competenciasgenerales)
        newErrors.competenciasgenerales = 'La competencia es obligatoria';
    }
    if (currentStep === 2) {
      if (!selectedCarga?.silabo?.resultados)
        newErrors.resultados = 'Los resultados son obligatorios';
    }
    if (currentStep === 3) {
      if (!selectedCarga?.silabo?.resultadosaprendizajes1)
        newErrors.resultadosaprendizajes1 =
          'El resultado de aprendizaje de la unidad I es obligatorio';
      if (!selectedCarga?.silabo?.resultadosaprendizajes2)
        newErrors.resultadosaprendizajes2 =
          'El resultado de aprendizaje de la unidad II es obligatorio';
      if (!selectedCarga?.silabo?.resultadosaprendizajes3)
        newErrors.resultadosaprendizajes3 =
          'El resultado de aprendizaje de la unidad III es obligatorio';
      if (!selectedCarga?.silabo?.capacidadesterminales1)
        newErrors.capacidadesterminales1 =
          'Las capacidades terminales de la unidad I es obligatorio';
      if (!selectedCarga?.silabo?.capacidadesterminales2)
        newErrors.capacidadesterminales2 =
          'Las capacidades terminales de la unidad II es obligatorio';
      if (!selectedCarga?.silabo?.capacidadesterminales3)
        newErrors.capacidadesterminales3 =
          'Las capacidades terminales de la unidad III es obligatorio';
    }
    if (currentStep === 4) {
      const newErrors: { [key: string]: string } = {}; // Declarar newErrors con un tipo explícito

      for (let i = 0; i < 16; i++) {
        // Asegurarse de que el índice existe en el array
        const semana = selectedCarga?.silabo?.semanas?.[i] || {};

        if (!semana.organizacion) {
          newErrors[`sem${i + 1}organizacion`] =
            `El resultado de aprendizaje o capacidades terminales de la semana ${i + 1} es obligatorio`;
        }

        if (!semana.estrategias) {
          newErrors[`sem${i + 1}estrategias`] =
            `Las estrategias de la semana ${i + 1} son obligatorias`;
        }

        if (!semana.evidencias) {
          newErrors[`sem${i + 1}evidencias`] =
            `Las evidencias de la semana ${i + 1} son obligatorias`;
        }

        if (!semana.instrumentos) {
          newErrors[`sem${i + 1}instrumentos`] =
            `Los instrumentos de la semana ${i + 1} son obligatorios`;
        }

        if (!semana.nomSem) {
          newErrors[`sem${i + 1}nomSem`] =
            `El nombre de la semana ${i + 1} es obligatorio`;
        }
        setErrors(newErrors);

        // Si hay errores, impedir avanzar
        return Object.keys(newErrors).length === 0;
      }
    }
    if (currentStep === 5) {
      if (!selectedCarga?.silabo?.sistemaevaluacion)
        newErrors.sistemaevaluacion =
          'Debe especificar el la formula q se palicada para evaluar  a los estudiantes';
      if (!selectedCarga?.silabo?.infosistemaevaluacion)
        newErrors.infosistemaevaluacion =
          'Aqui debe especificar el significado de cada variable usada en la formula';
    }

    if (currentStep === 6) {
      if (!selectedCarga?.silabo?.tutoria)
        newErrors.tutoria =
          'Debe especificar la informacion de las reuniones para tutorias academicas';
    }
    if (currentStep === 7) {
      if (!selectedCarga?.silabo?.referencias)
        newErrors.referencias =
          'Debe especificar las referencias bibliograficas que se relacionan con la asignatura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Manejar caso de fecha vacía
    const date = new Date(dateString);
    return moment(date).format('YYYY-MM-DD'); // Formato año-mes-día
  };

  const [newReference, setNewReference] = useState<string>('');

  const addReference = () => {
    // Validar que la nueva referencia no esté vacía
    if (!newReference.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newReference: 'La referencia no puede estar vacía',
      }));
      return;
    }

    // Obtener las referencias actuales o un string vacío si no existen
    const currentReferences = selectedCarga?.silabo?.referencias || '';

    // Construir las referencias actualizadas con un doble salto de línea
    const updatedReferences = currentReferences
      ? `${currentReferences}\n\n${newReference}` // Si hay referencias previas, agrega doble salto de línea
      : newReference; // Si no hay referencias previas, solo usa la nueva referencia

    // Actualizar el atributo 'referencias'
    handleChange({ target: { value: updatedReferences } }, 'referencias');

    // Limpiar el campo temporal y errores
    setNewReference(''); // Vaciar el input de nueva referencia
    setErrors((prevErrors) => ({ ...prevErrors, newReference: undefined })); // Eliminar cualquier error previo
  };

  return (
    <div className="card-container">
      <div className={`card rounded-xl ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Face */}
        <div className="card-face front p-10  ">
          <h1 className="text-2xl font-bold mb-4">Mis cursos:</h1>
          {error && <p className="text-red-500">{error}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-blue-700">
                  <th className="px-4 py-2 border-b font-medium text-white">
                    Código
                  </th>
                  <th className="px-4 py-2 border-b font-medium text-white">
                    Curso
                  </th>
                  <th className="px-4 py-2 border-b font-medium text-white">
                    Filial
                  </th>
                  <th className="px-4 py-2 border-b font-medium text-white">
                    Semestre
                  </th>
                  <th className="px-4 py-2 border-b font-medium text-white">
                    Ciclo
                  </th>
                  <th className="px-4 py-2 border-b font-medium text-white">
                    Fecha de Envio
                  </th>
                  <th className="px-4 py-2 border-b font-medium text-white">
                    Estado
                  </th>
                  <th className="px-4 py-2 border-b font-medium text-white">
                    Acciones
                  </th>
                  <th className="px-4 py-2 border-b font-medium text-white">
                    Generar PDF
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((carga) => (
                  <tr key={carga.idCargaDocente} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b text-center">
                      {carga.idCurso}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {carga.curso?.name}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {carga.filial?.name}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {carga.semestre_academico?.nomSemestre}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {carga.ciclo}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {carga.silabo?.fEnvio
                        ? new Date(carga.silabo.fEnvio).toLocaleDateString('es-ES') // Convierte a un objeto Date y luego formatea
                        : 'N/A' // Si es undefined, muestra un texto por defecto
                      }
                    </td>

                    <td className="px-4 py-2 border-b text-center">
                      <span
                        className={`px-2 py-1 rounded-lg 
      ${carga.estado === false
                            ? "bg-gray-300 text-gray-700 border border-gray-400"
                            : carga.silabo?.estado === null
                              ? "bg-gray-100 text-gray-600 border border-gray-300"
                              : carga.silabo?.estado === 1
                                ? "bg-blue-100 text-blue-600 border border-blue-300"
                                : carga.silabo?.estado === 2
                                  ? "bg-red-100 text-red-600 border border-red-300"
                                  : carga.silabo?.estado === 3
                                    ? "bg-green-100 text-green-600 border border-green-300"
                                    : "bg-yellow-100 text-yellow-600 border border-yellow-300"
                          }`}
                      >
                        {carga.estado === false
                          ? "Inactivo"
                          : carga.silabo?.estado == null
                            ? "Gestiona tu silabo"
                            : carga.silabo?.estado === 1
                              ? "Silabo enviado"
                              : carga.silabo?.estado === 2
                                ? "Silabo rechazado"
                                : carga.silabo?.estado === 3
                                  ? "Silabo aceptado"
                                  : "Estado desconocido"}
                      </span>
                    </td>



                    <td className="px-4 py-2 border-b text-center">
                      <button
                        onClick={() => {
                          setSelectedOriginal(carga);
                          setIsFlipped(true); // Gira la tarjeta
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Gestión de sílabos
                      </button>
                    </td>
                    {/* Botón para Generar PDF */}
                    <td className="px-4 py-2 border-b text-center">
                      <button
                        onClick={() => generarSilaboPDF(carga, 3)}
                        disabled={!carga.silabo?.sumilla} // Deshabilitar si no hay sumilla
                        className={`px-2 py-2 rounded-full ${carga.silabo?.sumilla
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                          }`}
                      >
                        {/* Ícono de Descarga */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back Face */}
        <div className="card-face back bg-gray-100 shadow-lg rounded-lg  flex flex-col  items-center p-6">
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Curso Seleccionado
          </h3>
          <p className="text-gray-600 text-center text-4xl font-bold mb-6">
            {selectedOriginal?.curso?.name || 'Sin nombre'}
          </p>
          <div className="flex flex-wrap gap-4">
            {/* Opción: Crear un nuevo sílabo */}
            <div
              onClick={() => { openModal(); setSelectedCarga(selectedOriginal); }}
              className="flex flex-col items-center bg-white border rounded-lg shadow-lg p-6 w-96 cursor-pointer transition transform hover:scale-105 hover:shadow-xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 rounded-t-lg"></div>
              <img
                src={LogoCrear}
                alt="Logo Crear"
                className="w-20 h-20 mb-4 mt-2"
              />
              <h3 className="text-xl font-bold text-gray-700">
                Crear un nuevo sílabo y/o actualizar
              </h3>
            </div>

            {/* Opción: Reutilizar un sílabo */}
            <div
              onClick={() => openModal2()}
              className="flex flex-col items-center bg-white border rounded-lg shadow-lg p-6 w-96 cursor-pointer transition transform hover:scale-105 hover:shadow-xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-green-500 rounded-t-lg"></div>
              <img
                src={LogoReutilizar}
                alt="Logo Reutilizar"
                className="w-20 h-20 mb-4 mt-2"
              />
              <h3 className="text-xl font-bold text-gray-700">
                Utilizar un sílabo ya creado
              </h3>
            </div>

            <div
              onClick={() => { selectedCarga?.silabo !== null && openModal3(); setSelectedCarga(selectedOriginal); }}
              className={`flex flex-col items-center bg-white border rounded-lg shadow-lg p-6 w-96 transition transform relative ${selectedCarga?.silabo !== null
                ? 'cursor-pointer hover:scale-105 hover:shadow-xl'
                : 'cursor-not-allowed opacity-50'
                }`}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500 rounded-t-lg"></div>
              <img
                src={visualizarenvio}
                alt="Logo Reutilizar"
                className="w-20 h-20 mb-4 mt-2"
              />
              <h3 className="text-xl font-bold text-gray-700">
                Previsualizar estado de silabo
              </h3>
            </div>




          </div>
          <button
            onClick={() => setIsFlipped(false)} // Regresa a la cara frontal
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded shadow-lg mt-4 hover:bg-red-500 transition"
          >
            Regresar
          </button>
        </div>
      </div>

      {/* Modal */}

      {isModalOpen2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full text-center">
            <div className="text-2xl font-bold mb-4">
              {selectedOriginal?.curso?.name || "Sin nombre"}
            </div>

            {/* Sección del PDF */}
            <div
              id="pdf-container"
              className="basis-3/4 border rounded-lg overflow-hidden"
              style={{ height: "55vh" }} // Ajusta la altura del contenedor
            >
              <iframe
                src={generarSilaboPDF(selectedCarga2, 2)}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Sílabo PDF"
              />
            </div>

            {/* Contenedor del botón */}
            <div className="mt-6 flex justify-center gap-4">
              <button
onClick={() => { handleCreateSilabo2(); setnum(1);  }}
className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-green-800 transform hover:scale-105 transition-all duration-300"
              >
                Usar
              </button>
              <button
                onClick={closeModal2}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}


      {isModalOpen3 && (


        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full text-center">
            <div className="text-2xl font-bold mb-4">
              {selectedOriginal?.curso?.name || "Sin nombre"}
            </div>

            <div className="flex flex-row gap-4 h-100 ">
              {/* Sección de Observaciones */}
              <div className="basis-1/4 border rounded-lg p-4 overflow-auto">
                <h3 className="text-xl font-semibold mb-2">Observaciones</h3>
                <p className="text-gray-700">
                  {selectedOriginal?.silabo?.observaciones || "Sin observaciones"}
                </p>
              </div>

              {/* Sección del PDF */}
              <div
                id="pdf-container"
                className="basis-3/4 border rounded-lg overflow-hidden"
              >
                <iframe
                  src={generarSilaboPDF(selectedOriginal, 2)}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="Sílabo PDF"
                />
              </div>
            </div>

            <button
              onClick={closeModal3}
              className="mt-6 px-8 py-4 bg-blue-600 text-white text-2xl rounded-lg hover:bg-blue-500"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}




      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center   z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-7xl w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {selectedCarga?.curso?.name}
            </h2>

            {/* Tabs Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex-1 text-center cursor-pointer ${index <= currentStep
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-400'
                    }`}
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                >
                  <div
                    className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                      }`}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  {step.label}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="mb-6 text-center overflow-y-auto max-h-96">
              <p className="text-xl">{steps[currentStep].content}</p>
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">Área:</label>
                    <input
                      type="text"
                      placeholder="Área:"
                      value={selectedCarga?.curso?.area?.nomArea || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">Facultad:</label>
                    <input
                      type="text"
                      placeholder="Facultad:"
                      value={selectedCarga?.curso?.facultad?.nomFacultad || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Departamento Academico:
                    </label>
                    <input
                      type="text"
                      placeholder="Departamento Academico:"
                      value={
                        selectedCarga?.curso?.departamento?.nomDepartamento ||
                        ''
                      }
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Programa de estudios:
                    </label>
                    <input
                      type="text"
                      placeholder="Programa de estudios:"
                      value={selectedCarga?.escuela?.name || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">Sede:</label>
                    <input
                      type="text"
                      placeholder="Sede"
                      value={selectedCarga?.filial?.name || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">Ciclo:</label>
                    <input
                      type="text"
                      placeholder="Ciclo"
                      value={selectedCarga?.ciclo || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Código de la experiencia curricular :
                    </label>
                    <input
                      type="text"
                      placeholder="Código de la experiencia curricular"
                      value={selectedCarga?.curso?.idCurso || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Sección o grupo :
                    </label>
                    <input
                      type="text"
                      placeholder="Sección o grupo"
                      value={selectedCarga?.grupo || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">Créditos :</label>
                    <input
                      type="text"
                      placeholder="Créditos"
                      value={selectedCarga?.curso?.creditos || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">Requisitos :</label>
                    <input
                      type="text"
                      placeholder="Requisitos"
                      value={selectedCarga?.prerequisitos || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Inicio - Termino :
                    </label>
                    <input
                      type="text"
                      placeholder="Inicio - Termino"
                      value={
                        formatDate(
                          selectedCarga?.semestre_academico?.fInicio ?? '',
                        ) +
                        ' al ' +
                        formatDate(
                          selectedCarga?.semestre_academico?.fTermino ?? '',
                        ) || ''
                      }
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">Tipo :</label>
                    <input
                      type="text"
                      placeholder="Tipo"
                      value={
                        selectedCarga?.curso?.tipo_curso?.descripcion || ''
                      }
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">Regimen :</label>
                    <input
                      type="text"
                      placeholder="Regimen"
                      value={
                        selectedCarga?.curso?.regimen_curso?.nomRegimen || ''
                      }
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Horas Teoricas :
                    </label>
                    <input
                      type="text"
                      placeholder="Horas Teoricas"
                      value={selectedCarga?.curso?.hTeoricas || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Horas Practicas :
                    </label>
                    <input
                      type="text"
                      placeholder="Horas Practicas"
                      value={selectedCarga?.curso?.hPracticas || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Horas de laboratorio :
                    </label>
                    <input
                      type="text"
                      placeholder="Horas de laboratorio"
                      value={selectedCarga?.curso?.hLaboratorio || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Horas de Retrolaimentacion :
                    </label>
                    <input
                      type="text"
                      placeholder="Horas de retroalimentacion"
                      value={selectedCarga?.curso?.hRetroalimentacion || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Apellidos y nombres del docente :
                    </label>
                    <input
                      type="text"
                      placeholder="Apellidos y nombres del docente :"
                      value={
                        selectedCarga?.nomdocente +
                        ' ' +
                        selectedCarga?.apedocente || ''
                      }
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">Profesión :</label>
                    <input
                      type="text"
                      placeholder="Profesión"
                      value={selectedCarga?.profesion || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="w-1/4 text-gray-700">
                      Correo institucional :
                    </label>
                    <input
                      type="text"
                      placeholder="Correo institucional"
                      value={selectedCarga?.email || ''}
                      readOnly
                      className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
              {currentStep === 1 && (
                <div>
                  <textarea
                    placeholder="Escribir aqui la información de la Sumilla"
                    value={selectedCarga?.silabo?.sumilla}
                    onChange={(e) => handleChange(e, 'sumilla')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-80 resize-y"
                  />
                  {errors.sumilla && (
                    <p className="text-red-500">{errors.sumilla}</p>
                  )}
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <label className="text-3xl font-bold">
                    Unidad de Competencia:
                  </label>
                  <textarea
                    placeholder="Escribir aqui la información de la Unidad de Competencia"
                    value={selectedCarga?.silabo?.unidadcompetencia}
                    onChange={(e) => handleChange(e, 'unidadcompetencia')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-50 resize-y"
                  />
                  {errors.unidadcompetencia && (
                    <p className="text-red-500">{errors.unidadcompetencia}</p>
                  )}

                  <label className="text-3xl font-bold">
                    Competencias Generales:
                  </label>
                  <textarea
                    placeholder="Escribir aqui la información de las Competencias Generales"
                    value={selectedCarga?.silabo?.competenciasgenerales}
                    onChange={(e) => handleChange(e, 'competenciasgenerales')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-25 resize-y"
                  />
                  {errors.competenciasgenerales && (
                    <p className="text-red-500">
                      {errors.competenciasgenerales}
                    </p>
                  )}

                  <label className="text-3xl font-bold">Resultados:</label>
                  <textarea
                    placeholder="Escribir aqui la información de los Resultados Esperados"
                    value={selectedCarga?.silabo?.resultados}
                    onChange={(e) => handleChange(e, 'resultados')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-60 resize-y"
                  />
                  {errors.resultados && (
                    <p className="text-red-500">{errors.resultados}</p>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <label className="text-3xl font-bold">Unidad I</label>
                  <br />
                  <label className="text-xl font-bold">
                    Capacidades Terminales
                  </label>

                  <textarea
                    placeholder="Escribir aqui la información de la Unidad de Competencia"
                    value={selectedCarga?.silabo?.capacidadesterminales1}
                    onChange={(e) => handleChange(e, 'capacidadesterminales1')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-60 resize-y"
                  />
                  {errors.capacidadesterminales1 && (
                    <p className="text-red-500">
                      {errors.capacidadesterminales1}
                    </p>
                  )}
                  <label className="text-xl font-bold">
                    Resultados de Aprendizajes
                  </label>
                  <textarea
                    placeholder="Escribir aqui la información de la Unidad de Competencia"
                    value={selectedCarga?.silabo?.resultadosaprendizajes1}
                    onChange={(e) => handleChange(e, 'resultadosaprendizajes1')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-60 resize-y"
                  />
                  {errors.resultadosaprendizajes1 && (
                    <p className="text-red-500">
                      {errors.resultadosaprendizajes1}
                    </p>
                  )}

                  <label className="text-3xl font-bold">Unidad II</label>
                  <br />
                  <label className="text-xl font-bold">
                    Capacidades Terminales
                  </label>

                  <textarea
                    placeholder="Escribir aqui la información de la Unidad de Competencia"
                    value={selectedCarga?.silabo?.capacidadesterminales2}
                    onChange={(e) => handleChange(e, 'capacidadesterminales2')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-60 resize-y"
                  />
                  {errors.capacidadesterminales2 && (
                    <p className="text-red-500">
                      {errors.capacidadesterminales2}
                    </p>
                  )}
                  <label className="text-xl font-bold">
                    Resultados de Aprendizajes
                  </label>
                  <textarea
                    placeholder="Escribir aqui la información de la Unidad de Competencia"
                    value={selectedCarga?.silabo?.resultadosaprendizajes2}
                    onChange={(e) => handleChange(e, 'resultadosaprendizajes2')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-60 resize-y"
                  />
                  {errors.resultadosaprendizajes2 && (
                    <p className="text-red-500">
                      {errors.resultadosaprendizajes2}
                    </p>
                  )}

                  <label className="text-3xl font-bold">Unidad III</label>
                  <br />
                  <label className="text-xl font-bold">
                    Capacidades Terminales
                  </label>

                  <textarea
                    placeholder="Escribir aqui la información de la Unidad de Competencia"
                    value={selectedCarga?.silabo?.capacidadesterminales3}
                    onChange={(e) => handleChange(e, 'capacidadesterminales3')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-60 resize-y"
                  />
                  {errors.capacidadesterminales3 && (
                    <p className="text-red-500">
                      {errors.capacidadesterminales3}
                    </p>
                  )}
                  <label className="text-xl font-bold">
                    Resultados de Aprendizajes
                  </label>
                  <textarea
                    placeholder="Escribir aqui la información de la Unidad de Competencia"
                    value={selectedCarga?.silabo?.resultadosaprendizajes3}
                    onChange={(e) => handleChange(e, 'resultadosaprendizajes3')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-60 resize-y"
                  />
                  {errors.resultadosaprendizajes3 && (
                    <p className="text-red-500">
                      {errors.resultadosaprendizajes3}
                    </p>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <table className="table-auto border-collapse border border-gray-400 w-full text-left">
                    <thead className="sticky top-0 bg-blue-600 z-10">
                      <tr>
                        <th className="border border-gray-400 px-4 py-2 text-slate-100">
                          Semana
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-slate-100">
                          Organización de Unidades de Contenidos
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-slate-100">
                          Estrategias Didácticas
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-slate-100">
                          Evidencias de Desempeño
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-slate-100">
                          Instrumentos de Evaluación
                        </th>
                        <th className="border border-gray-400 px-4 py-2 text-slate-100">
                          Nombre Semana
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 16 }).map((_, index) => (
                        <tr
                          key={index}
                          className={`hover:bg-cyan-100 transition-colors ${errors[`sem${index + 1}organizacion`] ||
                            errors[`sem${index + 1}estrategias`] ||
                            errors[`sem${index + 1}evidencias`] ||
                            errors[`sem${index + 1}instrumentos`] ||
                            errors[`sem${index + 1}nomSem`]
                            ? 'bg-red-100'
                            : ''
                            }`}
                        >
                          <td className="border w-10 border-gray-400 px-4 py-2 text-center">
                            Semana {index + 1}
                          </td>
                          <td className="border w-70 border-gray-400 px-4 py-2">
                            <textarea
                              placeholder="Escribir aquí"
                              value={
                                selectedCarga?.silabo?.semanas?.[index]
                                  ?.organizacion || ''
                              }
                              onChange={(e) =>
                                handleChange2(e, index, 'organizacion')
                              }
                              className="border w-full p-2 h-65 resize-y text-justify"
                            />
                            {errors[`sem${index + 1}organizacion`] && (
                              <p className="text-red-500">
                                {errors[`sem${index + 1}organizacion`]}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-400 px-4 py-2">
                            <textarea
                              placeholder="Escribir aquí"
                              value={
                                selectedCarga?.silabo?.semanas?.[index]
                                  ?.estrategias || ''
                              }
                              onChange={(e) =>
                                handleChange2(e, index, 'estrategias')
                              }
                              className="border w-full p-2 h-65 resize-y text-justify"
                            />
                            {errors[`sem${index + 1}estrategias`] && (
                              <p className="text-red-500">
                                {errors[`sem${index + 1}estrategias`]}
                              </p>
                            )}
                          </td>
                          <td className="border w-50 border-gray-400 px-4 py-2">
                            <textarea
                              placeholder="Escribir aquí"
                              value={
                                selectedCarga?.silabo?.semanas?.[index]
                                  ?.evidencias || ''
                              }
                              onChange={(e) =>
                                handleChange2(e, index, 'evidencias')
                              }
                              className="border w-full p-2 h-65 resize-y text-justify"
                            />
                            {errors[`sem${index + 1}evidencias`] && (
                              <p className="text-red-500">
                                {errors[`sem${index + 1}evidencias`]}
                              </p>
                            )}
                          </td>
                          <td className="border w-40 border-gray-400 px-4 py-2">
                            <textarea
                              placeholder="Escribir aquí"
                              value={
                                selectedCarga?.silabo?.semanas?.[index]
                                  ?.instrumentos || ''
                              }
                              onChange={(e) =>
                                handleChange2(e, index, 'instrumentos')
                              }
                              className="border w-full p-2 h-65 resize-y text-justify"
                            />
                            {errors[`sem${index + 1}instrumentos`] && (
                              <p className="text-red-500">
                                {errors[`sem${index + 1}instrumentos`]}
                              </p>
                            )}
                          </td>
                          <td className="border w-35 border-gray-400 px-4 py-2">
                            <textarea
                              placeholder="Escribir aquí"
                              value={
                                selectedCarga?.silabo?.semanas?.[index]
                                  ?.nomSem || ''
                              }
                              onChange={(e) =>
                                handleChange2(e, index, 'nomSem')
                              }
                              className="border w-full py-2 h-65 resize-y text-justify"
                            />
                            {errors[`sem${index + 1}nomSem`] && (
                              <p className="text-red-500">
                                {errors[`sem${index + 1}nomSem`]}
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {currentStep === 5 && (
                <div>
                  <label className="text-3xl font-bold">
                    Metodología de Evaluación
                  </label>
                  <br />
                  <div className="grid grid-cols-2 gap-4">
                    {/* Columna 1 */}
                    <div>
                      <label className="text-xl font-bold">
                        Capacidades Terminales
                      </label>
                      <textarea
                        placeholder="Escribir aqui la información de la Unidad de Competencia"
                        value={selectedCarga?.silabo?.sistemaevaluacion}
                        onChange={(e) => handleChange(e, 'sistemaevaluacion')}
                        className="border text-justify text-xl p-2 w-full h-70 resize-y"
                      />
                      {errors.sistemaevaluacion && (
                        <p className="text-red-500">
                          {errors.sistemaevaluacion}
                        </p>
                      )}
                    </div>

                    {/* Columna 2 */}
                    <div>
                      <label className="text-xl font-bold">
                        Resultados de Aprendizajes
                      </label>
                      <textarea
                        placeholder="Escribir aqui la información de la Unidad de Competencia"
                        value={selectedCarga?.silabo?.infosistemaevaluacion}
                        onChange={(e) =>
                          handleChange(e, 'infosistemaevaluacion')
                        }
                        className="border text-justify text-xl p-2 w-full h-70 resize-y"
                      />
                      {errors.infosistemaevaluacion && (
                        <p className="text-red-500">
                          {errors.infosistemaevaluacion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 6 && (
                <div>
                  <textarea
                    placeholder="Especificar aqui la informacion de las tutorias"
                    value={selectedCarga?.silabo?.tutoria}
                    onChange={(e) => handleChange(e, 'tutoria')} // Especifica el campo a actualizar
                    className="border text-justify text-xl p-2 w-full h-40 resize-y"
                  />
                  {errors.tutoria && (
                    <p className="text-red-500">{errors.tutoria}</p>
                  )}
                </div>
              )}
              {currentStep === 7 && (
                <div>
                  <br />

                  {/* Sticky: Botón para añadir referencias */}
                  <div className="sticky top-4 bg-white shadow-md p-4 rounded w-full">
                    <label className="text-lg font-bold">
                      Añadir Nueva Referencia
                    </label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="text"
                        placeholder="Escribe la referencia en formato APA"
                        value={newReference}
                        onChange={(e) => setNewReference(e.target.value)}
                        className="border text-xl p-2 w-full"
                      />
                      <button
                        type="button"
                        onClick={addReference}
                        className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Columna 1 (Referencias Bibliográficas) */}
                    <div className="w-full">
                      <label className="text-xl font-bold">
                        Referencias Bibliográficas
                      </label>
                      <textarea
                        placeholder="Escribir aquí las referencias en formato APA"
                        value={selectedCarga?.silabo?.referencias || ''}
                        onChange={(e) => handleChange(e, 'referencias')}
                        className="border text-justify text-xl p-2 w-full h-70 resize-y"
                      />
                      {errors.referencias && (
                        <p className="text-red-500">{errors.referencias}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 8 && (
                <div>
                  {/* Botón para Crear el Sílabo Académico */}
                  <div className="flex flex-col items-center mt-8">
                    <img
                      src={Silabos}
                      alt="Logo Crear"
                      className="w-40 h-40 mb-4 mt-2"
                    />
                    <button
                      onClick={() => setShowModal(true)} // Muestra el modal al hacer clic
                      className="flex items-center text-white bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full shadow-lg font-bold text-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Listo... Crear y/o actualizar mi Sílabo Actual para revisión
                    </button>
                  </div>

                  {/* Modal de Confirmación */}
                  {showModal && (
                    <div className="fixed inset-0  flex justify-center items-center z-50">
                      <div className="bg-white p-8 border rounded-lg shadow-2xl w-[90%] max-w-lg transform transition-transform animate-fadeIn">
                        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
                          Confirmar Registro
                        </h2>
                        <p className="mb-6 text-center text-gray-600">
                          ¿Estás seguro de que deseas enviar estos registros
                          con la información actual?
                        </p>
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={() => setShowModal(false)} // Cierra el modal
                            className="text-gray-700 bg-gray-100 border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleCreateSilabo} // Llama a la función de confirmación
                            className="text-white bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-green-300"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className={`px-4 py-2 text-white bg-blue-600 rounded-lg ${currentStep === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-500'
                  }`}
                disabled={currentStep === 0}
              >
                Anterior
              </button>
              <button
                onClick={nextStep}
                className={`px-4 py-2 text-white bg-blue-600 rounded-lg ${currentStep === steps.length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-500'
                  }`}
                disabled={currentStep === steps.length - 1}
              >
                Siguiente
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => { closeModal(); setnum(0); }}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 w-full"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
