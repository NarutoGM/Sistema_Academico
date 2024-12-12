import React, { useEffect, useState } from "react";
import { getReporte2, CargaDocente } from "@/pages/services/silabo.services";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportColumns: React.FC = () => {
  const [carga1, setCarga1] = useState<CargaDocente[]>([]); // Sílabos Enviados
  const [carga2, setCarga2] = useState<CargaDocente[]>([]); // Sílabos No Enviados
  const [carga3, setCarga3] = useState<CargaDocente[]>([]); // Sílabos Observados

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReporte2();
        const cargadocente = data.cargadocente || [];

        if (!Array.isArray(cargadocente)) {
          console.error("La propiedad 'cargadocente' no es un arreglo.");
          return;
        }

        const esperando = [];
        const sinenvio = [];
        const visado = [];

        cargadocente.forEach((element) => {
          if (element.curso?.estado_silabo === "Esperando aprobación") {
            esperando.push(element);
          }
          if (element.curso?.estado_silabo === "Sin envio de silabo") {
            sinenvio.push(element);
          }
          if (element.curso?.estado_silabo === "Visado") {
            visado.push(element);
          }
        });

        setCarga1(esperando);
        setCarga2(sinenvio);
        setCarga3(visado);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  // Datos para el gráfico de pastel basado en la propiedad "filial"
  const filialCounts = carga1.reduce((acc, carga) => {
    const filialName = carga.filial?.name || "N/A";
    acc[filialName] = (acc[filialName] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(filialCounts),
    datasets: [
      {
        data: Object.values(filialCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Primera columna: Sílabos Enviados */}
      <div className="flex-1 p-4 border border-gray-300 rounded-lg bg-white shadow">
        <h2 className="text-lg font-semibold mb-2">Sílabos Enviados</h2>
        {carga1 && carga1.length > 0 ? (
          <>
            <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">CodCurso</th>
                  <th className="border border-gray-300 px-4 py-2">Curso</th>
                  <th className="border border-gray-300 px-4 py-2">Filial</th>
                  <th className="border border-gray-300 px-4 py-2">Semestre</th>
                  <th className="border border-gray-300 px-4 py-2">Ciclo</th>
                  <th className="border border-gray-300 px-4 py-2">Fecha de envio</th>
                </tr>
              </thead>
              <tbody>
                {carga1.map((carga) => (
                  <tr key={carga.idCargaDocente} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{carga.idCurso || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{carga.curso?.name || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{carga.filial?.name || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{carga.semestre_academico?.nomSemestre || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{carga.ciclo || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {carga.silabo?.fEnvio
                        ? new Date(carga.silabo.fEnvio).toLocaleDateString("es-ES")
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <h3 className="text-md font-semibold mb-2">Distribución por Filial</h3>
              <Pie data={pieData} />
            </div>
          </>
        ) : (
          <p>No hay sílabos enviados.</p>
        )}
      </div>

      {/* Segunda columna: Sílabos No Enviados */}
      <div className="flex-1 p-4 border border-gray-300 rounded-lg bg-white shadow">
        <h2 className="text-lg font-semibold mb-2">Sílabos No Enviados</h2>
        {carga2.length > 0 ? (
          <ul className="list-disc pl-5">
            {carga2.map((silabo) => (
              <li key={silabo.id}>{silabo.titulo}</li>
            ))}
          </ul>
        ) : (
          <p>No hay sílabos no enviados.</p>
        )}
      </div>

      {/* Tercera columna: Sílabos Observados */}
      <div className="flex-1 p-4 border border-gray-300 rounded-lg bg-white shadow">
        <h2 className="text-lg font-semibold mb-2">Sílabos Observados</h2>
        {carga3.length > 0 ? (
          <ul className="list-disc pl-5">
            {carga3.map((silabo) => (
              <li key={silabo.id}>{silabo.titulo}</li>
            ))}
          </ul>
        ) : (
          <p>No hay sílabos observados.</p>
        )}
      </div>
    </div>
  );
};

export default ReportColumns;
