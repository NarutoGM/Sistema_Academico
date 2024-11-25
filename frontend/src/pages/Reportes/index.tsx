import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  getReporte,
  CargaDocente,
} from '@/pages/services/silabo.services';
import 'quill/dist/quill.snow.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  const [docente, setDocente] = useState('');

  // Información adicional para el reporte
  const [usuario, setUsuario] = useState('Juan Pérez'); // Puedes obtener esto de tu autenticación
  const [semestres, setSemestres] = useState<string[]>([]);

  useEffect(() => {
    getReporte()
      .then((data) => {
        const docenteArray = Object.values(data.cargadocente) as CargaDocente[];
        setCargaDocente(docenteArray);
        setFilteredData(docenteArray);

        // Extraer los semestres únicos
        const uniqueSemestres = Array.from(
          new Set(
            docenteArray
              .map((item) => item.semestre_academico?.nomSemestre)
              .filter(Boolean), // Eliminar valores nulos o undefined
          ),
        );
        setSemestres(uniqueSemestres);
      })
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    const filtered = cargaDocente.filter((item) => {
      const estadoSilabo = item.curso?.estado_silabo || 'Curso por gestionar';
      const nombreDocente =
        `${item.nomdocente} ${item.apedocente}`.toLowerCase();
      return (
        (codigoCurso ? item.idCurso.toString().includes(codigoCurso) : true) &&
        (curso
          ? item.curso?.name.toLowerCase().includes(curso.toLowerCase())
          : true) &&
        (filial
          ? item.filial?.name.toLowerCase().includes(filial.toLowerCase())
          : true) &&
        (semestre
          ? item.semestre_academico?.nomSemestre
              .toLowerCase()
              .includes(semestre.toLowerCase())
          : true) &&
        (procesoSilabo
          ? estadoSilabo.toLowerCase().includes(procesoSilabo.toLowerCase())
          : true) &&
        (docente ? nombreDocente.includes(docente.toLowerCase()) : true)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [
    codigoCurso,
    curso,
    filial,
    semestre,
    procesoSilabo,
    docente,
    cargaDocente,
  ]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Función para generar el PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Agregar imagen local desde public/images/logo.png
    const imgUrl = `${window.location.origin}/images/logo.png`; // Ruta relativa al logo en public
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      doc.addImage(img, 'PNG', 150, 10, 45, 20); // Ajustar posición y tamaño

      // Título y metadatos
      doc.setFontSize(14);
      doc.text('Reporte de Sílabo', 14, 20);
      doc.setFontSize(10);
      doc.text(`Generado por: ${usuario}`, 14, 30);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 35);

      // Tabla
      const tableData = filteredData.map((carga) => [
        carga.curso?.name || 'N/A',
        `${carga.nomdocente} ${carga.apedocente}` || 'N/A',
        carga.filial?.name || 'N/A',
        carga.semestre_academico?.nomSemestre || 'N/A',
        carga.curso?.estado_silabo || 'N/A',
      ]);

      doc.autoTable({
        head: [['Curso', 'Docente', 'Filial', 'Periodo', 'Estado Sílabo']],
        body: tableData,
        startY: 50, // Inicia después del título y la imagen
      });

      // Descargar PDF
      doc.save('reporte_silabos.pdf');
    };

    img.onerror = () => {
      console.error('No se pudo cargar el logo.');
    };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reporte de silabos</h1>
      <h1 className="text-xl font-bold mb-4">Filtrar:</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-4 w-full">
          <div className="flex gap-4 w-full">
            {/* Select dinámico para semestres */}
            <select
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
            >
              <option value="" disabled>
                Seleccionar Periodo
              </option>
              {semestres.map((sem, index) => (
                <option key={index} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Filial"
              value={filial}
              onChange={(e) => setFilial(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
            />
          </div>
          <input
            type="text"
            placeholder="Estado de Sílabo"
            value={procesoSilabo}
            onChange={(e) => setProcesoSilabo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
          />
          <input
            type="text"
            placeholder="Entrega de silabo"
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
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
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-gray-500 text-white rounded bg-blue-500"
          >
            Descargar
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-700">
              <th className="px-4 py-2 border-b font-medium text-white">
                Curso
              </th>
              <th className="px-4 py-2 border-b font-medium text-white">
                Docente
              </th>
              <th className="px-4 py-2 border-b font-medium text-white">
                Filial
              </th>
              <th className="px-4 py-2 border-b font-medium text-white">
                Periodo
              </th>
              <th className="px-4 py-2 border-b font-medium text-white">
                Fecha de envio
              </th>
              <th className="px-4 py-2 border-b font-medium text-white">
                Estado Sílabo
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((carga) => (
              <tr key={carga.idCargaDocente} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b text-center">
                  {carga.curso?.name}
                </td>
                <td className="px-4 py-2 border-b text-center">{`${carga.nomdocente} ${carga.apedocente}`}</td>
                <td className="px-4 py-2 border-b text-center">
                  {carga.filial?.name}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {carga.semestre_academico?.nomSemestre}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {carga.semestre_academico?.fLimiteSilabo}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {carga.curso?.estado_silabo}
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
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === 1
              ? 'bg-gray-300'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Anterior
        </button>
        <span className="mx-2">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Index;
