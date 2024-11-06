import React, { useEffect, useState } from 'react';
import { getMisCursos, CargaDocente } from '@/pages/services/silabo.services';

const Index: React.FC = () => {
    const [cargaDocente, setCargaDocente] = useState<CargaDocente[]>([]);
    const [filteredData, setFilteredData] = useState<CargaDocente[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [filial, setFilial] = useState('');
    const [curso, setCurso] = useState('');

    useEffect(() => {
        getMisCursos()
            .then((data) => {
                setCargaDocente(data.cargadocente);
                setFilteredData(data.cargadocente); // Initialize with all data
            })
            .catch((error) => {
                setError(error.message);
            });
    }, []);

    const handleFilter = () => {
        const filtered = cargaDocente.filter(item => {
            return (
                (filial ? item.idFilial === Number(filial) : true) &&
                (curso ? item.idCurso === Number(curso) : true)
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page after filtering
    };

    const handleResetFilters = () => {
        setFilial('');
        setCurso('');
        setFilteredData(cargaDocente);
        setCurrentPage(1);
    };

    // Get data for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Listado de Carga Docente</h1>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Filial"
                    value={filial}
                    onChange={(e) => setFilial(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Curso"
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded"
                />
                <button
                    onClick={handleFilter}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Filtrar
                </button>
                <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Reiniciar
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b font-medium text-gray-700">Curso</th>
                            <th className="px-4 py-2 border-b font-medium text-gray-700">Filial</th>
                            <th className="px-4 py-2 border-b font-medium text-gray-700">Grupo</th>
                            <th className="px-4 py-2 border-b font-medium text-gray-700">Estado</th>
                            <th className="px-4 py-2 border-b font-medium text-gray-700">Fecha de Asignación</th>
                            <th className="px-4 py-2 border-b font-medium text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((curso) => (
                            <tr key={curso.idCargaDocente} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b text-center">{curso.curso?.name}</td>
                                <td className="px-4 py-2 border-b text-center">{curso.filial?.name}</td>
                                <td className="px-4 py-2 border-b text-center">{curso.grupo}</td>
                                <td className="px-4 py-2 border-b text-center">
                                    {curso.estado ? "Activo" : "Inactivo"}
                                </td>
                                <td className="px-4 py-2 border-b text-center">{curso.fAsignacion}</td>
                                <td className="px-4 py-2 border-b text-center">
                                    <button
                                        // onClick={() => handleGestionarSilabo(curso)}
                                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Gestionar Sílabos
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            {/* Pagination */}
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
