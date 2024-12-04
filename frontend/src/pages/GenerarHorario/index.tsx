import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getCargaHorario, CargaDocente, guardarHorarios, getCursosFiltrados } from '@/pages/services/generarHorario.services';
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
        getCursosFiltrados()
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
  
    const modal = (carga: CargaDocente, numero: number) => {
        const isEditable = numero === 1;
    
        // Función para renderizar la tabla de horarios
        const renderTablaHorarios = (registro: CargaDocente) => {
            const tabla = document.getElementById("tabla-horarios");
            const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const horas = [
                "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
                "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
                "07:00 PM", "08:00 PM"
            ];
    
            if (!tabla) return; // Asegurarse de que la tabla existe
            tabla.innerHTML = ""; // Limpiar la tabla antes de renderizar
    
            // Crear encabezado de la tabla
            const encabezado = `
                <thead>
                    <tr class='bg-gray-100'>
                        <th class='border px-2 py-1'></th> <!-- Columna de horas -->
                        ${dias.map(dia => `<th class='border px-2 py-1 text-center'>${dia}</th>`).join("")}
                    </tr>
                </thead>
            `;
            tabla.innerHTML += encabezado;
    
            // Crear cuerpo de la tabla
            let cuerpo = "<tbody>";
            horas.forEach(hora => {
                cuerpo += `<tr><td class='border px-2 py-1 text-center'>${hora}</td>`;
                dias.forEach(dia => {
                    let claseCelda = "";
                    let contenidoCelda = "";
                    let nombreAula = "";
    
                    // Iterar sobre las claves de `registro.cursos` (que son los nombres de los cursos)
                    Object.keys(registro.cursos).forEach(cursoNombre => {
                        const curso = registro.cursos[cursoNombre];
    
                        // Generar un color único para cada curso
                        const cursoColor = generateColorForCourse(cursoNombre);
    
                        // Iterar sobre las asignaciones de cada curso
                        curso.forEach((cursoData: any) => {
                            cursoData.asignaciones?.forEach((asignacion: any) => {
                                const horaInicio = formatTime(asignacion.horaInicio);
                                const horaFin = formatTime(asignacion.horaFin);
    
                                // Comparar rango de horas
                                if (asignacion.dia === dia && isWithinTimeRange(hora, horaInicio, horaFin)) {
                                    // Aplicar el color único directamente al estilo
                                    claseCelda = `background-color: ${cursoColor};`; // Aplicar color al estilo
                                    contenidoCelda = cursoData.curso;
                                    nombreAula = asignacion.nombreAula;
    
                                    // Si la asignación se solapa con una anterior, fusionar celdas
                                    if (isConsecutiveAssignment(asignacion, cursoData.asignaciones)) {
                                        contenidoCelda = ""; // Dejar la celda vacía para fusionar
                                    }
                                }
                            });
                        });
                    });
    
                    // Añadir el nombre del aula solo si la celda no está vacía
                    if (contenidoCelda && nombreAula) {
                        contenidoCelda += `<br><small>${nombreAula}</small>`;
                    }
    
                    // Aplicar el estilo de color en la celda
                    cuerpo += `<td class='border px-2 py-1' style='${claseCelda}'>${contenidoCelda}</td>`;
                });
                cuerpo += "</tr>";
            });
            cuerpo += "</tbody>";
    
            tabla.innerHTML += cuerpo;
        };
    
        // Función para generar un color único basado en el nombre del curso
        const generateColorForCourse = (courseName: string): string => {
            let hash = 0;
            for (let i = 0; i < courseName.length; i++) {
                hash = ((hash << 5) - hash) + courseName.charCodeAt(i);
                hash |= 0; // Convertir a un número de 32 bits
            }
    
            // Convertir el valor hash a un color hex
            const color = (hash & 0x00FFFFFF).toString(16).padStart(6, '0');
            return `#${color}`; // Retorna un color en formato hexadecimal
        };
    
        // Función para verificar si dos asignaciones son consecutivas
        const isConsecutiveAssignment = (asignacion: any, asignaciones: any[]) => {
            const index = asignaciones.indexOf(asignacion);
            if (index === -1 || index === asignaciones.length - 1) return false;
    
            const siguiente = asignaciones[index + 1];
            return formatTime(asignacion.horaFin) === formatTime(siguiente.horaInicio);
        };
    
        // Función para convertir el formato de 24 horas a 12 horas (AM/PM)
        const formatTime = (time: string): string => {
            const [hour, minute] = time.split(":").map(Number);
            const period = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minute < 10 ? '0' + minute : minute} ${period}`;
        };
    
        // Función para verificar si una hora está dentro de un rango
        const isWithinTimeRange = (hora: string, inicio: string, fin: string): boolean => {
            const horaDate = new Date(`1970-01-01T${convertTo24Hour(hora)}:00`);
            const inicioDate = new Date(`1970-01-01T${convertTo24Hour(inicio)}:00`);
            const finDate = new Date(`1970-01-01T${convertTo24Hour(fin)}:00`);
            return horaDate >= inicioDate && horaDate < finDate;
        };
    
        // Función para convertir hora de 12 horas a 24 horas
        const convertTo24Hour = (time: string): string => {
            const [timePart, modifier] = time.split(" ");
            let [hours, minutes] = timePart.split(":").map(Number);
            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };
    
        // Modal de SweetAlert
        Swal.fire({
            title: "<h2 style='color: #2c3e50;'>Horarios Asignados</h2>",
            html: `
                <div style="text-align: left; padding: 10px;">
                    <h4 class="text-lg font-bold mb-3">Horarios de Clases</h4>
                    <table id="tabla-horarios" class="w-full border-collapse mt-2"></table>
                </div>
            `,
            width: "60%",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            focusConfirm: false,
            didOpen: () => {
                renderTablaHorarios(carga); // Renderizar horarios al abrir el modal
            },
        });
    };
    

    const modal6 = (carga: CargaDocente, numero: number) => {
        const isEditable = numero === 1;
    
        // Función para renderizar la tabla de horarios
        const renderTablaHorarios = (registro: CargaDocente) => {
            const tabla = document.getElementById("tabla-horarios");
            const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const horas = [
                "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
                "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
                "07:00 PM", "08:00 PM"
            ];
    
            if (!tabla) return; // Asegurarse de que la tabla existe
            tabla.innerHTML = ""; // Limpiar la tabla antes de renderizar
    
            // Crear encabezado de la tabla
            const encabezado = `
                <thead>
                    <tr class='bg-gray-100'>
                        <th class='border px-2 py-1'></th> <!-- Columna de horas -->
                        ${dias.map(dia => `<th class='border px-2 py-1 text-center'>${dia}</th>`).join("")}
                    </tr>
                </thead>
            `;
            tabla.innerHTML += encabezado;
    
            // Crear cuerpo de la tabla
            let cuerpo = "<tbody>";
            horas.forEach(hora => {
                cuerpo += `<tr><td class='border px-2 py-1 text-center'>${hora}</td>`;
                dias.forEach(dia => {
                    let claseCelda = "";
                    let contenidoCelda = "";
                    let nombreAula = "";
    
                    // Iterar sobre las claves de `registro.cursos` (que son los nombres de los cursos)
                    Object.keys(registro.cursos).forEach(cursoNombre => {
                        const curso = registro.cursos[cursoNombre];
    
                        // Generar un color único para cada curso
                        const cursoColor = generateColorForCourse(cursoNombre);
    
                        // Iterar sobre las asignaciones de cada curso
                        curso.forEach((cursoData: any) => {
                            cursoData.asignaciones?.forEach((asignacion: any) => {
                                const horaInicio = formatTime(asignacion.horaInicio);
                                const horaFin = formatTime(asignacion.horaFin);
    
                                // Comparar rango de horas
                                if (asignacion.dia === dia && isWithinTimeRange(hora, horaInicio, horaFin)) {
                                    claseCelda = `bg-[${cursoColor}]`; // Aplicar el color único
                                    contenidoCelda = cursoData.curso;
                                    nombreAula = asignacion.nombreAula;
    
                                    // Si la asignación se solapa con una anterior, fusionar celdas
                                    if (isConsecutiveAssignment(asignacion, cursoData.asignaciones)) {
                                        contenidoCelda = ""; // Dejar la celda vacía para fusionar
                                    }
                                }
                            });
                        });
                    });
    
                    // Añadir el nombre del aula solo si la celda no está vacía
                    if (contenidoCelda && nombreAula) {
                        contenidoCelda += `<br><small>${nombreAula}</small>`;
                    }
    
                    cuerpo += `<td class='border px-2 py-1 ${claseCelda}'>${contenidoCelda}</td>`;
                });
                cuerpo += "</tr>";
            });
            cuerpo += "</tbody>";
    
            tabla.innerHTML += cuerpo;
        };
    
        // Función para generar un color único basado en el nombre del curso
        const generateColorForCourse = (courseName: string): string => {
            let hash = 0;
            for (let i = 0; i < courseName.length; i++) {
                hash = ((hash << 5) - hash) + courseName.charCodeAt(i);
                hash |= 0; // Convertir a un número de 32 bits
            }
    
            // Convertir el valor hash a un color hex
            const color = (hash & 0x00FFFFFF).toString(16).padStart(6, '0');
            return `#${color}`; // Retorna un color en formato hexadecimal
        };
    
        // Función para verificar si dos asignaciones son consecutivas
        const isConsecutiveAssignment = (asignacion: any, asignaciones: any[]) => {
            const index = asignaciones.indexOf(asignacion);
            if (index === -1 || index === asignaciones.length - 1) return false;
    
            const siguiente = asignaciones[index + 1];
            return formatTime(asignacion.horaFin) === formatTime(siguiente.horaInicio);
        };
    
        // Función para convertir el formato de 24 horas a 12 horas (AM/PM)
        const formatTime = (time: string): string => {
            const [hour, minute] = time.split(":").map(Number);
            const period = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minute < 10 ? '0' + minute : minute} ${period}`;
        };
    
        // Función para verificar si una hora está dentro de un rango
        const isWithinTimeRange = (hora: string, inicio: string, fin: string): boolean => {
            const horaDate = new Date(`1970-01-01T${convertTo24Hour(hora)}:00`);
            const inicioDate = new Date(`1970-01-01T${convertTo24Hour(inicio)}:00`);
            const finDate = new Date(`1970-01-01T${convertTo24Hour(fin)}:00`);
            return horaDate >= inicioDate && horaDate < finDate;
        };
    
        // Función para convertir hora de 12 horas a 24 horas
        const convertTo24Hour = (time: string): string => {
            const [timePart, modifier] = time.split(" ");
            let [hours, minutes] = timePart.split(":").map(Number);
            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };
    
        // Modal de SweetAlert
        Swal.fire({
            title: "<h2 style='color: #2c3e50;'>Horarios Asignados</h2>",
            html: `
                <div style="text-align: left; padding: 10px;">
                    <h4 class="text-lg font-bold mb-3">Horarios de Clases</h4>
                    <table id="tabla-horarios" class="w-full border-collapse mt-2"></table>
                </div>
            `,
            width: "80%",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            focusConfirm: false,
            didOpen: () => {
                renderTablaHorarios(carga); // Renderizar horarios al abrir el modal
            },
        });
    };
    
    
    const modal5 = (carga: CargaDocente, numero: number) => {
        const isEditable = numero === 1;
    
        // Función para renderizar la tabla de horarios
        const renderTablaHorarios = (registro: CargaDocente) => {
            const tabla = document.getElementById("tabla-horarios");
            const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const horas = [
                "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
                "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
                "07:00 PM", "08:00 PM"
            ];
    
            if (!tabla) return; // Asegurarse de que la tabla existe
            tabla.innerHTML = ""; // Limpiar la tabla antes de renderizar
    
            // Crear encabezado de la tabla
            const encabezado = `
                <thead>
                    <tr class='bg-gray-100'>
                        <th class='border px-2 py-1'></th> <!-- Columna de horas -->
                        ${dias.map(dia => `<th class='border px-2 py-1 text-center'>${dia}</th>`).join("")}
                    </tr>
                </thead>
            `;
            tabla.innerHTML += encabezado;
    
            // Crear cuerpo de la tabla
            let cuerpo = "<tbody>";
            horas.forEach(hora => {
                cuerpo += `<tr><td class='border px-2 py-1 text-center'>${hora}</td>`;
                dias.forEach(dia => {
                    let claseCelda = "";
                    let contenidoCelda = "";
                    let nombreAula = "";
    
                    // Iterar sobre las claves de `registro.cursos` (que son los nombres de los cursos)
                    Object.keys(registro.cursos).forEach(cursoNombre => {
                        const curso = registro.cursos[cursoNombre];
    
                        // Iterar sobre las asignaciones de cada curso
                        curso.forEach((cursoData: any) => {
                            cursoData.asignaciones?.forEach((asignacion: any) => {
                                const horaInicio = formatTime(asignacion.horaInicio);
                                const horaFin = formatTime(asignacion.horaFin);
    
                                // Comparar rango de horas
                                if (asignacion.dia === dia && isWithinTimeRange(hora, horaInicio, horaFin)) {
                                    const cursoColor = generateColorForCourse(cursoData.curso); // Generar color único para el curso
                                    claseCelda = `bg-[${cursoColor}]`; // Aplicar color único
                                    contenidoCelda = cursoData.curso;
                                    nombreAula = asignacion.nombreAula;
    
                                    // Si la asignación se solapa con una anterior, fusionar celdas
                                    if (isConsecutiveAssignment(asignacion, cursoData.asignaciones)) {
                                        contenidoCelda = ""; // Dejar la celda vacía para fusionar
                                    }
                                }
                            });
                        });
                    });
    
                    // Añadir el nombre del aula solo si la celda no está vacía
                    if (contenidoCelda && nombreAula) {
                        contenidoCelda += `<br><small>${nombreAula}</small>`;
                    }
    
                    cuerpo += `<td class='border px-2 py-1 ${claseCelda}'>${contenidoCelda}</td>`;
                });
                cuerpo += "</tr>";
            });
            cuerpo += "</tbody>";
    
            tabla.innerHTML += cuerpo;
        };
    
        // Función para generar un color único basado en el nombre del curso
        const generateColorForCourse = (courseName: string): string => {
            // Usamos una función hash simple para generar un valor único basado en el nombre del curso
            let hash = 0;
            for (let i = 0; i < courseName.length; i++) {
                hash = ((hash << 5) - hash) + courseName.charCodeAt(i);
                hash |= 0; // Convertir a un número de 32 bits
            }
    
            // Convertir el valor hash a un color hex
            const color = (hash & 0x00FFFFFF).toString(16).padStart(6, '0');
            return `#${color}`; // Retorna un color en formato hexadecimal
        };
    
        // Función para verificar si dos asignaciones son consecutivas
        const isConsecutiveAssignment = (asignacion: any, asignaciones: any[]) => {
            // Comprobar si la asignación se solapa con la siguiente
            const index = asignaciones.indexOf(asignacion);
            if (index === -1 || index === asignaciones.length - 1) return false;
    
            const siguiente = asignaciones[index + 1];
            return formatTime(asignacion.horaFin) === formatTime(siguiente.horaInicio);
        };
    
        // Función para convertir el formato de 24 horas a 12 horas (AM/PM)
        const formatTime = (time: string): string => {
            const [hour, minute] = time.split(":").map(Number);
            const period = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minute < 10 ? '0' + minute : minute} ${period}`;
        };
    
        // Función para verificar si una hora está dentro de un rango
        const isWithinTimeRange = (hora: string, inicio: string, fin: string): boolean => {
            const horaDate = new Date(`1970-01-01T${convertTo24Hour(hora)}:00`);
            const inicioDate = new Date(`1970-01-01T${convertTo24Hour(inicio)}:00`);
            const finDate = new Date(`1970-01-01T${convertTo24Hour(fin)}:00`);
            return horaDate >= inicioDate && horaDate < finDate;
        };
    
        // Función para convertir hora de 12 horas a 24 horas
        const convertTo24Hour = (time: string): string => {
            const [timePart, modifier] = time.split(" ");
            let [hours, minutes] = timePart.split(":").map(Number);
            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };
    
        // Modal de SweetAlert
        Swal.fire({
            title: "<h2 style='color: #2c3e50;'>Horarios Asignados</h2>",
            html: `
                <div style="text-align: left; padding: 10px;">
                    <h4 class="text-lg font-bold mb-3">Horarios de Clases</h4>
                    <table id="tabla-horarios" class="w-full border-collapse mt-2"></table>
                </div>
            `,
            width: "80%",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            focusConfirm: false,
            didOpen: () => {
                renderTablaHorarios(carga); // Renderizar horarios al abrir el modal
            },
        });
    };
    

    const modal4 = (carga: CargaDocente, numero: number) => {
        const isEditable = numero === 1;
    
        // Función para renderizar la tabla de horarios
        const renderTablaHorarios = (registro: CargaDocente) => {
            const tabla = document.getElementById("tabla-horarios");
            const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const horas = [
                "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
                "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
                "07:00 PM", "08:00 PM"
            ];
    
            if (!tabla) return; // Asegurarse de que la tabla existe
            tabla.innerHTML = ""; // Limpiar la tabla antes de renderizar
    
            // Crear encabezado de la tabla
            const encabezado = `
                <thead>
                    <tr class='bg-gray-100'>
                        <th class='border px-2 py-1'></th> <!-- Columna de horas -->
                        ${dias.map(dia => `<th class='border px-2 py-1 text-center'>${dia}</th>`).join("")}
                    </tr>
                </thead>
            `;
            tabla.innerHTML += encabezado;
    
            // Crear cuerpo de la tabla
            let cuerpo = "<tbody>";
            horas.forEach(hora => {
                cuerpo += `<tr><td class='border px-2 py-1 text-center'>${hora}</td>`;
                dias.forEach(dia => {
                    let claseCelda = "";
                    let contenidoCelda = "";
                    let nombreAula = "";
    
                    // Validar si cursos existe y es un array
                    const cursos = Array.isArray(registro.cursos) ? registro.cursos : [];
    
                    // Buscar asignaciones para el día y hora actuales
                    Object.keys(registro.cursos).forEach(cursoNombre => {
                        const cursos = registro.cursos[cursoNombre];
                    cursos.forEach((curso: any) => {
                        curso.asignaciones?.forEach((asignacion: any) => {
                            const horaInicio = formatTime(asignacion.horaInicio);
                            const horaFin = formatTime(asignacion.horaFin);
    
                            // Comparar rango de horas
                            if (asignacion.dia === dia && isWithinTimeRange(hora, horaInicio, horaFin)) {
                                claseCelda = "bg-blue-200"; // Color para resaltar
                                contenidoCelda = curso.curso;
                                nombreAula = asignacion.nombreAula;
    
                                // Si la asignación se solapa con una anterior, fusionar celdas
                                if (isConsecutiveAssignment(asignacion, curso.asignaciones)) {
                                    contenidoCelda = ""; // Dejar la celda vacía para fusionar
                                }
                            }
                        });
                    });
                    });
    
                    // Añadir el nombre del aula solo si la celda no está vacía
                    if (contenidoCelda && nombreAula) {
                        contenidoCelda += `<br><small>${nombreAula}</small>`;
                    }
    
                    cuerpo += `<td class='border px-2 py-1 ${claseCelda}'>${contenidoCelda}</td>`;
                });
                cuerpo += "</tr>";
            });
            cuerpo += "</tbody>";
    
            tabla.innerHTML += cuerpo;
        };
    
        // Función para verificar si dos asignaciones son consecutivas
        const isConsecutiveAssignment = (asignacion: any, asignaciones: any[]) => {
            // Comprobar si la asignación se solapa con la siguiente
            const index = asignaciones.indexOf(asignacion);
            if (index === -1 || index === asignaciones.length - 1) return false;
    
            const siguiente = asignaciones[index + 1];
            return formatTime(asignacion.horaFin) === formatTime(siguiente.horaInicio);
        };
    
        // Función para convertir el formato de 24 horas a 12 horas (AM/PM)
        const formatTime = (time: string): string => {
            const [hour, minute] = time.split(":").map(Number);
            const period = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minute < 10 ? '0' + minute : minute} ${period}`;
        };
    
        // Función para verificar si una hora está dentro de un rango
        const isWithinTimeRange = (hora: string, inicio: string, fin: string): boolean => {
            const horaDate = new Date(`1970-01-01T${convertTo24Hour(hora)}:00`);
            const inicioDate = new Date(`1970-01-01T${convertTo24Hour(inicio)}:00`);
            const finDate = new Date(`1970-01-01T${convertTo24Hour(fin)}:00`);
            return horaDate >= inicioDate && horaDate < finDate;
        };
    
        // Función para convertir hora de 12 horas a 24 horas
        const convertTo24Hour = (time: string): string => {
            const [timePart, modifier] = time.split(" ");
            let [hours, minutes] = timePart.split(":").map(Number);
            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };
    
        // Modal de SweetAlert
        Swal.fire({
            title: "<h2 style='color: #2c3e50;'>Horarios Asignados</h2>",
            html: `
                <div style="text-align: left; padding: 10px;">
                    <h4 class="text-lg font-bold mb-3">Horarios de Clases</h4>
                    <table id="tabla-horarios" class="w-full border-collapse mt-2"></table>
                </div>
            `,
            width: "60%",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            focusConfirm: false,
            didOpen: () => {
                renderTablaHorarios(carga); // Renderizar horarios al abrir el modal
            },
        });
    };
    

    const modal3 = (carga: CargaDocente, numero: number) => {
        const isEditable = numero === 1;
    
        // Función para renderizar la tabla de horarios
        const renderTablaHorarios = (registro: CargaDocente) => {
            const tabla = document.getElementById("tabla-horarios");
            const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const horas = [
                "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
                "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
                "07:00 PM", "08:00 PM"
            ];
    
            if (!tabla) return; // Asegurarse de que la tabla existe
            tabla.innerHTML = ""; // Limpiar la tabla antes de renderizar
    
            // Crear encabezado de la tabla
            const encabezado = `
                <thead>
                    <tr class='bg-gray-100'>
                        <th class='border px-2 py-1'></th> <!-- Columna de horas -->
                        ${dias.map(dia => `<th class='border px-2 py-1 text-center'>${dia}</th>`).join("")}
                    </tr>
                </thead>
            `;
            tabla.innerHTML += encabezado;
    
            // Crear cuerpo de la tabla
            let cuerpo = "<tbody>";
            horas.forEach(hora => {
                cuerpo += `<tr><td class='border px-2 py-1 text-center'>${hora}</td>`;
                dias.forEach(dia => {
                    let claseCelda = "";
                    let contenidoCelda = "";
    
                    // Recorrer los cursos
                    Object.keys(registro.cursos).forEach(cursoNombre => {
                        const cursos = registro.cursos[cursoNombre];
                        cursos.forEach((curso: any) => {
                            curso.asignaciones?.forEach((asignacion: any) => {
                                const horaInicio = formatTime(asignacion.horaInicio);
                                const horaFin = formatTime(asignacion.horaFin);
    
                                // Comparar si la hora y el día coinciden con la asignación
                                if (asignacion.dia === dia && isWithinTimeRange(hora, horaInicio, horaFin)) {
                                    claseCelda = "bg-blue-200"; // Resaltar
                                    contenidoCelda = cursoNombre; // Nombre del curso
                                }
                            });
                        });
                    });
    
                    cuerpo += `<td class='border px-2 py-1 ${claseCelda}'>${contenidoCelda}</td>`;
                });
                cuerpo += "</tr>";
            });
            cuerpo += "</tbody>";
    
            tabla.innerHTML += cuerpo;
        };
    
        // Función para convertir el formato de 24 horas a 12 horas (AM/PM)
        const formatTime = (time: string): string => {
            const [hour, minute] = time.split(":").map(Number);
            const period = hour >= 12 ? "PM" : "AM";
            const hour12 = hour % 12 || 12;
            return `${hour12}:${minute < 10 ? '0' + minute : minute} ${period}`;
        };
    
        // Función para verificar si una hora está dentro de un rango
        const isWithinTimeRange = (hora: string, inicio: string, fin: string): boolean => {
            const horaDate = new Date(`1970-01-01T${convertTo24Hour(hora)}:00`);
            const inicioDate = new Date(`1970-01-01T${convertTo24Hour(inicio)}:00`);
            const finDate = new Date(`1970-01-01T${convertTo24Hour(fin)}:00`);
            return horaDate >= inicioDate && horaDate < finDate;
        };
    
        // Función para convertir hora de 12 horas a 24 horas
        const convertTo24Hour = (time: string): string => {
            const [timePart, modifier] = time.split(" ");
            let [hours, minutes] = timePart.split(":").map(Number);
            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };
    
        // Modal de SweetAlert
        Swal.fire({
            title: "<h2 style='color: #2c3e50;'>Horarios Asignados</h2>",
            html: `
                <div style="text-align: left; padding: 10px;">
                    <h4 class="text-lg font-bold mb-3">Horarios de Clases</h4>
                    <table id="tabla-horarios" class="w-full border-collapse mt-2"></table>
                </div>
            `,
            width: "60%",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            focusConfirm: false,
            didOpen: () => {
                renderTablaHorarios(carga); // Renderizar horarios al abrir el modal
            },
        });
    };
    


    const modal2 = (carga: CargaDocente, numero: number) => {
        const isEditable = numero === 1;
    
        // Función para renderizar la tabla de horarios
        const renderTablaHorarios = (registro: CargaDocente) => {
            const tabla = document.getElementById("tabla-horarios");
            const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const horas = [
                "07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00",
                "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00",
                "19:00:00", "20:00:00"
            ];
    
            if (!tabla) return; // Asegurarse de que la tabla existe
            tabla.innerHTML = ""; // Limpiar la tabla antes de renderizar
    
            // Crear encabezado de la tabla
            const encabezado = `
                <thead>
                    <tr class='bg-gray-100'>
                        <th class='border px-2 py-1'></th> <!-- Columna de horas -->
                        ${dias.map(dia => `<th class='border px-2 py-1 text-center'>${dia}</th>`).join("")}
                    </tr>
                </thead>
            `;
            tabla.innerHTML += encabezado;
    
            // Crear cuerpo de la tabla
            let cuerpo = "<tbody>";
            horas.forEach(hora => {
                cuerpo += `<tr><td class='border px-2 py-1 text-center'>${hora.slice(0, 5)}</td>`; // Mostrar hora en formato HH:MM
                dias.forEach(dia => {
                    let claseCelda = "";
                    let contenidoCelda = "";
    
                    // Validar si cursos existe y es un array
                    const cursos = Array.isArray(registro.cursos) ? registro.cursos : [];
    
                    // Buscar asignaciones para el día y hora actuales
                    cursos.forEach((curso: any) => {
                        curso.asignaciones?.forEach((asignacion: any) => {
                            const horaInicio = asignacion.horaInicio; // Formato HH:mm:ss
                            const horaFin = asignacion.horaFin; // Formato HH:mm:ss
    
                            // Comparar rango de horas
                            if (
                                asignacion.dia === dia &&
                                hora >= horaInicio && hora < horaFin
                            ) {
                                claseCelda = "bg-blue-200"; // Color para resaltar
                                contenidoCelda = curso.curso; // Nombre del curso
                            }
                        });
                    });
    
                    cuerpo += `<td class='border px-2 py-1 ${claseCelda}'>${contenidoCelda}</td>`;
                });
                cuerpo += "</tr>";
            });
            cuerpo += "</tbody>";
    
            tabla.innerHTML += cuerpo;
        };
    
        // Modal de SweetAlert
        Swal.fire({
            title: "<h2 style='color: #2c3e50;'>Horarios Asignados</h2>",
            html: `
                <div style="text-align: left; padding: 10px;">
                    <h4 class="text-lg font-bold mb-3">Horarios de Clases</h4>
                    <table id="tabla-horarios" class="w-full border-collapse mt-2"></table>
                </div>
            `,
            width: "80%",
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            focusConfirm: false,
            didOpen: () => {
                renderTablaHorarios(carga); // Renderizar horarios al abrir el modal
            },
        });
    };
    

    const modal1 = (carga: CargaDocente, numero: number) => {
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
            <h1 className="text-2xl font-bold mb-4">Generar horarios</h1>
            <h2 className="text-xl font-bold mb-4">Filtrar:</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-4 w-full">
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
                    <button
                        onClick={() => {
                            setFilial('');
                            setSemestre('');
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
                            <th className="px-4 py-2 border-b font-medium text-white">Filial</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Semestre</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Ciclo</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((carga) => (
                            <tr key={carga.idCargaDocente} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b text-center">{carga.filial}</td>
                                <td className="px-4 py-2 border-b text-center">{carga.semestre}</td>
                                <td className="px-4 py-2 border-b text-center">{carga.ciclo}</td>
                                <td className="px-4 py-2 border-b text-center">
                                    <button 
                                        onClick={() => modal(carga, 1)}
                                        className={`px-4 py-2 rounded font-semibold text-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105 ${
                                            carga.asignacionEstado === 0
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        {carga.asignacionEstado === 0 ? 'Asignar' : 'Ver'}
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
