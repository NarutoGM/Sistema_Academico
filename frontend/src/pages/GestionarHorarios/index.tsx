import React, { useEffect, useState } from 'react';
import { getCargadocentexciclo, HorarioDocente, getHorarios, Horario } from '@/pages/services/horario.services';
import { getAccessToken } from '@/pages/services/token.services';
import { saveAs } from "file-saver";
import { generateExcel } from "./componentehorario";
import * as XLSX from "xlsx";
import { crearEstructuraCompletaExcel } from '../services/modelodriveexcel.services';
import { enviarinfoHorario } from '@/pages/services/silabo.services';

const HorariosTable: React.FC = () => {
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const result = await getHorarios();
                console.log('Datos recibidos:', result);

                if (Array.isArray(result.horario)) {
                    setHorarios(result.horario);
                } else {
                    console.error('La propiedad "horario" no es un array:', result);
                    throw new Error('Formato de datos inesperado');
                }
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchHorarios();
    }, []);

    const handleGenerateClick = (horario: Horario) => {
        setSelectedHorario(horario);
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        if (selectedHorario) {
            try {
                // Obtén el token si es necesario
                const accessToken = await getAccessToken();

                // Obtén los datos
                const data = await getCargadocentexciclo(); // Ajusta la función según tus necesidades

                console.log("Datos obtenidos:", data);

                // Procesa los datos en un archivo Excel
                const workbook = generateExcel(data);

                // Convierte el archivo a un Blob para descargarlo
                // Convertir el archivo a Blob y descargarlo
                const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
                const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

                //    saveAs(blob, "Horario.xlsx");

                //  alert("Archivo generado con éxito");
                const link = await crearEstructuraCompletaExcel(data, accessToken, blob);

                console.log(link);

                const HorarioData = {
                    documento: link, // URL o información del documento generado
                    idSemestreAcademico: data.semestreAcademico.idSemestreAcademico, // Asumiendo que `carga` tiene un `id`
                    idFilial: data.idFilial, // Información del curso
                    idDirector: data.idDirector, // Información del curso
                    idEscuela: data.escuela.idEscuela, // Información del curso

                };
                console.log(HorarioData);
                const response = await enviarinfoHorario(HorarioData);


            } catch (err) {
                console.error('Error al generar el esquema:', err);
                alert('Error al generar el esquema');
            } finally {
                // Limpieza
                setIsModalOpen(false);
                setSelectedHorario(null);
            }
        }
    };


    if (error) {
        return <div className="text-red-500 font-bold">Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Listado de Horarios</h1>
            {horarios.length > 0 ? (
                <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Semestre</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Filial</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {horarios.map((horario) => (
                            <tr
                                key={`${horario.idSemestreAcademico}-${horario.idFilial}-${horario.idEscuela}`}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="border border-gray-300 px-4 py-2">
                                    {horario.semestreacademico?.nomSemestre} ({horario.semestreacademico?.añoAcademico})
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{horario.filial?.name}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {horario.estado ? (
                                        <span className="text-green-600 font-bold">Activo</span>
                                    ) : (
                                        <span className="text-red-600 font-bold">Inactivo</span>
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {horario.estado == 1 ? (
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                            onClick={() => handleGenerateClick(horario)}
                                        >
                                            Generar Esquema de Horarios
                                        </button>
                                    ) : horario.documento && typeof horario.documento === "string" && horario.documento.trim() !== "" ? (
                                        <a
                                            href={horario.documento}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                        >
                                            Ver Horarios
                                        </a>
                                    ) : (
                                        <span className="text-gray-500">No disponible</span>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600 text-center">No hay horarios disponibles</p>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Confirmar acción</h2>
                        <p className="mb-4">¿Estás seguro de que deseas generar el esquema de horarios?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                onClick={handleConfirm}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HorariosTable;
