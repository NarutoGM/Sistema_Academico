import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const SyllabusPieChart = ({ data }) => {
  const statusCounts = {
    sinEnvio: data.filter(item => !item.silabo?.fEnvio).length,
    esperando: data.filter(item => item.curso?.estado_silabo === 'Esperando aprobación').length,
    rechazado: data.filter(item => item.curso?.estado_silabo === 'Rechazado').length,
    visado: data.filter(item => item.curso?.estado_silabo === 'Visado').length,
  };

  const chartData = {
    labels: ['Sin Envío', 'Esperando Aprobación', 'Rechazado', 'Visado'],
    datasets: [{
      data: [statusCounts.sinEnvio, statusCounts.esperando, statusCounts.rechazado, statusCounts.visado],
      backgroundColor: ['#f9e79f ', '#2980b9 ', '#ff4757', '#2ed573'],
      borderColor: ['#f5c6cb', '#ffeeba', '#ff6b81', '#26de81'],
      borderWidth: 1,
    }]
  };

  const options = {
    maintainAspectRatio: false,  // Asegura que el aspecto del gráfico no afecte el tamaño
    responsive: true            // Asegura que el gráfico sea responsivo
  };

  return (
    <div style={{ width: '50%', height: '300px', maxWidth: '400px', margin: '0 auto' }}>
      <h3>Estado de Sílabos</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default SyllabusPieChart;
