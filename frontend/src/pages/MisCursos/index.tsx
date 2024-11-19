import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getMisCursos, CargaDocente, enviarinfoSilabo } from '@/pages/services/silabo.services';
import { getAccessToken } from '@/pages/services/token.services';
import { generateDocument } from "./componentesilabo";
import { Packer, Document } from "docx";
import { saveAs } from "file-saver";
import { FaFileAlt, FaCheck, FaEye, FaDownload, FaExclamationTriangle } from "react-icons/fa"; // Íconos de React Icons
import { crearEstructuraCompleta } from '@/pages/services/modelodrive.services';

const Index: React.FC = () => {
    const [cargaDocente, setCargaDocente] = useState<CargaDocente[]>([]);
    const [filteredData, setFilteredData] = useState<CargaDocente[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filtros
    const [codigoCurso, setCodigoCurso] = useState('');
    const [curso, setCurso] = useState('');
    const [filial, setFilial] = useState('');
    const [semestre, setSemestre] = useState('');
    const [procesoSilabo, setProcesoSilabo] = useState('');
    const [shouldUpdate, setShouldUpdate] = useState(false); // Estado para controlar la actualización

    useEffect(() => {
        getMisCursos()
            .then((data) => {
                setCargaDocente(data.cargadocente);
                setFilteredData(data.cargadocente);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [shouldUpdate]); // Añade shouldUpdate como dependencia


    useEffect(() => {
        const filtered = cargaDocente.filter(item => {
            const estadoSilabo = item.curso?.estado_silabo || "Curso por gestionar";
            return (
                (codigoCurso ? item.idCurso.toString().includes(codigoCurso) : true) &&
                (curso ? item.curso?.name.toLowerCase().includes(curso.toLowerCase()) : true) &&
                (filial ? item.filial?.name.toLowerCase().includes(filial.toLowerCase()) : true) &&
                (semestre ? item.semestre_academico?.nomSemestre.toLowerCase().includes(semestre.toLowerCase()) : true) &&
                (procesoSilabo ? estadoSilabo.toLowerCase().includes(procesoSilabo.toLowerCase()) : true)
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [codigoCurso, curso, filial, semestre, procesoSilabo, cargaDocente]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleGenerateScheme = (carga: CargaDocente) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas generar el esquema del sílabo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, generar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await SubmitCarga(carga, 1); // Asegúrate de que esta llamada sea asincrónica
                Swal.fire(
                    "Generado!",
                    "El esquema del sílabo ha sido generado.",
                    "success"
                );
            }
        });
    };



    const SubmitCarga = async (carga: CargaDocente) => {
        const accessToken = await getAccessToken();

        try {
            // console.log(carga);
            // Genera el documento utilizando la función modularizada
            const doc = await generateDocument(carga); // Crear el documento en base a la carga
            const blob = await Packer.toBlob(doc); // Convertir el documento a un Blob para el manejo de archivos

            // Opcional: puedes guardar el Blob directamente como archivo si solo se necesita localmente
            //  saveAs(blob, "CargaDocente.docx");

            // Si es necesario subir el documento como parte de la estructura, conviértelo a un formato adecuado
            const file = new File([blob], "CargaDocente.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

            // Llamar al método que verifica o realiza la carga del archivo en la estructura remota

            const link = await crearEstructuraCompleta(carga, accessToken, file);
            console.log("Estructura y documento manejados correctamente");

            //   console.log(link);
            const silaboData = {
                documento: link, // URL o información del documento generado
                idCargaDocente: carga.idCargaDocente, // Asumiendo que `carga` tiene un `id`
                idDocente: carga.idDocente, // Información del docente
                idFilial: carga.idFilial, // Información del curso
                idDirector: carga.idDirector, // Información del curso

            };

            const response = await enviarinfoSilabo(silaboData);
            console.log("Información del sílabo enviada correctamente:", response);

            setShouldUpdate((prev) => !prev); // Cambiar el estado para disparar el useEffect


        } catch (error) {
            console.error("Error al manejar la carga:", error);
            alert("Hubo un problema al crear/verificar la estructura o manejar el documento.");
        }
    };






    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Listado de Carga Docente</h1>
            <h1 className="text-xl font-bold mb-4">Filtrar:</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-4 w-full">
                    <input
                        type="text"
                        placeholder="Código de Curso"
                        value={codigoCurso}
                        onChange={(e) => setCodigoCurso(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="Curso"
                        value={curso}
                        onChange={(e) => setCurso(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
                    />
                    <input
                        type="text"
                        placeholder="Filial"
                        value={filial}
                        onChange={(e) => setFilial(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
                    />
                    <input
                        type="text"
                        placeholder="Semestre"
                        value={semestre}
                        onChange={(e) => setSemestre(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
                    />
                    <input
                        type="text"
                        placeholder="Proceso Sílabos"
                        value={procesoSilabo}
                        onChange={(e) => setProcesoSilabo(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
                    />
                    <button
                        onClick={() => {
                            setCodigoCurso('');
                            setCurso('');
                            setFilial('');
                            setSemestre('');
                            setProcesoSilabo('');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded bg-green-500"
                    >
                        Reiniciar
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className='bg-blue-700'>
                            <th className="px-4 py-2 border-b font-medium text-white">Código</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Curso</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Filial</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Semestre</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Proceso Sílabos</th>
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
                                    {carga.curso?.estado_silabo}
                                </td>

                                <td className="px-4 py-2 border-b text-center">
                                    <div className="flex flex-col space-y-2">
                                        {/* Botón principal */}
                                        <button
                                            className={`flex items-center gap-2 px-2 py-1 rounded text-white 
        ${carga.curso?.estado_silabo === "Rechazado" ? "bg-red-500 hover:bg-red-600" : ""}
        ${carga.curso?.estado_silabo === "Aún falta generar esquema" ? "bg-blue-500 hover:bg-blue-600" : ""}
        ${carga.curso?.estado_silabo === "Confirmar envio de silabo" ? "bg-green-500 hover:bg-green-600" : ""}
        ${carga.curso?.estado_silabo === "En espera de aprobación" ? "bg-purple-500 hover:bg-purple-600" : ""}
        ${carga.curso?.estado_silabo === "Aprobado" || carga.curso?.estado_silabo === "Inactivo" ? "bg-green-500 hover:bg-green-600" : ""}`
                                            }
                                            onClick={() => {
                                                if (carga.curso?.estado_silabo === "Aún falta generar esquema") {
                                                    handleGenerateScheme(carga);
                                                } else if (carga.curso?.estado_silabo === "En espera de aprobación") {
                                                    alert("Esperando aprobación del sílabo.");
                                                } else if (carga.curso?.estado_silabo === "Aprobado" || carga.curso?.estado_silabo === "Inactivo") {
                                                    window.open(carga.curso?.documento, "_blank");
                                                }
                                            }}
                                        >
                                            {carga.curso?.estado_silabo === "Aún falta generar esquema" && (
                                                <>
                                                    <FaExclamationTriangle /> Generar Esquema
                                                </>
                                            )}
                                            {carga.curso?.estado_silabo === "En espera de aprobación" && (
                                                <>
                                                    <FaEye /> Observar Sílabo
                                                </>
                                            )}
                                            {carga.curso?.estado_silabo === "Confirmar envio de silabo" && (
                                                <a
                                                    href={carga.curso?.documento || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white no-underline flex items-center gap-2"
                                                >
                                                    <FaFileAlt /> Ver Documento
                                                </a>
                                            )}
                                            {carga.curso?.estado_silabo === "Aprobado" && (
                                                <>
                                                    <FaDownload /> Ver y Descargar
                                                </>
                                            )}
                                            {carga.curso?.estado_silabo === "Inactivo" && (
                                                <>
                                                    <FaDownload /> Ver y Descargar
                                                </>
                                            )}
                                        </button>

                                        {/* Botón adicional para Confirmar Envío */}
                                        {carga.curso?.estado_silabo === "Confirmar envio de silabo" && (
                                            <button
                                                className="flex items-center gap-2 px-2 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                                                onClick={() => {
                                                    alert("El envío del sílabo ha sido confirmado.");
                                                    // Aquí puedes agregar lógica adicional para manejar la confirmación
                                                }}
                                            >
                                                <FaCheck /> Confirmar Envío
                                            </button>
                                        )}
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Anterior
                </button>
                <span className="mx-2">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default Index;
