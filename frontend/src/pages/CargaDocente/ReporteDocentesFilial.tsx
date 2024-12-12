import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';

interface DocenteFilial {
  id: number;
  nombre: string;
  apellido: string;
  enFilial1: boolean;
  enFilial3: boolean;
  enAmbas: boolean;
}

interface ReporteDocentesFilialProps {
  docentesFilial: DocenteFilial[];
}

const ReporteDocentesFilial: React.FC<ReporteDocentesFilialProps> = ({
  docentesFilial,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const generarGrafico = () => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        // Destruir la instancia previa si existe
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        // Categorizar docentes
        const docentesSoloFilial1 = docentesFilial.filter(
          (docente) => docente.enFilial1 && !docente.enFilial3,
        ).length;

        const docentesSoloFilial3 = docentesFilial.filter(
          (docente) => docente.enFilial3 && !docente.enFilial1,
        ).length;

        const docentesAmbasFiliales = docentesFilial.filter(
          (docente) => docente.enAmbas,
        ).length;

        // Crear una nueva instancia del gráfico
        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [
              'Solo Filial Trujillo',
              'Solo Filial Valle Jequetepeque',
              'Ambas Filiales',
            ],
            datasets: [
              {
                label: 'Número de Docentes',
                data: [
                  docentesSoloFilial1,
                  docentesSoloFilial3,
                  docentesAmbasFiliales,
                ],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      }
    }
  };

  const generarPDF = () => {
    generarGrafico(); // Generar el gráfico antes del PDF

    setTimeout(() => {
      const doc = new jsPDF();

      // Encabezado del PDF
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Reporte de Docentes por Ambas Filiales', 105, 10, {
        align: 'center',
      });

      // Tabla de docentes
      doc.setFontSize(12);
      doc.text('Tabla de Docentes por Filiales', 10, 20);

      doc.autoTable({
        startY: 25,
        head: [
          [
            'ID',
            'Nombre',
            'Filial Trujillo',
            'Filial Valle Jequetepeque',
            'Ambas Filiales',
          ],
        ],
        body: docentesFilial.map((docente) => [
          docente.id,
          `${docente.nombre} ${docente.apellido}`,
          docente.enFilial1 ? 'Sí' : 'No',
          docente.enFilial3 ? 'Sí' : 'No',
          docente.enAmbas ? 'Sí' : 'No',
        ]),
      });

      // Agregar gráfico al PDF si está disponible
      if (chartRef.current) {
        const chartImage = chartRef.current.toDataURL('image/png');
        doc.addPage();
        doc.text('Gráfico: Distribución de Docentes por Filiales', 10, 10);
        doc.addImage(chartImage, 'PNG', 10, 20, 180, 100);
      }

      // Guardar el PDF
      doc.save('Reporte_Docentes_Filiales.pdf');
    }, 500); // Espera para asegurarte de que el gráfico se haya generado
  };

  return (
    <div className="flex flex-col items-center mt-6">
      {/* Canvas para el gráfico */}
      <canvas ref={chartRef} className="w-full max-w-lg mb-4"></canvas>
  
      {/* Contenedor para el botón */}
      <div className="w-full flex justify-end">
        <button
          onClick={generarPDF}
          className="bg-blue-500 text-white px-10 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Generar PDF de Docentes
        </button>
      </div>
    </div>
  );
  
};

export default ReporteDocentesFilial;
