import React, { useEffect, useState } from 'react';
import { getMisCursos, CargaDocente, enviarinfoSilabo } from '@/pages/services/silabo.services';
import { FaFileAlt, FaCheck, FaEye, FaDownload, FaExclamationTriangle } from "react-icons/fa"; // Íconos de React Icons
import ReactQuill from 'react-quill';
import Quill from "quill";


import Swal from "sweetalert2";

import "quill/dist/quill.snow.css";


import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Eye } from 'lucide-react';
// Componente Modal para mostrar contenido HTML



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



    const [isModalOpen, setIsModalOpen] = useState(false);
    const [htmlContent, setHtmlContent] = useState("");

    const handleClick = (carga: any) => {
        // Verificar el estado del silabo y manejar la acción

        setHtmlContent(carga.curso?.documento || ""); // Asigna el contenido HTML al estado
        setIsModalOpen(true); // Abre el modal
        
        if (carga.curso?.estado_silabo === "No hay silabo") {
            modal(carga, 1); // Muestra "Enviar" y "Cerrar"
        }
        
        if (carga.curso?.estado_silabo === "En espera de aprobación") {
            modal2(carga, 2); // Solo muestra "Cerrar"
        }
        
        if (carga.curso?.estado_silabo === "Aprobado") {
            modal2(carga, 2); // Solo muestra "Cerrar"
        }
        
        if (carga.curso?.estado_silabo === "Rechazado") {
            modal2(carga, 3); // Muestra "Enviar" y "Cerrar"
        }
        
        if (carga.curso?.estado_silabo === "Inactivo") {
            modal2(carga, 2); // Solo muestra "Cerrar"
        }
        
        

    };

    const modal = async (carga: any, numero: number) => {
        let htmlContent = ""; // Contenido HTML inicial

        try {
            if (numero === 1) {
                // Contenido con celdas compartidas y bordes, con padding
                htmlContent = `
                    <h2 style="text-align: center;">Documento con Celdas Compartidas</h2>
                    <table class="table" style="width: 100%; border-collapse: collapse; text-align: center; border: 1px solid black;">
                        <tr>
                            <th colspan="2" class="cell-shared-horizontal" data-colspan="2" style="border: 1px solid black; padding: 8px;">Encabezado Compartido</th>
                            <th style="border: 1px solid black; padding: 8px;">Celda 3</th>
                        </tr>
                        <tr>
                            <td rowspan="2" class="cell-shared-vertical" data-rowspan="2" style="border: 1px solid black; padding: 8px;">Celda Vertical</td>
                            <td style="border: 1px solid black; padding: 8px;">Celda 4</td>
                            <td style="border: 1px solid black; padding: 8px;">Celda 5</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid black; padding: 8px;">Celda 6</td>
                            <td style="border: 1px solid black; padding: 8px;">Celda 7</td>
                        </tr>
                    </table>
                `;
            }

            if (!htmlContent) {
                Swal.fire("Error", "No se pudo generar el contenido HTML.", "error");
                return;
            }
        } catch (error) {
            console.error("Error al generar el contenido HTML:", error);
            Swal.fire("Error", "No se pudo generar el contenido HTML.", "error");
            return;
        }

        Swal.fire({
            title: "Editar Documento",
            html: `<div id="ckeditor-container" style="height: 400px; border: 1px solid #ccc;"></div>`,
            showCancelButton: true,
            confirmButtonText: "Guardar Cambios",
            cancelButtonText: "Cancelar",
            didOpen: () => {
                const editorContainer = document.querySelector("#ckeditor-container") as HTMLElement;
                if (editorContainer) {
                    ClassicEditor.create(editorContainer, {
                        toolbar: [
                            "bold",
                            "italic",
                            "underline",
                            "|",
                            "insertTable",
                            "|",
                            "undo",
                            "redo",
                        ],
                        table: {
                            contentToolbar: [
                                "tableColumn",
                                "tableRow",
                                "mergeTableCells",
                                "tableProperties",
                                "tableCellProperties",
                            ],
                        },
                    })
                        .then((editor) => {
                            editor.setData(htmlContent);
                            (window as any).editor = editor;
                        })
                        .catch((error) => {
                            console.error("Error al inicializar CKEditor:", error);
                        });
                }
            },
            preConfirm: async () => {
                const editor = (window as any).editor;
                if (editor) {
                    return editor.getData();
                }
                return null;
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedContent = result.value;
                if (!updatedContent) {
                    Swal.fire("Error", "No se pudo obtener el contenido editado.", "error");
                    return;
                }

                // Llamar a SubmitCarga y enviar el contenido HTML directamente
                await SubmitCarga(carga, numero, updatedContent);
            }
        });
    };
    
    const modal2 = async (carga: CargaDocente, numero: number) => {
        const observacionesText = numero === 2 || numero === 1 ? carga.curso?.observaciones || "" : ""; // Observaciones solo para números 1 o 2
        const showEnviarButton = numero === 1 || numero === 3; // Mostrar "Enviar" solo cuando el número sea 1 o 3
        const showCerrarButton = true; // Siempre mostrar "Cerrar"
        let editorInstance: any; // Variable para guardar la instancia de CKEditor
    
        Swal.fire({
            title: "Detalles del Sílabo",
            html: `
                <div style="display: flex; flex-direction: row; gap: 20px; align-items: stretch; max-height: 80vh; overflow: hidden;">
                    <!-- Información del curso -->
                    <div style="flex: 1; text-align: left; line-height: 1.5; min-width: 300px; max-width: 400px; overflow-y: auto;">
                        <p><strong>ID Curso:</strong> ${carga.idCurso}</p>
                        <p><strong>Curso:</strong> ${carga.curso?.name}</p>
                        <p><strong>Docente:</strong> ${carga.nomdocente} ${carga.apedocente}</p>
                        <p><strong>Filial:</strong> ${carga.filial?.name}</p>
                        <p><strong>Semestre Académico:</strong> ${carga.semestre_academico?.nomSemestre}</p>
                        <p><strong>Estado del Sílabo:</strong> ${carga.curso?.estado_silabo}</p>
                        ${
                            numero === 2 || numero === 1
                                ? `<p><strong>Observaciones:</strong> ${carga.curso?.observaciones || "Sin observaciones registradas"}</p>`
                                : ""
                        }
                        <textarea 
                            id="observaciones" 
                            placeholder="Observaciones del director de escuela..." 
                            style="width: 100%; height: 100px; margin-top: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 4px;" 
                            ${numero === 2 || numero === 3 ? "disabled" : ""} 
                        >${observacionesText}</textarea>
                    </div>
                    <!-- Editor CKEditor -->
                    <div style="flex: 2; display: flex; flex-direction: column; gap: 10px; border: 1px solid #ccc; border-radius: 4px; padding: 10px; min-height: 400px; overflow-y: auto;">
                        <div id="ckeditor-container" style="flex: 1; min-height: 400px; max-height: 400px;">
                            <!-- CKEditor será inicializado aquí -->
                        </div>
                    </div>
                </div>
            `,
            width: 900, // Ajustar el ancho total del modal
            showConfirmButton: showEnviarButton, // Mostrar "Enviar" solo cuando el número sea 1 o 3
            showDenyButton: showCerrarButton, // Siempre mostrar "Cerrar"
            confirmButtonText: "Enviar", // Texto del botón de confirmación
            denyButtonText: "Cerrar", // Texto del botón de cierre
            focusConfirm: false,
            didOpen: () => {
                // Inicializar CKEditor cuando el modal esté abierto
                const ckEditorContainer = document.getElementById("ckeditor-container");
                if (ckEditorContainer) {
                    ClassicEditor.create(ckEditorContainer)
                        .then((editor) => {
                            // Establecer el contenido inicial desde `carga.curso?.documento`
                            if (carga.curso?.documento) {
                                editor.setData(carga.curso.documento);
                            }
                            editorInstance = editor; // Guardar la instancia del editor
                        })
                        .catch((error) => {
                            console.error("Error al inicializar CKEditor:", error);
                        });
                }
            },
            preConfirm: () => {
                // Obtener el contenido actualizado del editor
                if (editorInstance) {
                    const updatedContent = editorInstance.getData(); // Obtener el contenido HTML del editor
                    return updatedContent; // Devolver el contenido actualizado para usarlo en `then`
                }
                return null;
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updatedContent = result.value; // Contenido HTML del editor
                if (updatedContent) {
                    // Llamar a la función SubmitCarga con el contenido actualizado
                    await SubmitCarga(carga, 1, updatedContent);
                }
            }
        });
    };
    

    
    




    // Modificación de SubmitCarga para enviar solo el contenido HTML
    const SubmitCarga = async (carga: any, numero: number, htmlContent: string) => {
        if (numero === 1 && htmlContent) {
            try {
                // Asegurarnos de que los campos de carga no sean undefined o null antes de usarlos
                const idCargaDocente = carga.idCargaDocente ?? "0";  // Si es undefined o null, asignar "0"
                const idDocente = carga.idDocente ?? "0";
                const idFilial = carga.idFilial ?? "0";
                const idDirector = carga.idDirector ?? "0";
                const numeroStr = numero ?? "0";  // Asignar valor predeterminado "0" si no está definido
                console.log("html", htmlContent);

                // Crear un objeto con los datos a enviar
                const data = {
                    idCargaDocente: idCargaDocente,
                    idDocente: idDocente,
                    idFilial: idFilial,
                    idDirector: idDirector,
                    numero: numeroStr,
                    documentoHtml: htmlContent,  // Enviar el HTML en lugar del PDF
                };
                console.log("Información del sílabo enviada correctamente:", data);

                // Llamar a la función enviarinfoSilabo para enviar los datos
                const response = await enviarinfoSilabo(data);
                console.log("Información del sílabo enviada correctamente:", response);

                // Disparar el estado para que se actualice el useEffect
                setShouldUpdate((prev) => !prev);

            } catch (error) {
                console.error("Error al manejar la carga:", error);
                alert(`Hubo un problema al crear/verificar la estructura o manejar el documento. Error: ${error.message}`);
            }
        } else {
            console.log("Número no válido o contenido HTML no proporcionado.");
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
                        <tr className="bg-blue-700">
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
                                            ${carga.curso?.estado_silabo === "No hay silabo" ? "bg-blue-500 hover:bg-blue-600" : ""}
                                            ${carga.curso?.estado_silabo === "Confirmar envio de silabo" ? "bg-green-500 hover:bg-green-600" : ""}
                                            ${carga.curso?.estado_silabo === "En espera de aprobación" ? "bg-purple-500 hover:bg-purple-600" : ""}
                                            ${carga.curso?.estado_silabo === "Aprobado" || carga.curso?.estado_silabo === "Inactivo" ? "bg-green-500 hover:bg-green-600" : ""}`}
                                            onClick={() => handleClick(carga)} // Pasar `carga` a la función handleClick
                                        >
                                            {carga.curso?.estado_silabo === "No hay silabo" && (
                                                <>
                                                    <FaExclamationTriangle /> Generar Esquema
                                                </>
                                            )}
                                            {carga.curso?.estado_silabo === "En espera de aprobación" && (
                                                <>
                                                    <FaEye /> Observar Sílabo
                                                </>
                                            )}
                                            {carga.curso?.estado_silabo === "Rechazado" && (
                                                <>
                                                    <FaEye /> Corregir envio
                                                </>
                                            )}
                                            {carga.curso?.estado_silabo === "Confirmar envio de silabo" && (
                                                <a
                                                    onClick={() => {
                                                        modal2(carga); // Acción para confirmar envío
                                                    }}
                                                    rel="noopener noreferrer"
                                                    className="text-white no-underline flex items-center gap-2"
                                                >
                                                    <FaFileAlt /> Ver Documento
                                                </a>
                                            )}
                                            {carga.curso?.estado_silabo === "Aprobado" && (
                                                <>
                                                    <Eye /> Ver
                                                </>
                                            )}
                                            {carga.curso?.estado_silabo === "Inactivo" && (
                                                <>
                                                    <Eye /> Ver
                                                </>
                                            )}
                                        </button>




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
