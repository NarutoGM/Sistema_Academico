import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Importar autoTable
import Chart from 'chart.js/auto';

interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  nrocursos: number;
  observacion: string; // "Sí" o "No"
  descripcion: boolean;
  fechaEnvio: string; // Fecha en formato "DD/MM/YYYY"
}

interface ReporteObservacionesProps {
  docentes: Docente[];
}

const ReporteObservaciones: React.FC<ReporteObservacionesProps> = ({ docentes }) => {
  const barChartRef = useRef<HTMLCanvasElement | null>(null);

  const generarPDF = () => {
    const doc = new jsPDF();

    // Filtrar docentes con al menos un curso
    const docentesFiltrados = docentes.filter((docente) => docente.nrocursos > 0);
    const docentesConObservacionSi = docentesFiltrados.filter(
      (docente) => docente.observacion === 'Sí',
    );
    const docentesConFechaPosterior = docentesFiltrados.filter(
      (docente) =>
        new Date(docente.fechaEnvio.split('/').reverse().join('-')) > new Date('2024-09-16'),
    );

    // Encabezado
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Reporte de Observaciones', 105, 10, { align: 'center' });

    // Tabla de Docentes
    doc.setFontSize(12);
    doc.text('Tabla de Observaciones', 10, 20);

    doc.autoTable({
      startY: 25,
      head: [['ID', 'Nombre', 'Observaciones', 'Fecha de Envío']],
      body: docentesFiltrados.map((docente) => [
        docente.id,
        `${docente.nombre} ${docente.apellido}`,
        docente.observacion,
        docente.fechaEnvio,
      ]),
    });

    // Agregar gráfico si existe
    if (barChartRef.current) {
      const chartImage = barChartRef.current.toDataURL('image/png');
      doc.addPage();
      doc.text('Gráfico: Docentes por Criterio', 10, 10);
      doc.addImage(chartImage, 'PNG', 10, 20, 180, 100);
    }

    // Guardar PDF
    doc.save('Reporte_Observaciones.pdf');
  };

  const generarBarChart = () => {
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        // Filtrar docentes con al menos un curso
        const docentesFiltrados = docentes.filter((docente) => docente.nrocursos > 0);

        const docentesConObservacionSi = docentesFiltrados.filter(
          (docente) => docente.observacion === 'Sí',
        ).length;

        const docentesConFechaPosterior = docentesFiltrados.filter(
          (docente) =>
            new Date(docente.fechaEnvio.split('/').reverse().join('-')) > new Date('2024-09-16'),
        ).length;

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Observaciones "Sí"', 'Fecha > 16/09/2024'],
            datasets: [
              {
                label: 'Número de Docentes',
                data: [docentesConObservacionSi, docentesConFechaPosterior],
                backgroundColor: ['#36A2EB', '#FF6384'],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-end mt-6">
      {/* Canvas para el gráfico */}
      <canvas ref={barChartRef} width={800} height={400}></canvas>

      {/* Botón para generar PDF */}
      <button
        onClick={() => {
          generarBarChart();
          setTimeout(generarPDF, 500); // Esperar que el gráfico se genere antes de exportar el PDF
        }}
        className="bg-blue-500 text-white px-10 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
      >
        Generar Reporte
      </button>
    </div>
  );
};

export default ReporteObservaciones;
