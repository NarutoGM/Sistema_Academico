import React, { useState, useEffect } from 'react'; 
import { X } from 'react-feather';
import { getUnidades, Unidad } from '../services/unidad.service';
import { getRoles, Rol } from '../services/rol.service'; // Importa el servicio para roles

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
}

const ResponsableModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apellidos, setApellidos] = useState<string>('');
  const [nombres, setNombres] = useState<string>('');
  const [idRol, setIdRol] = useState<number>(0);
  const [idUnidad, setIdUnidad] = useState<number>(0);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]); // Estado para los roles
  const [firmadigital, setFirmadigital] = useState<File | null>(null);
  const [clavedigital, setClavedigital] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const unidadesData = await getUnidades();
        setUnidades(unidadesData);
      } catch (error) {
        console.error('Error al cargar las unidades:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles(); // Obtener roles
        setRoles(rolesData);
      } catch (error) {
        console.error('Error al cargar los roles:', error);
      }
    };

    if (isOpen) {
      fetchUnidades();
      fetchRoles(); // Llama a la función para obtener roles
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFirmadigital(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFirmadigital(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: Record<string, string> = {};

    if (!apellidos) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
      valid = false;
    }

    if (!nombres) {
      newErrors.nombres = 'Los nombres son obligatorios';
      valid = false;
    }

    if (!idRol) {
      newErrors.idRol = 'El rol es obligatorio';
      valid = false;
    }

    if (!idUnidad) {
      newErrors.idUnidad = 'La unidad es obligatoria';
      valid = false;
    }

    if (!firmadigital) {
      newErrors.firmadigital = 'La firma digital es obligatoria';
      valid = false;
    }

    if (!clavedigital) {
      newErrors.clavedigital = 'La clave digital es obligatoria';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('apellidos', apellidos);
    formData.append('nombres', nombres);
    formData.append('idRol', idRol.toString());
    formData.append('idUnidad', idUnidad.toString());
    formData.append('firmadigital', firmadigital as Blob);
    formData.append('clavedigital', clavedigital);

    onSave(formData);

    // Limpiar inputs después de guardar
    setApellidos('');
    setNombres('');
    setIdRol(0);
    setIdUnidad(0);
    setFirmadigital(null);
    setClavedigital('');
    setImagePreview(null);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>

      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Registrar Responsable</h2>

        {/* Fila 1: Apellidos y Nombres */}
        <div className="flex space-x-2 mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
            {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos}</p>}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Nombres</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
            {errors.nombres && <p className="text-red-500 text-sm">{errors.nombres}</p>}
          </div>
        </div>

        {/* Fila 2: Unidad, Rol y Clave Digital */}
        <div className="flex space-x-2 mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Unidad</label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={idUnidad}
              onChange={(e) => setIdUnidad(Number(e.target.value))}
            >
              <option value={0}>Selecciona una unidad</option>
              {unidades.map((unidad) => (
                <option key={unidad.id} value={unidad.id}>
                  {unidad.unidad}
                </option>
              ))}
            </select>
            {errors.idUnidad && <p className="text-red-500 text-sm">{errors.idUnidad}</p>}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={idRol}
              onChange={(e) => setIdRol(Number(e.target.value))}
            >
              <option value={0}>Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.name}
                </option>
              ))}
            </select>
            {errors.idRol && <p className="text-red-500 text-sm">{errors.idRol}</p>}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Clave Digital</label>
            <input
              type="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={clavedigital}
              onChange={(e) => setClavedigital(e.target.value)}
            />
            {errors.clavedigital && <p className="text-red-500 text-sm">{errors.clavedigital}</p>}
          </div>
        </div>

          {/* Fila 3: Firma Digital */}
          <div className="mb-6 text-center">
          <label className="block text-sm font-medium text-gray-700">Firma Digital</label>
          {!imagePreview ? (
            <div className="mt-1 flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500">
              <input
                type="file"
                className="hidden"
                id="firmadigital"
                onChange={handleFileChange}
              />
              <label htmlFor="firmadigital" className="text-blue-600 cursor-pointer">
                Subir Firma Digital
              </label>
            </div>
          ) : (
            <div className="relative mt-2">
              <button
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 text-red-600 hover:text-red-800"
              >
                X
              </button>
              <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover mx-auto" />
            </div>
          )}
          {errors.firmadigital && <p className="text-red-500 text-sm">{errors.firmadigital}</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ResponsableModal;
