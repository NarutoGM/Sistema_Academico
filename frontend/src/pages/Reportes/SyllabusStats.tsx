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
  const cardColor = (title === 'Sílabos Visados' || title === 'Entregados a Tiempo') ? 
                    "bg-green-100 text-green-700" : 
                    "bg-red-100 text-red-700";

  return (
    <div className={`shadow rounded-lg p-4 flex flex-col items-center justify-center ${cardColor}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-3xl font-bold">{percentage.toFixed(2)}%</div>
    </div>
  );
};

const SyllabusStats: React.FC<SyllabusStatsProps> = ({ data }) => {
  const total = data.length;

  const visados = data.filter(item => item.curso?.estado_silabo === 'Visado').length;
  const rechazados = data.filter(item => item.curso?.estado_silabo === 'Rechazado').length;
  const entregadosATiempo = data.filter(item =>
    new Date(item.silabo?.fEnvio || '') <= new Date(item.semestre_academico?.fLimiteSilabo || '')
  ).length;
  const entregadosTarde = data.filter(item =>
    new Date(item.silabo?.fEnvio || '') > new Date(item.semestre_academico?.fLimiteSilabo || '')
  ).length;

  const stats = [
    { title: 'Sílabos Visados', percentage: (visados / total) * 100 },
    { title: 'Sílabos Rechazados', percentage: (rechazados / total) * 100 },
    { title: 'Entregados a Tiempo', percentage: (entregadosATiempo / total) * 100 },
    { title: 'Entregados Tarde', percentage: (entregadosTarde / total) * 100 },
  ];

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4">  {/* Fila para los dos primeros estados */}
        {stats.slice(0, 2).map(stat => (
          <StatsCard key={stat.title} title={stat.title} percentage={stat.percentage} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">  {/* Fila para los dos últimos estados */}
        {stats.slice(2).map(stat => (
          <StatsCard key={stat.title} title={stat.title} percentage={stat.percentage} />
        ))}
      </div>
    </div>
  );
};

export default SyllabusStats;
