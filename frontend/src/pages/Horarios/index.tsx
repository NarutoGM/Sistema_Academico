import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getCargaHorario, CargaDocente, guardarHorarios } from '@/pages/services/horario.services';
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
        getCargaHorario()
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

    const manejarGuardarHorarios = async (horarios: any[], idDocente: number, idCargaDocente: number, idFilial: number) => {
        try {
            await guardarHorarios(horarios, idDocente, idCargaDocente, idFilial);
            // Mostrar mensaje de éxito
            Swal.fire('Éxito', 'Los horarios se han guardado correctamente.', 'success');
        } catch (error) {
            // Manejar cualquier error
            console.error(error);
            Swal.fire('Error', 'Hubo un problema al guardar los horarios.', 'error');
        }
    };

    const modal1 = (carga: CargaDocente, numero: number) => {
        const isEditable = numero === 1;
        let horarios = carga.asignacion || [];
    
        // Renderiza la tabla de horarios
        const renderTablaHorarios = () => {
            const tabla = document.getElementById("tabla-horarios");
            if (tabla) {
                tabla.innerHTML = horarios
                    .map((asignacion, index) => `
                        <tr>
                            <td>${asignacion.tipoSesion}</td>
                            <td>${asignacion.grupo || "N/A"}</td>
                            <td>${asignacion.dia}</td>
                            <td>${asignacion.horaInicio}</td>
                            <td>${asignacion.horaFin}</td>
                            <td>${asignacion.aula || "N/A"}</td>
                            <td><button class="btn-delete" data-index="${index}">Eliminar</button></td>
                        </tr>
                    `)
                    .join("");
    
                // Agregar eventos de eliminación
                document.querySelectorAll(".btn-delete").forEach((btn) => {
                    btn.addEventListener("click", (e) => {
                        const index = parseInt((e.target as HTMLElement).getAttribute("data-index"));
                        horarios.splice(index, 1);
                        renderTablaHorarios();
                    });
                });
            }
        };
    
        Swal.fire({
            title: "Asignar Horarios",
            html: `
                <div>
                    <h4>Asignar Horarios</h4>
                    <!-- Select para escoger el tipo de sesión -->
                    <label for="tipo-sesion">Tipo de Sesión:</label>
                    <select id="tipo-sesion" class="swal2-input">
                        <option value="">Selecciona tipo de sesión</option>
                        ${carga.curso?.hTeoricas ? `<option value="Teoría">Teoría</option>` : ""}
                        ${carga.curso?.hPracticas ? `<option value="Práctica">Práctica</option>` : ""}
                        ${carga.curso?.hLaboratorio ? `<option value="Laboratorio">Laboratorio</option>` : ""}
                    </select>
    
                    <!-- Selección de día -->
                    <label for="dia">Día de la Semana:</label>
                    <select id="dia" class="swal2-input">
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                    </select>
    
                    <!-- Hora de inicio y fin -->
                    <label for="hora-inicio">Hora de Inicio:</label>
                    <input type="time" id="hora-inicio" class="swal2-input" style="width: 100%;" />
                    <label for="hora-fin">Hora de Fin:</label>
                    <input type="time" id="hora-fin" class="swal2-input" style="width: 100%;" />
    
                    <!-- Input para aula -->
                    <label for="aula">Aula:</label>
                    <input type="text" id="aula" class="swal2-input" style="width: 100%;" placeholder="Ejemplo: A101" />

                    <!-- Select para elegir el grupo de laboratorio (si es necesario) -->
                    <div id="grupo-laboratorio-container" style="display: none;">
                        <label for="grupo-laboratorio">Grupo de Laboratorio:</label>
                        <select id="grupo-laboratorio" class="swal2-input">
                            ${[...Array(carga.curso?.nGrupos || 0)].map((_, index) => `<option value="Grupo ${index + 1}" ${horarios.some(h => h.grupo === `Grupo ${index + 1}`) ? 'selected' : ''}>Grupo ${index + 1}</option>`).join("")}
                        </select>
                    </div>
    
                    <!-- Botón para agregar el horario -->
                    <button id="btn-agregar-horario" class="swal2-confirm swal2-styled">Agregar Horario</button>
    
                    <!-- Tabla de horarios asignados -->
                    <h4>Horarios Asignados</h4>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: left;">
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Grupo</th>
                                <th>Día</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Aula</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-horarios"></tbody>
                    </table>
                </div>
            `,
            width: 800,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            didOpen: () => {
                // Habilitar o deshabilitar el campo de grupo de laboratorio
                document.getElementById("tipo-sesion")?.addEventListener("change", (e) => {
                    const tipo = (e.target as HTMLSelectElement).value;
                    const grupoContainer = document.getElementById("grupo-laboratorio-container");
                    if (tipo === "Laboratorio" && carga.curso?.nGrupos > 0) {
                        grupoContainer.style.display = "block";
                    } else {
                        grupoContainer.style.display = "none";
                    }
                });
                // Agregar un horario a la tabla
                document.getElementById("btn-agregar-horario")?.addEventListener("click", () => {
                    const tipo = (document.getElementById("tipo-sesion") as HTMLSelectElement)?.value;
                    const dia = (document.getElementById("dia") as HTMLSelectElement)?.value;
                    const inicio = (document.getElementById("hora-inicio") as HTMLInputElement)?.value;
                    const fin = (document.getElementById("hora-fin") as HTMLInputElement)?.value;
                    const aula = (document.getElementById("aula") as HTMLInputElement)?.value;
                    const grupo = tipo === "Laboratorio" ? (document.getElementById("grupo-laboratorio") as HTMLSelectElement)?.value : null;
    
                    if (tipo && inicio && fin && aula) {
                        horarios.push({ tipoSesion: tipo, grupo, dia, horaInicio: inicio, horaFin: fin, aula });
                        renderTablaHorarios();
                    } else {
                        Swal.fire("Error", "Por favor, completa todos los campos.", "error");
                    }
                });
    
                renderTablaHorarios();
            },
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Horarios asignados:", horarios);
                manejarGuardarHorarios(horarios, carga.idCargaDocente, carga.idFilial, carga.idDocente);
            }
        });
    };


    const modal = (carga: CargaDocente, numero: number) => {
        const isEditable = numero === 1;
        let horarios = carga.asignacion || [];
    
        const renderTablaHorarios = () => {
            const tabla = document.getElementById("tabla-horarios");
            if (tabla) {
                tabla.innerHTML = horarios
                    .map(
                        (asignacion, index) => `
                            <tr class="border-b">
                                <td class="px-2 py-1">${asignacion.tipoSesion}</td>
                                <td class="px-2 py-1">${asignacion.grupo || "N/A"}</td>
                                <td class="px-2 py-1">${asignacion.dia}</td>
                                <td class="px-2 py-1">${asignacion.horaInicio}</td>
                                <td class="px-2 py-1">${asignacion.horaFin}</td>
                                <td class="px-2 py-1">${asignacion.aula || "N/A"}</td>
                                <td class="px-2 py-1 text-center">
                                    <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 btn-delete" data-index="${index}">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        `
                    )
                    .join("");
    
                document.querySelectorAll(".btn-delete").forEach((btn) => {
                    btn.addEventListener("click", (e) => {
                        const index = parseInt((e.target as HTMLElement).getAttribute("data-index"));
                        horarios.splice(index, 1);
                        renderTablaHorarios();
                    });
                });
            }
        };
    
        Swal.fire({
            title: "<h2 style='color: #2c3e50;'>Asignar Horarios</h2>",
            html: `
                <div style="text-align: left; padding: 10px;">
                    <h4 class="text-lg font-bold mb-3">Información</h4>
    
                    <!-- Tipo de Sesión -->
                    <label for="tipo-sesion" class="block font-medium">Tipo de Sesión:</label>
                    <select id="tipo-sesion" class="swal2-input">
                        <option value="">Selecciona tipo de sesión</option>
                        ${carga.curso?.hTeoricas ? `<option value="Teoría">Teoría</option>` : ""}
                        ${carga.curso?.hPracticas ? `<option value="Práctica">Práctica</option>` : ""}
                        ${carga.curso?.hLaboratorio ? `<option value="Laboratorio">Laboratorio</option>` : ""}
                    </select>
    
                    <!-- Día -->
                    <label for="dia" class="block font-medium mt-2">Día de la Semana:</label>
                    <select id="dia" class="swal2-input">
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                    </select>
    
                    <!-- Horario -->
                    <div class="flex gap-2 mt-2">
                        <div>
                            <label for="hora-inicio" class="block font-medium">Hora de Inicio:</label>
                            <input type="time" id="hora-inicio" class="swal2-input w-full" />
                        </div>
                        <div>
                            <label for="hora-fin" class="block font-medium">Hora de Fin:</label>
                            <input type="time" id="hora-fin" class="swal2-input w-full" />
                        </div>
                    </div>
    
                    <!-- Aula -->
                    <label for="aula" class="block font-medium mt-2">Aula:</label>
                    <input type="text" id="aula" class="swal2-input w-full" placeholder="Ejemplo: A101" />
    
                    <!-- Grupo Laboratorio -->
                    <div id="grupo-laboratorio-container" style="display: none;">
                        <label for="grupo-laboratorio" class="block font-medium mt-2">Grupo de Laboratorio:</label>
                        <select id="grupo-laboratorio" class="swal2-input">
                            ${[...Array(carga.curso?.nGrupos || 0)]
                                .map(
                                    (_, index) =>
                                        `<option value="Grupo ${index + 1}">Grupo ${index + 1}</option>`
                                )
                                .join("")}
                        </select>
                    </div>
    
                    <!-- Botón Agregar -->
                    <button id="btn-agregar-horario" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-3">
                        Agregar Horario
                    </button>
    
                    <!-- Tabla -->
                    <h4 class="text-lg font-bold mt-5">Horarios Asignados</h4>
                    <table class="w-full border-collapse mt-2">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="border px-2 py-1">Tipo</th>
                                <th class="border px-2 py-1">Grupo</th>
                                <th class="border px-2 py-1">Día</th>
                                <th class="border px-2 py-1">Inicio</th>
                                <th class="border px-2 py-1">Fin</th>
                                <th class="border px-2 py-1">Aula</th>
                                <th class="border px-2 py-1">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-horarios" class="text-sm"></tbody>
                    </table>
                </div>
            `,
            width: "60%",
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            didOpen: () => {
                document.getElementById("tipo-sesion")?.addEventListener("change", (e) => {
                    const tipo = (e.target as HTMLSelectElement).value;
                    const grupoContainer = document.getElementById("grupo-laboratorio-container");
                    grupoContainer.style.display =
                        tipo === "Laboratorio" && carga.curso?.nGrupos > 0 ? "block" : "none";
                });
    
                document.getElementById("btn-agregar-horario")?.addEventListener("click", () => {
                    const tipo = (document.getElementById("tipo-sesion") as HTMLSelectElement)?.value;
                    const dia = (document.getElementById("dia") as HTMLSelectElement)?.value;
                    const inicio = (document.getElementById("hora-inicio") as HTMLInputElement)?.value;
                    const fin = (document.getElementById("hora-fin") as HTMLInputElement)?.value;
                    const aula = (document.getElementById("aula") as HTMLInputElement)?.value;
                    const grupo =
                        tipo === "Laboratorio"
                            ? (document.getElementById("grupo-laboratorio") as HTMLSelectElement)?.value
                            : null;
    
                    if (tipo && inicio && fin && aula) {
                        horarios.push({ tipoSesion: tipo, grupo, dia, horaInicio: inicio, horaFin: fin, aula });
                        renderTablaHorarios();
                    } else {
                        Swal.fire("Error", "Por favor, completa todos los campos.", "error");
                    }
                });
    
                renderTablaHorarios();
            },
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Horarios asignados:", horarios);
                manejarGuardarHorarios(horarios, carga.idCargaDocente, carga.idFilial, carga.idDocente);
            }
        });
    };
    
    

    const SubmitCarga = async (carga: CargaDocente, numero: number, observaciones: string) => {
        console.log('observaciones:', observaciones);

        if (numero == 0) {
            const silaboData = {
                idCargaDocente: carga.idCargaDocente, // Asumiendo que `carga` tiene un `id`
                idDocente: carga.idDocente, // Información del docente
                idFilial: carga.idFilial, // Información del curso
                numero: 11,
                observaciones: observaciones,
            };
            const response = await enviarinfoSilabo(silaboData);
            console.log("Información del sílabo enviada correctamente:", response);

            setShouldUpdate((prev) => !prev); // Cambiar el estado para disparar el useEffect

        } else {
            if (numero == 1) {
                const silaboData = {
                    idCargaDocente: carga.idCargaDocente, // Asumiendo que `carga` tiene un `id`
                    idDocente: carga.idDocente, // Información del docente
                    idFilial: carga.idFilial, // Información del curso
                    numero: 12,
                    observaciones: observaciones,
                };
                const response = await enviarinfoSilabo(silaboData);
                console.log("Información del sílabo enviada correctamente:", response);

                setShouldUpdate((prev) => !prev); // Cambiar el estado para disparar el useEffect

            }
        }

    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Asignar horarios</h1>
            <h2 className="text-xl font-bold mb-4">Filtrar:</h2>

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
                <h2 className="text-xl font-bold mb-4">Listado de Carga Docente</h2>
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
                                    {carga.estado === false ? (
                                        <span className="text-gray-500 font-semibold">Inactivo</span>
                                    ) : (
                                        <span
                                            className={`font-semibold px-2 py-1 rounded ${
                                                carga.asignacionEstado === 0
                                                    ? 'text-red-600 bg-red-100'
                                                    : 'text-green-600 bg-green-100'
                                            }`}
                                        >
                                            {carga.asignacionEstado === 0 ? 'Sin horarios' : 'Con horarios asignados'}
                                        </span>
                                    )}
                                </td>


                                <td className="px-4 py-2 border-b text-center">
                                    <button 
                                        onClick={() => modal(carga, 1)}
                                        className={`px-4 py-2 rounded font-semibold text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105 ${
                                            carga.asignacionEstado === 0
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        {carga.asignacionEstado === 0 ? 'Asignar' : 'Modificar'}
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
