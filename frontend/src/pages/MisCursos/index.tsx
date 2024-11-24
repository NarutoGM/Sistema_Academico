import React, { useEffect, useState } from 'react';
import { getMisCursos, CargaDocente } from '@/pages/services/silabo.services';
import './estilos.css';
import LogoCrear from '../../images/logo/crearsilabo.png';
import LogoReutilizar from '../../images/logo/reutilizarsilabo.png';
import moment from 'moment'; // O cualquier otra librería de manejo de fechas que prefieras

const Index: React.FC = () => {
    const [cargaDocente, setCargaDocente] = useState<CargaDocente[]>([]);
    const [filteredData, setFilteredData] = useState<CargaDocente[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isFlipped, setIsFlipped] = useState(false); // Controla la transición entre las caras
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla si el modal1 está abierto

    const [isModalOpen2, setIsModalOpen2] = useState(false); // Controla si el modal2 está abierto

    const [selectedCarga, setSelectedCarga] = useState<CargaDocente>();


    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getMisCursos()
            .then((data) => {
                setCargaDocente(data.cargadocente);
                setFilteredData(data.cargadocente);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openModal2 = () => {
        setIsModalOpen2(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const closeModal2 = () => {
        setIsModalOpen2(false);
    };

    const [currentStep, setCurrentStep] = useState(0);






    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };



    const steps = [
        { label: "Datos Básicos", content: "" },
        { label: "Sumilla Academica", content: "Escriba la sumilla requerida." },
        { label: "Competencias academicas", content: "Defina las competencia asociada a cada Contexto." },
        { label: "Capacidades Terminales y Resultados de Aprendizajes", content: "Defina aquí la programación academica del curso" },
        { label: "Semanas programadas", content: "Defina aquí el contenido de cada semana asi como tambien los metodos de evaluación" },

    ];


    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
        const newValue = e.target.value;

        setSelectedCarga((prevCarga) => ({
            ...prevCarga,
            silabo: {
                ...prevCarga.silabo,
                [field]: newValue, // Actualiza dinámicamente el campo correspondiente
            },
        }));
    };

    const handleChange2 = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, field: string) => {
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

    }

    const [errors, setErrors] = useState<Errors>({});

    const validateStep = () => {
        const newErrors: Errors = {};


        if (currentStep === 0) {
        }
        if (currentStep === 1) {
            if (!selectedCarga?.silabo?.sumilla) newErrors.sumilla = "La sumilla es obligatoria";
        }
        if (currentStep === 2) {
            if (!selectedCarga?.silabo?.unidadcompetencia) newErrors.unidadcompetencia = "La competencia es obligatoria";
        }
        if (currentStep === 2) {
            if (!selectedCarga?.silabo?.competenciasgenerales) newErrors.competenciasgenerales = "La competencia es obligatoria";
        }
        if (currentStep === 2) {
            if (!selectedCarga?.silabo?.resultados) newErrors.resultados = "La competencia es obligatoria";
        }
        if (currentStep === 3) {
            if (!selectedCarga?.silabo?.resultadosaprendizajes1) newErrors.resultadosaprendizajes1 = "El resultado de aprendizaje de la unidad I es obligatorio";
            if (!selectedCarga?.silabo?.resultadosaprendizajes2) newErrors.resultadosaprendizajes2 = "El resultado de aprendizaje de la unidad II es obligatorio";
            if (!selectedCarga?.silabo?.resultadosaprendizajes3) newErrors.resultadosaprendizajes3 = "El resultado de aprendizaje de la unidad III es obligatorio";
            if (!selectedCarga?.silabo?.capacidadesterminales1) newErrors.capacidadesterminales1 = "Las capacidades terminales de la unidad I es obligatorio";
            if (!selectedCarga?.silabo?.capacidadesterminales2) newErrors.capacidadesterminales2 = "Las capacidades terminales de la unidad II es obligatorio";
            if (!selectedCarga?.silabo?.capacidadesterminales3) newErrors.capacidadesterminales3 = "Las capacidades terminales de la unidad III es obligatorio";

        }
        if (currentStep === 4) {
            const newErrors: { [key: string]: string } = {}; // Declarar newErrors con un tipo explícito
            const semanas = selectedCarga?.silabo?.semanas || [];

            for (let i = 0; i < 16; i++) {
                if (!semanas[i]?.organizacion) {
                    newErrors[`sem${i + 1}organizacion`] = `El resultado de aprendizaje o capacidades terminales de la semana ${i + 1} es obligatorio`;
                }
            }


        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return ''; // Manejar caso de fecha vacía
        const date = new Date(dateString);
        return moment(date).format('YYYY-MM-DD'); // Formato año-mes-día
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
                                    <th className="px-4 py-2 border-b font-medium text-white">Código</th>
                                    <th className="px-4 py-2 border-b font-medium text-white">Curso</th>
                                    <th className="px-4 py-2 border-b font-medium text-white">Filial</th>
                                    <th className="px-4 py-2 border-b font-medium text-white">Semestre</th>
                                    <th className="px-4 py-2 border-b font-medium text-white">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((carga) => (
                                    <tr key={carga.idCargaDocente} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 border-b text-center">{carga.idCurso}</td>
                                        <td className="px-4 py-2 border-b text-center">{carga.curso?.name}</td>
                                        <td className="px-4 py-2 border-b text-center">{carga.filial?.name}</td>
                                        <td className="px-4 py-2 border-b text-center">{carga.semestre_academico?.nomSemestre}</td>
                                        <td className="px-4 py-2 border-b text-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedCarga(carga);
                                                    setIsFlipped(true); // Gira la tarjeta
                                                }}
                                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                            >
                                                Gestión de sílabos
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

                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Curso Seleccionado</h3>
                    <p className="text-gray-600 text-center text-4xl font-bold mb-6">
                        {selectedCarga?.curso?.name || 'Sin nombre'}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {/* Opción: Crear un nuevo sílabo */}
                        <div
                            onClick={() =>
                                openModal()
                            }
                            className="flex flex-col items-center bg-white border rounded-lg shadow-lg p-6 w-96 cursor-pointer transition transform hover:scale-105 hover:shadow-xl relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 rounded-t-lg"></div>
                            <img src={LogoCrear} alt="Logo Crear" className="w-20 h-20 mb-4 mt-2" />
                            <h3 className="text-xl font-bold text-gray-700">Crear un nuevo sílabo</h3>
                        </div>

                        {/* Opción: Reutilizar un sílabo */}
                        <div
                            onClick={() =>

                                openModal2()
                            }
                            className="flex flex-col items-center bg-white border rounded-lg shadow-lg p-6 w-96 cursor-pointer transition transform hover:scale-105 hover:shadow-xl relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-green-500 rounded-t-lg"></div>
                            <img src={LogoReutilizar} alt="Logo Reutilizar" className="w-20 h-20 mb-4 mt-2" />
                            <h3 className="text-xl font-bold text-gray-700">Utilizar un sílabo ya creado</h3>
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 z-50">
                    <div className="bg-white p-16 rounded-lg shadow-2xl max-w-full text-center">
                        <h2 className="text-6xl  font-bold mb-12">Información</h2>

                        {selectedCarga?.curso?.name || 'Sin nombre'}

                        <button onClick={closeModal2} className="px-8 py-4 bg-blue-600 text-white text-2xl rounded-lg hover:bg-blue-500" >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}


            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center   z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-7xl w-full">
                        <h2 className="text-3xl font-bold mb-6 text-center">{selectedCarga?.curso?.name}</h2>

                        {/* Tabs Header */}
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`flex-1 text-center cursor-pointer ${index <= currentStep ? "text-blue-600 font-bold" : "text-gray-400"
                                        }`}
                                    onClick={() => index <= currentStep && setCurrentStep(index)}
                                >
                                    <div
                                        className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200"
                                            }`}
                                    >
                                        {index < currentStep ? "✓" : index + 1}
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
                                            value={selectedCarga?.curso?.area?.nomArea || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Facultad:</label>
                                        <input
                                            type="text"
                                            placeholder="Facultad:"
                                            value={selectedCarga?.curso?.facultad?.nomFacultad || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Departamento Academico:</label>
                                        <input
                                            type="text"
                                            placeholder="Departamento Academico:"
                                            value={selectedCarga?.curso?.departamento?.nomDepartamento || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Programa de estudios:</label>
                                        <input
                                            type="text"
                                            placeholder="Programa de estudios:"
                                            value={selectedCarga?.escuela?.name || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Sede:</label>
                                        <input
                                            type="text"
                                            placeholder="Sede"
                                            value={selectedCarga?.filial?.name || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Ciclo:</label>
                                        <input
                                            type="text"
                                            placeholder="Ciclo"
                                            value={selectedCarga?.ciclo || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>


                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Código de la experiencia curricular :</label>
                                        <input
                                            type="text"
                                            placeholder="Código de la experiencia curricular"
                                            value={selectedCarga?.curso?.idCurso || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Sección o grupo :</label>
                                        <input
                                            type="text"
                                            placeholder="Sección o grupo"
                                            value={selectedCarga?.grupo || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Créditos :</label>
                                        <input
                                            type="text"
                                            placeholder="Créditos"
                                            value={selectedCarga?.curso?.creditos || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Requisitos :</label>
                                        <input
                                            type="text"
                                            placeholder="Requisitos"
                                            value={selectedCarga?.prerequisitos || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Inicio - Termino :</label>
                                        <input
                                            type="text"
                                            placeholder="Inicio - Termino"
                                            value={
                                                formatDate(selectedCarga?.semestre_academico?.fInicio ?? '') + ' al ' +
                                                formatDate(selectedCarga?.semestre_academico?.fTermino ?? '') || ""
                                            } readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Tipo :</label>
                                        <input
                                            type="text"
                                            placeholder="Tipo"
                                            value={selectedCarga?.curso?.tipo_curso?.descripcion || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>



                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Regimen :</label>
                                        <input
                                            type="text"
                                            placeholder="Regimen"
                                            value={selectedCarga?.curso?.regimen_curso?.nomRegimen || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Horas Teoricas :</label>
                                        <input
                                            type="text"
                                            placeholder="Horas Teoricas"
                                            value={selectedCarga?.curso?.hTeoricas || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Horas Practicas :</label>
                                        <input
                                            type="text"
                                            placeholder="Horas Practicas"
                                            value={selectedCarga?.curso?.hPracticas || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Horas de laboratorio :</label>
                                        <input
                                            type="text"
                                            placeholder="Horas de laboratorio"
                                            value={selectedCarga?.curso?.hLaboratorio || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Horas de Retrolaimentacion :</label>
                                        <input
                                            type="text"
                                            placeholder="Horas de retroalimentacion"
                                            value={selectedCarga?.curso?.hRetroalimentacion || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>


                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Apellidos y nombres del docente :</label>
                                        <input
                                            type="text"
                                            placeholder="Apellidos y nombres del docente :"
                                            value={selectedCarga?.nomdocente + ' ' + selectedCarga?.apedocente || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>


                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Profesión :</label>
                                        <input
                                            type="text"
                                            placeholder="Profesión"
                                            value={selectedCarga?.profesion || ""}
                                            readOnly
                                            className="border p-2 w-3/4 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>





                                    <div className="flex items-center space-x-4">
                                        <label className="w-1/4 text-gray-700">Correo institucional :</label>
                                        <input
                                            type="text"
                                            placeholder="Correo institucional"
                                            value={selectedCarga?.email || ""}
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
                                        onChange={(e) => handleChange(e, "sumilla")} // Especifica el campo a actualizar
                                        className="border text-justify text-xl p-2 w-full h-80 resize-y"
                                    />
                                    {errors.sumilla && <p className="text-red-500">{errors.sumilla}</p>}

                                </div>
                            )}
                            {currentStep === 2 && (
                                <div>
                                    <label className='text-3xl font-bold'>Unidad de Competencia:</label>
                                    <textarea
                                        placeholder="Escribir aqui la información de la Unidad de Competencia"
                                        value={selectedCarga?.silabo?.unidadcompetencia}
                                        onChange={(e) => handleChange(e, "unidadcompetencia")} // Especifica el campo a actualizar
                                        className="border text-justify text-xl p-2 w-full h-50 resize-y"
                                    />
                                    {errors.unidadcompetencia && (
                                        <p className="text-red-500">{errors.unidadcompetencia}</p>
                                    )}

                                    <label className='text-3xl font-bold'>Competencias Generales:</label>
                                    <textarea
                                        placeholder="Escribir aqui la información de las Competencias Generales"
                                        value={selectedCarga?.silabo?.competenciasgenerales}
                                        onChange={(e) => handleChange(e, "competenciasgenerales")} // Especifica el campo a actualizar
                                        className="border text-justify text-xl p-2 w-full h-25 resize-y"
                                    />
                                    {errors.competenciasgenerales && (
                                        <p className="text-red-500">{errors.competenciasgenerales}</p>
                                    )}

                                    <label className='text-3xl font-bold'>Resultados:</label>
                                    <textarea
                                        placeholder="Escribir aqui la información de los Resultados Esperados"
                                        value={selectedCarga?.silabo?.resultados}
                                        onChange={(e) => handleChange(e, "resultados")} // Especifica el campo a actualizar
                                        className="border text-justify text-xl p-2 w-full h-60 resize-y"
                                    />
                                    {errors.resultados && (
                                        <p className="text-red-500">{errors.resultados}</p>
                                    )}
                                </div>

                            )}

                            {currentStep === 3 && (
                                <div>
                                    <label className='text-3xl font-bold'>Unidad I</label>
                                    <br />
                                    <label className='text-xl font-bold'>Capacidades Terminales</label>

                                    <textarea
                                        placeholder="Escribir aqui la información de la Unidad de Competencia"
                                        value={selectedCarga?.silabo?.capacidadesterminales1}
                                        onChange={(e) => handleChange(e, "capacidadesterminales1")} // Especifica el campo a actualizar
                                        className="border text-justify text-xl p-2 w-full h-20 resize-y"
                                    />
                                    {errors.capacidadesterminales1 && (
                                        <p className="text-red-500">{errors.capacidadesterminales1}</p>
                                    )}
                                    <label className='text-xl font-bold'>Resultados de Aprendizajes</label>
                                    <textarea
                                        placeholder="Escribir aqui la información de la Unidad de Competencia"
                                        value={selectedCarga?.silabo?.resultadosaprendizajes2}
                                        onChange={(e) => handleChange(e, "resultadosaprendizajes2")} // Especifica el campo a actualizar
                                        className="border text-justify text-xl p-2 w-full h-40 resize-y"
                                    />
                                    {errors.resultadosaprendizajes2 && (
                                        <p className="text-red-500">{errors.resultadosaprendizajes2}</p>
                                    )}
                                    <label className='text-3xl font-bold'>Unidad II</label>
                                    <br />
                                    <label className='text-xl font-bold'>Capacidades Terminales</label>

                                    <textarea
                                        placeholder="Escribir aqui la información de la Unidad de Competencia"
                                        value={selectedCarga?.silabo?.capacidadesterminales2}
                                        onChange={(e) => handleChange(e, "capacidadesterminales2")} // Especifica el campo a actualizar
                                        className="border text-justify text-xl p-2 w-full h-20 resize-y"
                                    />
                                    {errors.capacidadesterminales2 && (
                                        <p className="text-red-500">{errors.capacidadesterminales2}</p>
                                    )}
                                    <label className='text-xl font-bold'>Resultados de Aprendizajes</label>
                                    <textarea
                                        placeholder="Escribir aqui la información de la Unidad de Competencia"
                                        value={selectedCarga?.silabo?.resultadosaprendizajes2}
                                        onChange={(e) => handleChange(e, "unidadcompetencia")} // Especifica el campo a actualizar
                                        className="border text-justify text-xl p-2 w-full h-40 resize-y"
                                    />
                                    {errors.resultadosaprendizajes2 && (
                                        <p className="text-red-500">{errors.resultadosaprendizajes2}</p>
                                    )}
                                    <label className='text-3xl font-bold'>Unidad III</label>
                                    <br />
                                    <label className='text-xl font-bold'>Capacidades Terminales</label>

                                    <textarea
                                        placeholder="Escribir aqui la información de la Unidad de Competencia"
                                        value={selectedCarga?.silabo?.capacidadesterminales3}
                                        onChange={(e) => handleChange(e, "capacidadesterminales3")} // Especifica el campo a actualizar
                                        className="border text-justify text-xl p-2 w-full h-20 resize-y"
                                    />
                                    {errors.capacidadesterminales3 && (
                                        <p className="text-red-500">{errors.capacidadesterminales3}</p>
                                    )}
                                    <label className='text-xl font-bold'>Resultados de Aprendizajes</label>
                                    <textarea
                                        placeholder="Escribir aqui la información de la Unidad de Competencia"
                                        value={selectedCarga?.silabo?.resultadosaprendizajes3}
                                        onChange={(e) => handleChange(e, "resultadosaprendizajes3")} // Especifica el campo a actualizar
                                        className="border text-justify text-xl p-2 w-full h-40 resize-y"
                                    />
                                    {errors.resultadosaprendizajes3 && (
                                        <p className="text-red-500">{errors.resultadosaprendizajes3}</p>
                                    )}

                                </div>

                            )}

                            {currentStep === 4 && (
                                <div>
                                    <label className='text-3xl font-bold'>Semana 1</label>
                                    <br />
                                    <label className='text-xl font-bold'>Organización de Unidades de Contenidos </label>
                                    <label className='text-xl font-bold'>Estrategias Didáctica </label>
                                    <label className='text-xl font-bold'>Evidencias de Desempeño </label>
                                    <label className='text-xl font-bold'>Instrumentos de Evaluación </label>
                                    <label className='text-xl font-bold'>Semana </label>

                                    <textarea
                                        placeholder="Escribir aquí la información de la Unidad de Competencia"
                                        value={selectedCarga?.silabo?.semanas?.[0]?.organizacion || ''}
                                        onChange={(e) => handleChange2(e, 0, "organizacion")} // Se pasa el índice (0) y el campo ("organizacion")
                                        className="border text-justify text-xl p-2 w-full h-20 resize-y"
                                    />
                                    {errors.sem1organizacion && (
                                        <p className="text-red-500">{errors.sem1organizacion}</p>
                                    )}




                                </div>

                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            <button
                                onClick={prevStep}
                                className={`px-4 py-2 text-white bg-blue-600 rounded-lg ${currentStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
                                    }`}
                                disabled={currentStep === 0}
                            >
                                Anterior
                            </button>
                            <button
                                onClick={nextStep}
                                className={`px-4 py-2 text-white bg-blue-600 rounded-lg ${currentStep === steps.length - 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-blue-500"
                                    }`}
                                disabled={currentStep === steps.length - 1}
                            >
                                Siguiente
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={closeModal}
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