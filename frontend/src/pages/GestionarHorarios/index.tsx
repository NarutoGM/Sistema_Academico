import React, { useEffect, useState } from 'react';
import { getCargadocentexciclo, HorarioDocente,getHorarios ,Horario} from '@/pages/services/horario.services';


const HorariosTable: React.FC = () => {
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [error, setError] = useState<string | null>(null);

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
                            <th className="border border-gray-300 px-4 py-2 text-left">Documento</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Observaciones</th>
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
                                <td className="border border-gray-300 px-4 py-2">{horario.documento}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {horario.estado ? (
                                        <span className="text-green-600 font-bold">Activo</span>
                                    ) : (
                                        <span className="text-red-600 font-bold">Inactivo</span>
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{horario.observaciones}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {horario.estado ? (
                                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                                            Generar Esquema de Horarios
                                        </button>
                                    ) : (
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                                            Ver Horarios
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600 text-center">No hay horarios disponibles</p>
            )}
        </div>
    );
};

export default HorariosTable;
