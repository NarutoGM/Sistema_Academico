import React, { useState, useEffect } from 'react';
import { X } from 'react-feather';
import { getUnidades, Unidad } from '../services/unidad.service';
import { getRoles, Rol } from '../services/rol.service';

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  responsableToEdit: any; // Datos del responsable a editar
}

const ResponsableEditModal: React.FC<ModalEditProps> = ({ isOpen, onClose, onSave, responsableToEdit }) => {
  const [apellidos, setApellidos] = useState<string>('');
  const [nombres, setNombres] = useState<string>('');
  const [idRol, setIdRol] = useState<number>(0);
  const [idUnidad, setIdUnidad] = useState<number>(0);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
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
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error al cargar los roles:', error);
      }
    };

    if (isOpen) {
      fetchUnidades();
      fetchRoles();
    }
  }, [isOpen]);

  // Actualizar los campos cuando se pasa el responsable a editar
  useEffect(() => {
    if (responsableToEdit) {
      setApellidos(responsableToEdit.apellidos || '');
      setNombres(responsableToEdit.nombres || '');
      setIdRol(responsableToEdit.idRol || 0);
      setIdUnidad(responsableToEdit.idUnidad || 0);
      setClavedigital(responsableToEdit.clavedigital || '');
      setImagePreview(responsableToEdit.firmaDigitalURL || null); // Mostrar imagen previa si existe
    }
  }, [responsableToEdit]);

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
    if (firmadigital) {
      formData.append('firmadigital', firmadigital as Blob);
    }
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

        <h2 className="text-2xl font-semibold mb-4 text-center">Editar Responsable</h2>

        {/* Resto del contenido similar al modal de registro */}
        {/* Apellidos */}
        <div className="mb-4">
          <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">
            Apellidos
          </label>
          <input
            type="text"
            id="apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.apellidos && <p className="text-red-500 text-xs">{errors.apellidos}</p>}
        </div>

        {/* Nombres */}
        <div className="mb-4">
          <label htmlFor="nombres" className="block text-sm font-medium text-gray-700">
            Nombres
          </label>
          <input
            type="text"
            id="nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.nombres && <p className="text-red-500 text-xs">{errors.nombres}</p>}
        </div>

        {/* Resto del código... */}

        <button onClick={handleSubmit} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default ResponsableEditModal;
