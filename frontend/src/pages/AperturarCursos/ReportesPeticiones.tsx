import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2'; // Gráficos
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement } from 'chart.js'; // Registro de Chart.js
import { getPeticiones } from '@/pages/services/peticiones.services'; // Servicio para obtener las peticiones
import { jsPDF } from 'jspdf'; // Para la generación de PDF
import html2canvas from 'html2canvas'; // Para tomar capturas de pantalla del gráfico

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

const ReportesPeticiones: React.FC = () => {
    const [peticiones, setPeticiones] = useState<any[]>([]); // Para guardar las peticiones
    const [estadisticas, setEstadisticas] = useState({ enProceso: 0, aceptado: 0, rechazado: 0 });
    
    useEffect(() => {
        // Obtener las peticiones desde el servicio
        getPeticiones()
            .then((data) => {
                setPeticiones(data);
                contarEstados(data); // Contar los estados de las peticiones
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Función para contar los estados de las peticiones
    const contarEstados = (peticiones: any[]) => {
        const estadisticasContadas = peticiones.reduce((acc, peticion) => {
            if (peticion.estado === 'En Proceso') acc.enProceso += 1;
            if (peticion.estado === 'Aceptado') acc.aceptado += 1;
            if (peticion.estado === 'Rechazado') acc.rechazado += 1;
            return acc;
        }, { enProceso: 0, aceptado: 0, rechazado: 0 });
        
        setEstadisticas(estadisticasContadas);
    };

    // Datos para el gráfico de pie
    const pieChartData = {
        labels: ['En Proceso', 'Aceptado', 'Rechazado'],
        datasets: [
            {
                data: [estadisticas.enProceso, estadisticas.aceptado, estadisticas.rechazado],
                backgroundColor: ['#FFEB3B', '#4CAF50', '#F44336'],
                hoverBackgroundColor: ['#FFF176', '#66BB6A', '#E57373'],
            },
        ],
    };

    // Datos para el gráfico de barras
    const barChartData = {
        labels: ['Estados'],
        datasets: [
            {
                label: 'Cantidad de Peticiones',
                data: [estadisticas.enProceso, estadisticas.aceptado, estadisticas.rechazado],
                backgroundColor: '#3B82F6',
                borderColor: '#2563EB',
                borderWidth: 1,
            },
        ],
    };

    // Función para generar el PDF
    const generarPDF = () => {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const marginLeft = 10;
        let currentHeight = 10;

        pdf.setFontSize(16);
        pdf.text('Reporte de Peticiones de Cursos', pageWidth / 2, currentHeight, { align: 'center' });
        currentHeight += 10;

        // Agregar tabla de estadísticas
        pdf.setFontSize(12);
        pdf.text('Cantidad de Peticiones por Estado:', marginLeft, currentHeight);
        currentHeight += 10;

        pdf.setFontSize(10);
        pdf.text(`En Proceso: ${estadisticas.enProceso}`, marginLeft, currentHeight);
        currentHeight += 7;
        pdf.text(`Aceptado: ${estadisticas.aceptado}`, marginLeft, currentHeight);
        currentHeight += 7;
        pdf.text(`Rechazado: ${estadisticas.rechazado}`, marginLeft, currentHeight);
        currentHeight += 10;

        // Tomar una captura del gráfico de pie
        if (document.getElementById('pie-chart')) {
            html2canvas(document.getElementById('pie-chart')).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', marginLeft, currentHeight, pageWidth - 2 * marginLeft, 100);
                currentHeight += 110;
                pdf.save('reporte-peticiones.pdf');
            });
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Reporte de Peticiones de Cursos</h1>

            <div className="flex justify-between mb-4">
                <div>
                    <h3 className="text-lg font-medium">Gráfico de Distribución de Estados</h3>
                    <Pie id="pie-chart" data={pieChartData} />
                </div>
                <div>
                    <h3 className="text-lg font-medium">Gráfico de Barras</h3>
                    <Bar data={barChartData} />
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-medium">Tabla de Peticiones</h3>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-blue-700">
                            <th className="px-4 py-2 border-b font-medium text-white">Curso</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Fecha</th>
                            <th className="px-4 py-2 border-b font-medium text-white">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {peticiones.map((peticion) => (
                            <tr key={peticion.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border-b text-center">{peticion.curso}</td>
                                <td className="px-4 py-2 border-b text-center">{peticion.fecha}</td>
                                <td className="px-4 py-2 border-b text-center">{peticion.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <button
                    onClick={generarPDF}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Generar PDF
                </button>
            </div>
        </div>
    );
};

export default ReportesPeticiones;
