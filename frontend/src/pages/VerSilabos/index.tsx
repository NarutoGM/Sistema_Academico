import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getMisSilabos, CargaDocente, enviarinfoSilabodirector } from '@/pages/services/silabo.services';
import "quill/dist/quill.snow.css";
import { generarSilaboPDF } from '@/utils/pdfUtils';

const Index: React.FC = () => {
    const [cargaDocente, setCargaDocente] = useState<CargaDocente[]>([]);
    const [filteredData, setFilteredData] = useState<CargaDocente[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Filtros
    const [codigoCurso, setCodigoCurso] = useState('');
    const [curso, setCurso] = useState('');
    const [filial, setFilial] = useState('');
    const [semestre, setSemestre] = useState('');
    const [procesoSilabo, setProcesoSilabo] = useState('');
    const [docente, setDocente] = useState('');
    const [shouldUpdate, setShouldUpdate] = useState(false); // Estado para controlar la actualización

    useEffect(() => {
        getMisSilabos()
            .then((data) => {
                // Asegúrate de que TypeScript interprete correctamente los valores como CargaDocente[]
                const docenteArray = Object.values(data.cargadocente) as CargaDocente[];
                setCargaDocente(docenteArray);
                console.log(docenteArray);
                setFilteredData(docenteArray);

            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);



    useEffect(() => {
        const filtered = cargaDocente.filter(item => {
            const estadoSilabo = item.curso?.estado_silabo || "Curso por gestionar";
            const nombreDocente = `${item.nomdocente} ${item.apedocente}`.toLowerCase();
            return (
                (codigoCurso ? item.idCurso.toString().includes(codigoCurso) : true) &&
                (curso ? item.curso?.name.toLowerCase().includes(curso.toLowerCase()) : true) &&
                (filial ? item.filial?.name.toLowerCase().includes(filial.toLowerCase()) : true) &&
                (semestre ? item.semestre_academico?.nomSemestre.toLowerCase().includes(semestre.toLowerCase()) : true) &&
                (procesoSilabo ? estadoSilabo.toLowerCase().includes(procesoSilabo.toLowerCase()) : true) &&
                (docente ? nombreDocente.includes(docente.toLowerCase()) : true)
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [codigoCurso, curso, filial, semestre, procesoSilabo, docente, cargaDocente]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);



    const modal = (carga: CargaDocente, numero: number) => {
        const isEditable = numero === 1;
        const observacionesText = numero === 2 ? carga.silabo?.observaciones || "" : "";
    
        const getEstadoSilabo = (carga: CargaDocente) => {
            if (carga.estado === false) {
                return 'Inactivo';
            } else if (carga.silabo == null) {
                return 'Aún no envió silabo';
            } else {
                switch (carga.silabo.estado) {
                    case 1: return 'Por Revisar';
                    case 2: return 'Rechazado';
                    case 3: return 'Visado';
                    default: return 'Estado Desconocido';
                }
            }
        };
    
        const estadoSilabo = getEstadoSilabo(carga);
    
        Swal.fire({
            title: "Detalles del Sílabo",
            html: `
                <div style="display: flex; gap: 20px; align-items: flex-start;">
                    <div style="flex: 1; text-align: left; line-height: 1.5; margin-bottom: 20px; min-width: 300px;">
                        <p><strong>ID Curso:</strong> ${carga.idCurso}</p>
                        <p><strong>Curso:</strong> ${carga.curso?.name}</p>
                        <p><strong>Docente:</strong> ${carga.nomdocente} ${carga.apedocente}</p>
                        <p><strong>Filial:</strong> ${carga.filial?.name}</p>
                        <p><strong>Semestre Académico:</strong> ${carga.semestre_academico?.nomSemestre}</p>
                        ${numero === 2
                            ? `<p><strong>Observaciones:</strong> ${carga.silabo?.observaciones || "Sin observaciones registradas"}</p>`
                            : ""
                        }
                        <p>
                            <strong>Estado del Sílabo:</strong> ${estadoSilabo}
                        </p>
                        <textarea 
                            id="observaciones" 
                            placeholder="Escribe las observaciones aquí..." 
                            style="width: 100%; height: 300px; margin-top: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" 
                            ${!isEditable ? "disabled" : ""}
                        >${observacionesText}</textarea>
                    </div>
                    <div id="pdf-container" style="flex: 2; border: 1px solid #ccc; border-radius: 4px; overflow-y: auto; height: 600px; padding: 10px;">
                        <p>Cargando PDF...</p>
                    </div>
                </div>
            `,
            width: 1300,
            showCancelButton: true,
            showDenyButton: isEditable,
            showConfirmButton: isEditable,
            confirmButtonText: "Aceptar",
            denyButtonText: "Rechazar",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            didOpen: () => {
                // Generar el PDF y cargarlo en el iframe
                const pdfContainer = document.getElementById("pdf-container");
                if (pdfContainer) {
                    const pdfDataUri = generarSilaboPDF(carga, 2);
                    pdfContainer.innerHTML = `
                        <iframe 
                            src="${pdfDataUri}" 
                            style="width: 100%; height: 100%; border: none;" 
                            title="Sílabo PDF"
                        ></iframe>
                    `;
                }
            },
            preConfirm: () => {
                // Obtener el texto de las observaciones
                const observaciones = (document.getElementById("observaciones") as HTMLTextAreaElement)?.value || "";
                return { observaciones };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Si apruebas, llama a SubmitCarga con numero = 1
                const observaciones = result.value?.observaciones || "";
                await SubmitCarga(carga, 1, observaciones);
                Swal.fire("Éxito", "El sílabo ha sido aprobado.", "success");
            } else if (result.isDenied) {
                // Si desapruebas, llama a SubmitCarga con numero = 0
                const observaciones = (document.getElementById("observaciones") as HTMLTextAreaElement)?.value || "";
                await SubmitCarga(carga, 0, observaciones);
                Swal.fire("Rechazado", "El sílabo ha sido rechazado.", "error");
            }
        });
    };








    const SubmitCarga = async (carga: CargaDocente, numero: number, observaciones: string) => {
        const silaboData = {
            idCargaDocente: carga.idCargaDocente,
            idDocente: carga.idDocente,
            idFilial: carga.idFilial,
            numero: numero === 0 ? 1 : 2, // Establece el número basado en el valor de 'numero'
            observaciones: observaciones,
        };
    
        try {
            const response = await enviarinfoSilabodirector(silaboData);
            console.log("Información del sílabo enviada correctamente al director:", response);
            setShouldUpdate((prev) => !prev); // Cambia el estado para disparar el useEffect
        } catch (error) {
            console.error("Error al enviar la información del sílabo:", error);
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
                        className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
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
                    <input
                        type="text"
                        placeholder="Docente"
                        value={docente}
                        onChange={(e) => setDocente(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
                    />
                    <button
                        onClick={() => {
                            setCodigoCurso('');
                            setCurso('');
                            setFilial('');
                            setSemestre('');
                            setProcesoSilabo('');
                            setDocente('');
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
                            <th className="px-4 py-2 border-b font-medium text-white">Docente</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Filial</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Semestre</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Ciclo</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Estado</th>

                            <th className="px-4 py-2 border-b font-medium text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((carga) => (
                            <tr key={carga.idCargaDocente} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b text-center">{carga.idCurso}</td>
                                <td className="px-4 py-2 border-b text-center">{carga.curso?.name}</td>
                                <td className="px-4 py-2 border-b text-center">{`${carga.nomdocente} ${carga.apedocente}`}</td>
                                <td className="px-4 py-2 border-b text-center">{carga.filial?.name}</td>
                                <td className="px-4 py-2 border-b text-center">{carga.semestre_academico?.nomSemestre}</td>

                                <td className="px-4 py-2 border-b text-center">{carga.ciclo}</td>

                                <td className="px-4 py-2 border-b text-center">
                                    {
                                        carga.estado === false
                                            ? 'Inactivo'
                                            : (
                                                carga.silabo == null
                                                    ? 'Aún no envió silabo' // Verifica si silabo es null o undefined
                                                    : (
                                                        carga.silabo.estado === 1 ? 'Aún falta revisar'
                                                            : carga.silabo.estado === 2 ? 'Rechazado'
                                                                : carga.silabo.estado === 3 ? 'Aceptado'
                                                                    : 'Estado desconocido'
                                                    )
                                            )
                                    }
                                </td>





                                <td className="px-4 py-2 border-b text-center">

                                    
                                    <button onClick={() => {
                                        // Si carga.silabo es null, pasa carga, 2
                                        if (carga.silabo === null) {
                                            modal(carga, 2);
                                        } else if (carga.silabo?.estado === 1) {
                                            // Si el estado de carga.silabo es 1, pasa carga, 1
                                            modal(carga, 1);
                                        } else {
                                            // Para otros casos, pasa carga, 2
                                            modal(carga, 2);
                                        }
                                    }}>
                                        Revision Silabos
                                    </button>


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
