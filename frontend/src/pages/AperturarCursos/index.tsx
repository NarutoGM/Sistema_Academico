import React, { useEffect, useState, useRef } from 'react';
import { Pie, Bar } from 'react-chartjs-2'; // Importar gráfico de tipo Pie
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Registrar componentes de Chart.js
import Swal from 'sweetalert2';
import { getMisCursos, CargaDocente} from '@/pages/services/silabo.services';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
ChartJS.register(ArcElement, Tooltip, Legend);
import { useNavigate } from 'react-router-dom';


const Index: React.FC = () => {
    const [cargaDocente, setCargaDocente] = useState<CargaDocente[]>([]);
    const [filteredData, setFilteredData] = useState<CargaDocente[]>([]);
    const [codigoCurso, setCodigoCurso] = useState('');
    const [curso, setCurso] = useState('');
    const [semestre, setSemestre] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 5;
    const tableRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    

    useEffect(() => {
        getMisCursos()
            .then((data) => {
                // Asignar estado "Inactivo" a todos los cursos al cargar los datos
                const updatedData = data.cargadocente.map((course: CargaDocente) => ({
                    ...course,
                    estado: 'No aperturado',
                }));
                setCargaDocente(updatedData);
                setFilteredData(updatedData);
            })
            .catch((error) => {
                Swal.fire('Error', error.message, 'error');
            });
    }, []);

    useEffect(() => {
        const filtered = cargaDocente.filter(item => {
            return (
                (codigoCurso ? item.idCurso?.toString().includes(codigoCurso) : true) &&
                (curso ? item.curso?.name?.toLowerCase().includes(curso.toLowerCase()) : true) &&
                (semestre ? item.semestre_academico?.nomSemestre?.toLowerCase().includes(semestre.toLowerCase()) : true)
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [codigoCurso, curso, semestre, cargaDocente]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const [selectedCourses, setSelectedCourses] = useState<CargaDocente[]>([]);
    
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCourseSelect = (course: CargaDocente) => {
        setSelectedCourses((prevSelected) => {
            if (prevSelected.some(item => item.idCargaDocente === course.idCargaDocente)) {
                return prevSelected.filter(item => item.idCargaDocente !== course.idCargaDocente);
            }
            return [...prevSelected, { ...course }];
        });
    };

    const handleSaveSelectedCourses = () => {
        // Actualizar el estado de los cursos seleccionados
        const updatedCourses = cargaDocente.map(course => {
            if (selectedCourses.some(item => item.idCargaDocente === course.idCargaDocente)) {
                return { ...course, estado: 'Aperturado' };
            }
            return course;
        });
    
        setCargaDocente(updatedCourses);
        setFilteredData(updatedCourses);
        setSelectedCourses([]); // Limpiar los cursos seleccionados
        setIsModalOpen(false); // Cerrar el modal
        Swal.fire('Éxito', 'Cursos seleccionados activados', 'success');
    };

    const handleViewRequest = (rowData) => {
        navigate('/solicitud-apertura', { state: { curso: rowData } });
    };

    const filteredModalData = filteredData.filter(course => course.estado !== 'Aperturado');
    const activeCourses = filteredData.filter(course => course.estado !== 'No aperturado');
   
    const aperturadosCount = cargaDocente.filter(course => course.estado === 'Aperturado').length;
    const noAperturadosCount = cargaDocente.filter(course => course.estado === 'No aperturado').length;

    const chartData = {
        labels: ['Cursos Aperturados', 'Cursos No Aperturados'],
        datasets: [
            {
                data: [aperturadosCount, noAperturadosCount],
                backgroundColor: ['#4CAF50', '#F44336'], // Colores para las secciones
                hoverBackgroundColor: ['#66BB6A', '#E57373'],
            },
        ],
    };      

    const generatePDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const marginLeft = 10;
        let currentHeight = 10;

        const aperturados = cargaDocente.filter(course => course.estado === 'Aperturado');

        // Encabezado del PDF
        pdf.setFontSize(16);
        pdf.text("Reporte de Cursos", pageWidth / 2, currentHeight, { align: "center" });
        currentHeight += 10;

        pdf.setFontSize(12);
        pdf.text("Fecha: " + new Date().toLocaleDateString(), marginLeft, currentHeight);
        currentHeight += 10;

        if (aperturados.length === 0) {
            pdf.text("No hay cursos aperturados en este momento.", marginLeft, currentHeight);
        } else {
            // Agregar encabezados de la tabla
            pdf.setFontSize(10);
            pdf.text("Código", marginLeft, currentHeight);
            pdf.text("Curso", marginLeft + 30, currentHeight);
            pdf.text("Semestre", marginLeft + 150, currentHeight);
            currentHeight += 7;
    
            // Agregar filas de la tabla
            aperturados.forEach((course) => {
                pdf.text(course.idCurso?.toString() || "", marginLeft, currentHeight);
                pdf.text(course.curso?.name || "", marginLeft + 30, currentHeight);
                pdf.text(course.semestre_academico?.nomSemestre || "", marginLeft + 150, currentHeight);
                currentHeight += 7;
                
    
                // Crear una nueva página si el contenido excede la altura de la página
                if (currentHeight > pdf.internal.pageSize.getHeight() - 20) {
                    pdf.addPage();
                    currentHeight = 10;
                }
            });
        }
        // Pie de página
        pdf.setFontSize(10);
        pdf.text(
            "Generado automáticamente con el sistema",
            pageWidth / 2,
            pdf.internal.pageSize.getHeight() - 10,
            { align: "center" }
        );

        // Descargar PDF
        pdf.save('Listado-de-Cursos.pdf');
    };

    const abrirArchivo = () => {
        // Ruta al archivo en la carpeta public
        const archivoURL = `${window.location.origin}/Malla2018.pdf`;
        window.open(archivoURL, '_blank');
    };

    const handleRequest = (rowData) => {
        Swal.fire({
            title: 'Formato de Petición',
            html: `
                <div style="text-align: left;">
                    <p>Código del curso: ${rowData.idCurso}</p>
                    <p>Nombre del curso: ${rowData.curso.name}</p>
                    <p>Semestre: ${rowData.semestre_academico.nomSemestre}</p>
                    <p>Solicitud: Aperturar el curso para el semestre correspondiente.</p>
                </div>
            `,
            confirmButtonText: 'Aceptar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Éxito', 'La solicitud fue registrada correctamente.', 'success');
            }
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Listado de Cursos Aperturados</h1>
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Código de Curso"
                    value={codigoCurso}
                    onChange={(e) => setCodigoCurso(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/5"
                />
                <input
                    type="text"
                    placeholder="Curso"
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/3"
                />
                <input
                    type="text"
                    placeholder="Semestre"
                    value={semestre}
                    onChange={(e) => setSemestre(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/3"
                />
                <button
                    onClick={() => {
                        setCodigoCurso('');
                        setCurso('');
                        setSemestre('');
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Reiniciar
                </button>
                <button
                    onClick={generatePDF}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Generar PDF
                </button>
                <button
                    onClick={abrirArchivo}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Ver malla
                </button>
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Ver Cursos
                </button>
                {/* <button
                    onClick={navigate('/reporte-apertura')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Ver Reportes
                </button> */}
                    

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3">
                                <h2 className="text-xl font-bold mb-4">Cursos Disponibles</h2>
                                <div ref={tableRef} className="overflow-x-auto mb-4">
                                    <table className="min-w-full bg-white border border-gray-200">
                                        <thead>
                                            <tr className="bg-blue-700">
                                            <th className="px-4 py-2 border-b font-medium text-white">Seleccionar</th>
                                                <th className="px-4 py-2 border-b font-medium text-white">Código</th>
                                                <th className="px-4 py-2 border-b font-medium text-white">Curso</th>
                                                <th className="px-4 py-2 border-b font-medium text-white">Semestre</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredModalData.slice(indexOfFirstItem, indexOfLastItem).map((carga) => (
                                                <tr key={carga.idCargaDocente} className="hover:bg-gray-100">
                                                    <td className="px-4 py-2 border-b text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCourses.some(item => item.idCargaDocente === carga.idCargaDocente)}
                                                            onChange={() => handleCourseSelect(carga)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b text-center">{carga.idCurso}</td>
                                                    <td className="px-4 py-2 border-b text-center">{carga.curso?.name}</td>
                                                    <td className="px-4 py-2 border-b text-center">{carga.semestre_academico?.nomSemestre}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button
                                    onClick={handleSaveSelectedCourses}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Guardar Selección
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
            </div>

            <div ref={tableRef} className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-blue-700">
                            <th className="px-4 py-2 border-b font-medium text-white">Código</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Curso</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Estado</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeCourses.map((carga) => (
                            <tr key={carga.idCargaDocente} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b text-center">{carga.idCurso}</td>
                                <td className="px-4 py-2 border-b text-center">{carga.curso?.name}</td>
                                <td className="px-4 py-2 border-b text-center">{carga.estado}</td>
                                <td className="px-4 py-2 border-b text-center">
                                <button
                                    onClick={() => handleViewRequest(carga)}
                                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Ver Solicitud
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>            
        </div>
    );
};

export default Index;