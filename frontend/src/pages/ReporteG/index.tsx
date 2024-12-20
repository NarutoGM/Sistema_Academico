import React, { useEffect, useState } from 'react';
import {
  getReporte,
  CargaDocente,
} from '@/pages/services/silabo.services';
import 'quill/dist/quill.snow.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SyllabusPieChart from './SyllabusPieChart';
import SyllabusStats from './SyllabusStats';  // Asegúrate de ajustar la ruta de importación según la ubicación real
import './style.css';

import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importar el plugin

const Index: React.FC = () => {
  const [chartImage, setChartImage] = useState(null);

  const handleImageReady = (image) => {
    setChartImage(image);
  };
  const [cargaDocente, setCargaDocente] = useState<CargaDocente[]>([]);
  const [filteredData, setFilteredData] = useState<CargaDocente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtros
  const [codigoCurso, setCodigoCurso] = useState('');
  const [curso, setCurso] = useState('');
  const [filial, setFilial] = useState('');
  const [semestre, setSemestre] = useState('');
  const [procesoSilabo, setProcesoSilabo] = useState('');
  const [docente, setDocente] = useState('');
  const [entregaSilabo, setEntregaSilabo] = useState('');

  // Información adicional para el reporte
  const [filiales, setFiliales] = useState<string[]>([]); // Opciones de filiales
  const [semestres, setSemestres] = useState<string[]>([]);
  const [estados, setEstados] = useState<string[]>([]);

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

        // Extraer las filiales únicas
        const uniqueFiliales = Array.from(
          new Set(docenteArray.map((item) => item.filial?.name).filter(Boolean)),
        );
        setFiliales(uniqueFiliales);

        // Extraer estados de silabos
        const uniqueEstados = Array.from(
          new Set(docenteArray.map((item) => item.curso?.estado_silabo).filter(Boolean)),
        );
        setEstados(uniqueEstados);
        
      })
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    const filtered = cargaDocente.filter((item) => {
      const estadoSilabo = item.curso?.estado_silabo || 'Curso por gestionar';
      const nombreDocente = `${item.nomdocente} ${item.apedocente}`.toLowerCase();
  
      // Procesar fechas
      const fEnvio = item.silabo?.fEnvio ? new Date(item.silabo.fEnvio) : null;
      const fLimiteSilabo = item.semestre_academico?.fLimiteSilabo
        ? new Date(item.semestre_academico.fLimiteSilabo)
        : null;
  
      let cumpleEntrega = true; // Valor por defecto si no se selecciona filtro de entrega
  
      if (entregaSilabo) {
        if (!fEnvio || !fLimiteSilabo) {
          // Si no hay fecha de envío o fecha límite, no cumple con los criterios de entrega
          cumpleEntrega = false;
        } else {
          // Aplicar filtro basado en las fechas
          cumpleEntrega = entregaSilabo === 'aTiempo'
            ? fEnvio <= fLimiteSilabo
            : entregaSilabo === 'tarde'
            ? fEnvio > fLimiteSilabo
            : true;
        }
      }
  
      return (
        (codigoCurso ? item.idCurso.toString().includes(codigoCurso) : true) &&
        (curso ? item.curso?.name.toLowerCase().includes(curso.toLowerCase()) : true) &&
        (filial ? item.filial?.name.toLowerCase().includes(filial.toLowerCase()) : true) &&
        (semestre ? item.semestre_academico?.nomSemestre === semestre : true) &&
        (procesoSilabo ? estadoSilabo.toLowerCase().includes(procesoSilabo.toLowerCase()) : true) &&
        (docente ? nombreDocente.includes(docente.toLowerCase()) : true) &&
        cumpleEntrega
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
    entregaSilabo,
    cargaDocente,
  ]);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Función para generar el PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Cargar imagen del logo
    const imgUrl = `${window.location.origin}/images/logo.png`;
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      doc.addImage(img, 'PNG', 150, 10, 45, 20);  // Ajustar posición y tamaño del logo
  
      // Título y metadatos
      doc.setFontSize(14);
      doc.text('Reporte de Sílabo', 14, 20);
      doc.setFontSize(10);
      {currentData.map((carga) => (
        doc.text(`Generado por: ${carga.name} ${carga.lastname}`, 14, 30)
      ))}
      

      
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 35);
  
      // Generar tabla
      const tableData = filteredData.map((carga) => [
        carga.curso?.name || 'N/A',
        `${carga.nomdocente} ${carga.apedocente}` || 'N/A',
        carga.filial?.name || 'N/A',
        carga.semestre_academico?.nomSemestre || 'N/A',
        carga.silabo?.fEnvio || 'N/A',
        carga.semestre_academico?.fLimiteSilabo || 'N/A',
        carga.estado === false ? "Visado" :
          carga.silabo === null ? "Aún no envía sílabo" :
          carga.silabo?.estado === 1 ? "Pendiente revisión" :
          carga.silabo?.estado === 2 ? "Rechazado" :
          carga.silabo?.estado === 3 ? "Visado" : "Sin enviar",
      ]);
  
      doc.autoTable({
        head: [['Curso', 'Docente', 'Filial', 'Periodo', 'Fecha envío', 'Fecha Límite', 'Estado Sílabo']],
        body: tableData,
        startY: 50,
      });
  
      const finalY = doc.autoTable.previous.finalY;  // Posición Y después de la tabla
  
      setTimeout(() => {
        // Agregar imagen del gráfico si está disponible y después de la tabla
        if (chartImage) {
          doc.addImage(chartImage, 'JPEG', 15, finalY + 10, 180, 100);  // Ajusta según sea necesario
        }
        
        // Descargar PDF
        doc.save('reporte_silabos.pdf');
      }, 1000);  // Retraso de 5 segundos
    };
  
    img.onerror = () => {
      console.error('No se pudo cargar el logo.');
    };
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reporte de entrega de silabos</h1>
      {/* Componente del gráfico de pastel */}
      <div className="grid grid-cols-2 gap-4">  
        <SyllabusPieChart data={filteredData} onImageReady={handleImageReady}/>
        <SyllabusStats data={filteredData} /> 
      </div>
      
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
            <select
              value={filial}
              onChange={(e) => setFilial(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
            >
              <option value="" disabled>
                Seleccionar Filial
              </option>
              {filiales.map((fil, index) => (
                <option key={index} value={fil}>
                  {fil}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Docente"
            value={docente}
            onChange={(e) => setDocente(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
          />
          
          <button type="button" className="btn" onClick={handleDownloadPDF}>
            <strong>DESCARGAR </strong>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
              />
            </svg>
            <div id="container-stars">
              <div id="stars"></div>
            </div>

            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
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
                Fecha envio
              </th>
              <th className="px-4 py-2 border-b font-medium text-white">
                Fecha Limite
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
                  {carga.silabo?.fEnvio || 'N/A'}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {carga.semestre_academico?.fLimiteSilabo || 'N/A'}
                </td>
                <td className={`px-4 py-2 border-b text-center
                    ${carga.silabo?.estado === null 
                            ? "bg-gray-100 text-gray-600 border border-gray-300" 
                            : carga.silabo?.estado === 1 
                                ? "bg-blue-100 text-blue-600 border border-blue-300" 
                                : carga.silabo?.estado === 2 
                                    ? "bg-red-100 text-red-600 border border-red-300" 
                                    : carga.silabo?.estado === 3 
                                        ? "bg-green-100 text-green-600 border border-green-300" 
                                        : "bg-yellow-100 text-yellow-600 border border-yellow-300" 
                    }`} >
                  {carga.estado === false 
                        ? "Visado" 
                        : carga.silabo === null 
                            ? "Aun no envia silabo" 
                            : carga.silabo?.estado === 1 
                                ? "Pendiente revision" 
                                : carga.silabo?.estado === 2 
                                    ? "Rechazado" 
                                    : carga.silabo?.estado === 3 
                                        ? "Visado" 
                                        : "Sin enviar"} 
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
