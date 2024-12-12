import React, { useRef, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-plugin-datalabels';  // Importa el plugin de datalabels

const SyllabusPieChart = ({ data, onImageReady }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartRef.current) {
        const chartImage = chartRef.current.toBase64Image();
        onImageReady(chartImage);
      }
    }, 9000);  // Ajuste del tiempo según la necesidad

    return () => clearTimeout(timer);
  }, [data, onImageReady]);

  const total = data.length;
  const entregadosATiempo = data.filter(item =>
    new Date(item.silabo?.fEnvio || '') <= new Date(item.semestre_academico?.fLimiteSilabo || '')
  ).length;
  const entregadosTarde = data.filter(item =>
    new Date(item.silabo?.fEnvio || '') > new Date(item.semestre_academico?.fLimiteSilabo || '')
  ).length;

  const Ftiempo = +((entregadosATiempo / total) * 100).toFixed(2);
  const Ftarde = +((entregadosTarde / total) * 100).toFixed(2);
  const FnoEntregado = +(((total - (entregadosTarde + entregadosATiempo)) / total) * 100).toFixed(2);


  const chartData = {
    labels: ['Sin entregar'+ ' : '+FnoEntregado + ' % ', 'Entregado tarde'+ ' : '+Ftarde+ ' % ', 'Entregado a tiempo'+ ' : '+Ftiempo+ ' % '],
    datasets: [{
      data: [FnoEntregado, Ftarde, Ftiempo],
      backgroundColor: ['#f9e79f', '#ff4757', '#2ed573'],
      borderColor: ['#f5c6cb', '#ff6b81', '#26de81'],
      borderWidth: 1,
    }]
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        color: '#fff',  // Color de la etiqueta
        font: {
          weight: 'bold'
        },
        formatter: (value, context) => {
          return value.toFixed(2) + '%';  // Formato para mostrar los porcentajes
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return ' ' + tooltipItem.raw.toFixed(2) + '%';
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Pie data={chartData} options={options} ref={chartRef} />
    </div>
  );
};

export default SyllabusPieChart;
