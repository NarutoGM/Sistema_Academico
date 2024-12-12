import React, { useRef } from 'react';
import { jsPDF } from 'jspdf'; // Importar jsPDF para la generación de PDFs
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importar el plugin

interface ReportePDFProps {
  disabled: boolean; // Prop para deshabilitar el botón
  docentes: any[];
  idFilial: number;
  idDirector: number;
}

const ReportePDF: React.FC<ReportePDFProps> = ({
  disabled,
  docentes,
  idFilial,
  idDirector,
}) => {
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<HTMLCanvasElement | null>(null);

  // Función para generar el gráfico de barras
  const generarBarChart = () => {
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
              labels: docentes.map(
                (docente) => `${docente.nombre} ${docente.apellido}`,
              ),
              datasets: [
                {
                  label: 'Número de Cursos Asignados',
                  data: docentes.map((docente) => docente.nroCursos),
                  backgroundColor: [
                    '#36A2EB',
                    '#FF6384',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                  ], // Colores para las barras
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: false,
              plugins: {
                legend: { display: false }, // Ocultar leyenda para gráficos más limpios
                datalabels: {
                  display: true,
                  align: 'end',
                  anchor: 'end',
                  formatter: (value) => value, // Mostrar el valor en las barras
                  color: '#000',
                  font: {
                    weight: 'bold',
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 45, // Rotar etiquetas del eje X
                    minRotation: 0,
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1, // Incrementos de 1 en el eje Y
                    precision: 0, // Asegurarse de que sean enteros
                  },
                },
              },
            },
          });
          
      }
    }
  };

  // Función para generar el gráfico de pastel
  const generarPieChart = () => {
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      if (ctx) {
        const totalDocentes = docentes.length;
        const enProceso = docentes.filter((docente) => docente.nroCursos > 0)
          .length;
        const sinIniciar = totalDocentes - enProceso;

        new Chart(ctx, {
          type: 'pie',
          plugins: [ChartDataLabels], // Usar el plugin de etiquetas
          data: {
            labels: ['En proceso', 'Sin iniciar'],
            datasets: [
              {
                data: [enProceso, sinIniciar],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
              },
            ],
          },
          options: {
            responsive: false,
            plugins: {
              legend: { display: true, position: 'bottom' },
              datalabels: {
                formatter: (value: number, context: any) => {
                  const total = context.chart.data.datasets[0].data.reduce(
                    (acc: number, val: number) => acc + val,
                    0,
                  );
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${percentage}%`; // Muestra el porcentaje
                },
                color: '#fff', // Color del texto
                font: {
                  weight: 'bold',
                },
              },
            },
          },
        });
      }
    }
  };

  // Función para generar el PDF
  const generarReporte = () => {
    const doc = new jsPDF();

    // Encabezado
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Universidad Nacional de Trujillo', 105, 10, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Reporte de Carga Docente`, 105, 20, { align: 'center' });
    doc.text('Filial: Trujillo', 105, 30, { align: 'center' });
    doc.text('Director: David Agreda Gamboa', 105, 40, { align: 'center' });
    doc.text(
      `Fecha de Generación: ${new Date().toLocaleDateString()}`,
      105,
      50,
      { align: 'center' },
    );

    // Tabla de Docentes
    doc.setFontSize(14);
    doc.text('Tabla de Docentes', 10, 60);
    doc.autoTable({
      startY: 65,
      head: [['ID', 'Nombre Completo', 'N° de Cursos', 'Estado']],
      body: docentes.map((docente) => [
        docente.id,
        `${docente.nombre} ${docente.apellido}`,
        docente.nroCursos,
        docente.nroCursos === 0 ? 'Sin iniciar' : 'En proceso',
      ]),
    });

    // Agregar gráfico de barras
    if (barChartRef.current) {
      const barChartImage = barChartRef.current.toDataURL('image/png');
      doc.addPage();
      doc.text('Gráfico: Número de Cursos por Docente', 10, 10);
      doc.addImage(barChartImage, 'PNG', 10, 20, 180, 100);
    }

    // Agregar gráfico de pastel
    if (pieChartRef.current) {
      const pieChartImage = pieChartRef.current.toDataURL('image/png');
      doc.addPage();
      doc.text('Gráfico: Estado de los Docentes', 10, 10);
      doc.addImage(pieChartImage, 'PNG', 10, 20, 180, 100);
    }

    // Guardar PDF
    doc.save('Reporte_Carga_Docente.pdf');
  };

  return (
    <div className="flex flex-col items-end mt-6">
      {/* Canvas para renderizar los gráficos */}
      <canvas
        ref={barChartRef}
        style={{ display: 'none' }}
        width={800}
        height={400}
      ></canvas>
      <canvas
        ref={pieChartRef}
        style={{ display: 'none' }}
        width={800}
        height={400}
      ></canvas>

      {/* Botón para generar el reporte */}
      <button
        onClick={() => {
          generarBarChart(); // Generar el gráfico de barras
          generarPieChart(); // Generar el gráfico de pastel
          setTimeout(generarReporte, 500); // Esperar para asegurar que los gráficos estén listos
        }}
        disabled={disabled}
        className="bg-blue-500 text-white text-lg px-20 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Generar Reporte
      </button>
    </div>
  );
};

export default ReportePDF;
