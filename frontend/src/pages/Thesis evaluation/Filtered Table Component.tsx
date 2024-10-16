import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Eye, Edit, Download } from 'lucide-react';
import { To, useNavigate } from 'react-router-dom';





const FilteredThesis = () => {
  
  const navigate = useNavigate();

  const handleNavigate = (path: To) => {
    navigate(path);
  };
  const initialData = [
    { id: 1, nombre: 'Primer Ejemplar', autor: 'Roman', fechaInicio: '01/01/2023', fechaFin: '01/01/2024', estado: 'Aprobado', firma: '3/3', sede: 'Trujillo', tipoTesis: 'final' },
    { id: 2, nombre: 'Segundo Ejemplar', autor: 'Raul', fechaInicio: '03/04/2023', fechaFin: '-', estado: 'En revisión', firma: '1/3', sede: 'Valle', tipoTesis: 'proyecto' },
    { id: 3, nombre: 'Tercer Ejemplar', autor: 'Carlos', fechaInicio: '04/07/2023', fechaFin: '04/07/2024', estado: 'Reprobado', firma: '3/3', sede: 'Trujillo', tipoTesis: 'final' },
    { id: 4, nombre: 'Cuarto Ejemplar', autor: 'Pedro', fechaInicio: '07/11/2023', fechaFin: '07/07/2024', estado: 'Aprobado', firma: '3/3', sede: 'Valle', tipoTesis: 'final' },
    { id: 5, nombre: 'Quinto Ejemplar', autor: 'Juan', fechaInicio: '05/12/2023', fechaFin: '-', estado: 'En revisión', firma: '1/3', sede: 'Trujillo', tipoTesis: 'proyecto' },
  ];

  const [data, setData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({
    tipoTesis: '',
    titulo: '',
    tesistas: '',
    sede: '',
    estado: '',
    fechaInicio: '',
    fechaFin: '',
    fechaSustentacion: ''
  });

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filteredData = initialData.filter(item => {
      return (
        (filters.tipoTesis === '' || item.tipoTesis === filters.tipoTesis) &&
        (filters.titulo === '' || item.nombre.toLowerCase().includes(filters.titulo.toLowerCase())) &&
        (filters.tesistas === '' || item.autor.toLowerCase().includes(filters.tesistas.toLowerCase())) &&
        (filters.estado === '' || item.estado === filters.estado) &&
        (filters.sede === '' || item.sede === filters.sede) &&
        (filters.fechaInicio === '' || new Date(item.fechaInicio) >= new Date(filters.fechaInicio)) &&
        (filters.fechaFin === '' || item.fechaFin === '-' || new Date(item.fechaFin) <= new Date(filters.fechaFin))
      );
    });

    setData(filteredData);
  };

  const handleFilterChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const sortData = (key: string | null) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key , direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key: string | null) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    }
    return <div className="w-3.5 h-3.5" />;  // Placeholder to maintain consistent spacing
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Autor', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Firma', 'Sede', 'tipoTesis'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.nombre,
        item.autor,
        item.fechaInicio,
        item.fechaFin,
        item.estado,
        item.firma,
        item.sede,
        item.tipoTesis
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tabla_filtrada.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4 bg-gray-50">
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>
      <div className="grid grid-cols-5 gap-4">
        <div>
          <select 
            name="tipoTesis"
            value={filters.tipoTesis}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="">Tipo de Tesis</option>
            <option value="proyecto">Proyecto de Tesis</option>
            <option value="final">Tesis Final</option>
          </select>
        </div>
        <div>
          <input 
            type="text" 
            name="titulo"
            value={filters.titulo}
            onChange={handleFilterChange}
            placeholder="Título" 
            className="w-full p-2 border rounded-md" 
          />
        </div>
        <div>
          <input 
            type="text" 
            name="tesistas"
            value={filters.tesistas}
            onChange={handleFilterChange}
            placeholder="Tesistas" 
            className="w-full p-2 border rounded-md" 
          />
        </div>
        <div>
          <select 
            name="sede"
            value={filters.sede}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="">Sede</option>
            <option value="Trujillo">Trujillo</option>
            <option value="Valle">Valle</option>
          </select>
        </div>
        <div>
          <select 
            name="estado"
            value={filters.estado}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="">Estado</option>
            <option value="Aprobado">Aprobado</option>
            <option value="En revisión">En revisión</option>
            <option value="Reprobado">Reprobado</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha inicio</label>
          <input 
            type="date" 
            name="fechaInicio"
            value={filters.fechaInicio}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md mt-1" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
          <input 
            type="date" 
            name="fechaFin"
            value={filters.fechaFin}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md mt-1" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha sustentación</label>
          <input 
            type="date" 
            name="fechaSustentacion"
            value={filters.fechaSustentacion}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md mt-1" 
          />
        </div>
      </div>
    </div>
      
    <div className="w-full max-w-full rounded-lg shadow-lg bg-white p-6 dark:bg-boxdark">
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Resultados</h3>
          <button 
            onClick={exportToCSV}
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <Download size={18} className="mr-2" />
            Exportar a CSV
          </button>
        </div>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr className="bg-primary text-left text-white">
              {['nombre', 'autor', 'fechaInicio', 'fechaFin', 'estado', 'firma', 'sede', 'tipoTesis'].map((key) => (
                <th 
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => sortData(key)}
                >
                  <div className="flex items-center">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {getSortIcon(key)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody >
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="border-b border-gray-200 py-4 px-6">{item.nombre}</td>
                <td className="border-b border-gray-200 py-4 px-6">{item.autor}</td>
                <td className="border-b border-gray-200 py-4 px-6">{item.fechaInicio}</td>
                <td className="border-b border-gray-200 py-4 px-6">{item.fechaFin}</td>
                <td className="border-b border-gray-200 py-4 px-6">
                  {/* <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                    item.estado === 'En revisión' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.estado}
                  </span> */}
                  <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        item.estado === 'Aprobado'
                          ? 'bg-success text-success'
                          : item.estado === 'En revisión'
                          ? 'bg-warning text-warning'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {item.estado}
                    </p>
                </td>
                <td className="border-b border-gray-200 py-4 px-6">{item.firma}</td>
                <td className="border-b border-gray-200 py-4 px-6">{item.sede}</td>
                <td className="border-b border-gray-200 py-4 px-6">{item.tipoTesis}</td>
                <td className="border-b border-gray-200 py-4 px-6">
                  <div className="flex items-center space-x-4">
                  <Eye
                    className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer"
                    onClick={() => handleNavigate('/thesisDetails')}
                  />
                  <Edit
                    className="w-5 h-5 text-gray-600 hover:text-yellow-600 cursor-pointer"
                    onClick={() => handleNavigate('/thesisEvaluation')}
                  />
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilteredThesis;

