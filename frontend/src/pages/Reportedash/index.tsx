import React, { useEffect, useState } from "react";
import { getReporte2, CargaDocente } from "@/pages/services/silabo.services";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip as Tooltiprecharts, Legend as Legendrecharts } from 'recharts';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportColumns: React.FC = () => {
  const [carga1, setCarga1] = useState<CargaDocente[]>([]); // Sílabos Enviados
  const [carga2, setCarga2] = useState<CargaDocente[]>([]); // Sílabos No Enviados
  const [carga3, setCarga3] = useState<CargaDocente[]>([]); // Sílabos Observados
  const [carga4, setCarga4] = useState<CargaDocente[]>([]); // Sílabos Observados
  const [data2, setdata2] = useState<[]>([]); // Sílabos Observados

  const [data3, setData3] = useState([
    { name: 'I', Enviados: 0, Noenviados: 0, Observados: 0, Visado: 0 },
    { name: 'II', Enviados: 0, Noenviados: 0, Observados: 0, Visado: 0 },
    { name: 'III', Enviados: 0, Noenviados: 0, Observados: 0, Visado: 0 },
    { name: 'IV', Enviados: 0, Noenviados: 0, Observados: 0, Visado: 0 },
    { name: 'V', Enviados: 0, Noenviados: 0, Observados: 0, Visado: 0 },
    { name: 'VI', Enviados: 0, Noenviados: 0, Observados: 0, Visado: 0 },
    { name: 'VII', Enviados: 0, Noenviados: 0, Observados: 0, Visado: 0 },
    { name: 'VIII', Enviados: 0, Noenviados: 0, Observados: 0, Visado: 0 },
    { name: 'IX', Enviados: 0, Noenviados: 0, Observados: 0, Visado: 0 },
    { name: 'X', Enviados: 0, Noenviados: 0, Observados: 0, Visado: 0 },
  ]);

  // Mapear los índices del arreglo `data3` para acceder rápidamente según el ciclo


  useEffect(() => {
    const fetchData = async () => {
      try {




        const data = await getReporte2();
        const cargadocente = data.cargadocente || [];

        if (!Array.isArray(cargadocente)) {
          console.error("La propiedad 'cargadocente' no es un arreglo.");
          return;
        }

        const esperando: CargaDocente[] = [];
        const sinenvio: CargaDocente[] = [];
        const visado: CargaDocente[] = [];
        const rechazados: CargaDocente[] = [];



        const cicloMap = data3.reduce((map, item, index) => {
          map[item.name] = index;
          return map;
        }, {});

        data3.forEach((item) => {
          item.Enviados = 0;
          item.Visado = 0;
          item.Observados = 0;
          item.Noenviados = 0;
        });


        cargadocente.forEach((element) => {

          const ciclo = element.ciclo; // Obtener el ciclo del elemento
          if (cicloMap[ciclo] !== undefined) {
            const dataIndex = cicloMap[ciclo]; // Obtener el índice correspondiente en `data3`

            if (element.silabo != null) {
              // Actualizar los campos según el estado del silabo
              if (element.silabo.estado == 1) {
                data3[dataIndex].Enviados += 1;
              } else if (element.silabo.estado == 3) {
                data3[dataIndex].Visado += 1;
              } else if (element.silabo.estado == 2) {
                data3[dataIndex].Observados += 1;
              }
            } else {
              // Si no tiene silabo, incrementar Noenviados
              data3[dataIndex].Noenviados += 1;
            }
          }



          if (element.silabo != null) {


            if (element.silabo.estado == 1) {
              esperando.push(element);
            }
            if (element.silabo.estado == 3) {
              visado.push(element);
            }
            if (element.silabo.estado == 2) {
              rechazados.push(element);
            }

          }

          if (element.silabo == null) {
            sinenvio.push(element);
          }

        });

        setCarga1(esperando);
        setCarga2(sinenvio);

        setCarga3(visado);

        setCarga4(rechazados);

        setdata2([
          { name: "Sin Envío", NoEnviados: sinenvio.length },
          { name: "Obs", Obs: rechazados.length },
        ]);




        console.log(data3);


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


  const CargasConRetraso = carga1.reduce((acc, carga) => {
    // Determinar si el sílabo está retrasado
    const estaRetrasada = carga.silabo?.fEnvio && carga.semestre_academico?.fLimiteSilabo
        ? new Date(carga.silabo.fEnvio) > new Date(carga.semestre_academico.fLimiteSilabo) // Revisión de fechas
        : false; // En caso de valores no válidos, asumimos que no está retrasado

    // Clasificar según el estado
    const clave = estaRetrasada ? "Con retraso" : "A tiempo";

    // Incrementar el conteo en la categoría correspondiente
    acc[clave] = (acc[clave] || 0) + 1;

    return acc;
}, {});

const pieData2 = {
  labels: Object.keys(CargasConRetraso), // Etiquetas basadas en las claves del objeto
  datasets: [
      {
          data: Object.values(CargasConRetraso), // Datos de las categorías
          backgroundColor: [
              "#FFCE56", // Color para la categoría "Con retraso"
              "#36A2EB", // Color para la categoría "A tiempo"
          ],
          hoverBackgroundColor: [
              "#FFCE56",
              "#36A2EB",
          ],
      },
  ],
};

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
  const VerticalStackedBarChart = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data3}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="category" dataKey="name" />
          <YAxis type="number" />
          <Tooltiprecharts />
          <Legendrecharts />
          <Bar dataKey="Enviados" stackId="a" fill="#8884d8" />
          <Bar dataKey="Noenviados" stackId="a" fill="#d84c6f" />
          <Bar dataKey="Observados" stackId="a" fill="#ffc658" />
          <Bar dataKey="Visado" stackId="a" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  return (
    <div >
      {/* Primera columna: Sílabos Observados */}
      <div className="flex-1 p-4 border border-gray-300 rounded-lg bg-white shadow">
        <h2 className="text-lg font-semibold mb-2">Conteo de Silabos en el semestre actual</h2>
        <VerticalStackedBarChart />

      </div>
      <div className="flex flex-col md:flex-row gap-4 p-4">

        {/* Primera columna: Sílabos Enviados */}
        <div className="flex-1 p-4 border border-gray-300 rounded-lg bg-white shadow">
          <h2 className="text-lg font-semibold mb-2">Sílabos Enviados</h2>
          {carga1 && carga1.length > 0 ? (
            <>
              <h3 className="text-md font-semibold mb-2">Distribución por Filial</h3>

              <div className="flex my-3  justify-center items-center">
                  <div className="w-48 h-48">
                  <Pie data={pieData} />

                </div>


                <div className="flex justify-center items-center">
                  <div className="w-48 h-48">
                    <Pie data={pieData2} />

                  </div>
                </div>


              </div>
              <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">CodCurso</th>
                    <th className="border border-gray-300 px-4 py-2">Curso</th>
                    <th className="border border-gray-300 px-4 py-2">Filial</th>
                    <th className="border border-gray-300 px-4 py-2">Semestre</th>
                    <th className="border border-gray-300 px-4 py-2">Ciclo</th>
                    <th className="border border-gray-300 px-4 py-2">Docente</th>

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
                        {`${carga.nomdocente || ''} ${carga.apedocente || ''}`}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {carga.silabo?.fEnvio
                          ? new Date(carga.silabo.fEnvio).toLocaleDateString("es-ES")
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </>
          ) : (
            <p>No hay sílabos enviados.</p>
          )}
        </div>

        {/* Segunda columna: Sílabos No Enviados */}
        <div className="flex-1 p-4 border border-gray-300 rounded-lg bg-white shadow">
          <h2 className="text-lg font-semibold mb-2">Sílabos No Enviados</h2>
          <div className="flex justify-center items-center">
            <div className="w-full h-64 m-8">
              <ResponsiveContainer width="100%" height="100%">



                <BarChart data={data2} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltiprecharts />
                  <Legendrecharts />
                  <Bar dataKey="Obs" fill="#ffc658" />
                  <Bar dataKey="NoEnviados" fill="#d84c6f" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {carga2 && carga2.length > 0 ? (
            <>
              <div>
                <h3 className="text-md font-semibold mb-2">Distribución no gestionados</h3>
              </div>
              <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">CodCurso</th>
                    <th className="border border-gray-300 px-4 py-2">Curso</th>
                    <th className="border border-gray-300 px-4 py-2">Filial</th>
                    <th className="border border-gray-300 px-4 py-2">Semestre</th>
                    <th className="border border-gray-300 px-4 py-2">Ciclo</th>
                    <th className="border border-gray-300 px-4 py-2">Docente</th>
                    <th className="border border-gray-300 px-4 py-2">Notificar</th>

                  </tr>
                </thead>
                <tbody>
                  {carga2.map((carga) => (
                    <tr key={carga.idCargaDocente} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{carga.idCurso || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{carga.curso?.name || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{carga.filial?.name || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{carga.semestre_academico?.nomSemestre || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{carga.ciclo || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {`${carga.nomdocente || ''} ${carga.apedocente || ''}`}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Notificar
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </>
          ) : (
            <p>No hay sílabos enviados.</p>
          )}
          {carga4 && carga4.length > 0 ? (
            <>
              <div>
                <h3 className="text-md font-semibold mb-2">Silabos observados</h3>
              </div>
              <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">CodCurso</th>
                    <th className="border border-gray-300 px-4 py-2">Curso</th>
                    <th className="border border-gray-300 px-4 py-2">Filial</th>
                    <th className="border border-gray-300 px-4 py-2">Semestre</th>
                    <th className="border border-gray-300 px-4 py-2">Ciclo</th>
                    <th className="border border-gray-300 px-4 py-2">Docente</th>

                  </tr>
                </thead>
                <tbody>
                  {carga4.map((carga) => (
                    <tr key={carga.idCargaDocente} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{carga.idCurso || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{carga.curso?.name || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{carga.filial?.name || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{carga.semestre_academico?.nomSemestre || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{carga.ciclo || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {`${carga.nomdocente || ''} ${carga.apedocente || ''}`}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

            </>
          ) : (
            <p>No hay sílabos enviados.</p>
          )}
        </div>
      </div>

    </div>

  );
};

export default ReportColumns;
