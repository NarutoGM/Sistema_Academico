import React, { useEffect, useState } from 'react';
import { getMisCursos, CargaDocente } from '@/pages/services/silabo.services';
import './estilos.css';
import LogoCrear from '../../images/logo/crearsilabo.png';
import LogoReutilizar from '../../images/logo/reutilizarsilabo.png';

const Index: React.FC = () => {
    const [cargaDocente, setCargaDocente] = useState<CargaDocente[]>([]);
    const [filteredData, setFilteredData] = useState<CargaDocente[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedCarga, setSelectedCarga] = useState<CargaDocente | null>(null);
    const [isFlipped, setIsFlipped] = useState(false); // Controla la transición entre las caras
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla si el modal1 está abierto

    const [isModalOpen2, setIsModalOpen2] = useState(false); // Controla si el modal2 está abierto


    const [modalContent, setModalContent] = useState<string>(''); // Contenido del modal
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

    const openModal = (content: string) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const openModal2 = (content: string) => {
        setModalContent(content);
        setIsModalOpen2(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const closeModal2 = () => {
        setIsModalOpen2(false);
    };

    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { label: "Paso 1", content: "Contenido del Paso 1" },
        { label: "Paso 2", content: "Contenido del Paso 2" },
        { label: "Paso 3", content: "Contenido del Paso 3" },
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };


    return (
        <div className="card-container">

            <div className={`card ${isFlipped ? 'flipped' : ''}`}>
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
                <div className="card-face back bg-gray-100 shadow-lg rounded-lg flex flex-col  items-center p-6">

                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Curso Seleccionado</h3>
                    <p className="text-gray-600 text-center text-4xl font-bold mb-6">
                        {selectedCarga?.curso?.name || 'Sin nombre'}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {/* Opción: Crear un nuevo sílabo */}
                        <div
                            onClick={() =>
                                openModal('Crear un nuevo sílabo para el curso ' + selectedCarga?.curso?.name)
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
                                openModal2('Reutilizar un sílabo ya creado para el curso ' + selectedCarga?.curso?.name)
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
                        <h2 className="text-6xl font-bold mb-12">Información</h2>
                        <p className="text-2xl mb-8">{modalContent}</p>
                        <button onClick={closeModal2} className="px-8 py-4 bg-blue-600 text-white text-2xl rounded-lg hover:bg-blue-500" >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}


            {isModalOpen && (

                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-3xl w-full">
                        <h2 className="text-3xl font-bold mb-6 text-center">Información</h2>

                        {/* Tabs Header */}
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`flex-1 text-center cursor-pointer ${index <= currentStep ? "text-blue-600 font-bold" : "text-gray-400"
                                        }`}
                                    onClick={() => setCurrentStep(index)}
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
                        <div className="mb-6 text-center">
                            <p className="text-xl">{steps[currentStep].content}</p>
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
                                className={`px-4 py-2 text-white bg-blue-600 rounded-lg ${currentStep === steps.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
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