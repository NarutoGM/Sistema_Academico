import React from 'react';

interface CargaDocente {
  idCargaDocente: number;
  curso?: {
    name: string;
    estado_silabo: string;
  };
  nomdocente: string;
  apedocente: string;
  filial?: {
    name: string;
  };
  semestre_academico?: {
    nomSemestre: string;
    fLimiteSilabo: string;
  };
  silabo?: {
    fEnvio: string;
  };
}

interface SyllabusStatsProps {
  data: CargaDocente[];
}

const StatsCard = ({ title, percentage }: { title: string; percentage: number }) => {
  let cardColor = "";  // Inicializamos la variable que almacenará las clases de color

  if (title === 'Entregados a Tiempo') {
    cardColor = "bg-green-100 text-green-700";
  } else if (title === 'Entregados Tarde') {
    cardColor = "bg-red-100 text-red-700";
  } else if (title === 'Sin entregar') {
    cardColor = "bg-yellow-100 text-yellow-700";  // Color amarillo claro para 'Sin entregar'
  } else {
    cardColor = "bg-gray-100 text-gray-700";  // Un color neutral por defecto para cualquier otro título
  }

  return (
    <div className={`shadow rounded-lg p-4 flex flex-col items-center justify-center ${cardColor}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-3xl font-bold">{percentage.toFixed(2)}%</div>
    </div>
  );
};

const SyllabusStats: React.FC<SyllabusStatsProps> = ({ data }) => {
  const total = data.length;
  const entregadosATiempo = data.filter(item =>
    new Date(item.silabo?.fEnvio || '') <= new Date(item.semestre_academico?.fLimiteSilabo || '')
  ).length;
  const entregadosTarde = data.filter(item =>
    new Date(item.silabo?.fEnvio || '') > new Date(item.semestre_academico?.fLimiteSilabo || '')
  ).length;

  const stats = [
    { title: 'Entregados a Tiempo', percentage: (entregadosATiempo / total) * 100 },
    { title: 'Entregados Tarde', percentage: (entregadosTarde / total) * 100 },
    { title: 'Sin entregar', percentage: ((total - (entregadosTarde + entregadosATiempo)) / total) * 100 },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">  {/* Una sola fila para todas las tarjetas */}
      {stats.map(stat => (
        <StatsCard key={stat.title} title={stat.title} percentage={stat.percentage} />
      ))}
    </div>
  );
};

export default SyllabusStats;
