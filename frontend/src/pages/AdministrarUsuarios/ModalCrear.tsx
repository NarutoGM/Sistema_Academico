import React, { useState } from 'react';
import { X } from 'react-feather';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData2: FormData) => void;
}

const PersonaModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [nombres, setNombres] = useState<string>('');
  const [apellidos, setApellidos] = useState<string>('');
  const [docIdentidad, setDocIdentidad] = useState<string>('');
  const [tipoDocIdentidad, setTipoDocIdentidad] = useState<string>('DNI');
  const [fechaNacim, setFechaNacim] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [celular, setCelular] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null); // Estado para la vista previa de la imagen
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<any>({}); // Manejo de errores

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFoto(selectedFile);
      
      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        setFotoPreview(reader.result as string); // Guardar la vista previa
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFoto = () => {
    setFoto(null);
    setFotoPreview(null); // Limpiar la vista previa
  };

  const formatDateToISO = (date: string): string => {
    const [day, month, year] = date.split('-');
    return `${month}-${year}-${day}`; // Cambiar a formato YYYY-MM-DD
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el formato del correo
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!nombres) newErrors.nombres = "Los nombres son requeridos.";
    if (!apellidos) newErrors.apellidos = "Los apellidos son requeridos.";
    if (!docIdentidad) newErrors.docIdentidad = "El documento de identidad es requerido.";
    if (!fechaNacim) newErrors.fechaNacim = "La fecha de nacimiento es requerida.";
    if (!email) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (!validateEmail(email)) {
      newErrors.email = "El formato del correo electrónico es incorrecto.";
    }
    if (!celular) newErrors.celular = "El celular es requerido.";
    if (!direccion) newErrors.direccion = "La dirección es requerida.";
    if (!password) newErrors.password = "La contraseña es requerida.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Verificar si no hay errores
  };

  const handleSubmit = () => {
    if (!validateForm()) return; // Validar antes de enviar

    const formData2 = new FormData();
    formData2.append('Nombres', nombres);
    formData2.append('Apellidos', apellidos);
    formData2.append('DocIdentidad', docIdentidad);
    formData2.append('TipoDocIdentidad', tipoDocIdentidad);
    formData2.append('FechaNacim', formatDateToISO(fechaNacim)); // Usar formato ISO
    formData2.append('Email', email);
    formData2.append('Celular', celular);
    formData2.append('Direccion', direccion);

    if (foto) {
      formData2.append('Foto', foto);
    }

    formData2.append('Password', password);
    formData2.append('idEspecialidad', '1');

    onSave(formData2);

    // Limpiar inputs
    setNombres('');
    setApellidos('');
    setDocIdentidad('');
    setFechaNacim('');
    setEmail('');
    setCelular('');
    setDireccion('');
    setFoto(null);
    setFotoPreview(null); // Limpiar la vista previa
    setPassword('');
    setErrors({}); // Limpiar errores
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>

      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Registrar Persona</h2>

        {/* Muestra la imagen cargada */}
        {fotoPreview ? (
          <div className="mb-4 relative">
            <img src={fotoPreview} alt="Vista previa" className="w-24 h-auto rounded-md" /> {/* Tamaño reducido */}
            <button
              onClick={removeFoto}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              title="Eliminar imagen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cargar Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Fila 1: Nombres y Apellidos */}
        <div className="flex space-x-2 mb-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Nombres</label>
            <input
              type="text"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
            {errors.nombres && <p className="text-red-500 text-sm">{errors.nombres}</p>}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Apellidos</label>
            <input
              type="text"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
            {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos}</p>}
          </div>
        </div>

        {/* Fila 2: Documento de Identidad y Tipo */}
        <div className="flex space-x-2 mb-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Documento de Identidad</label>
            <input
              type="text"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={docIdentidad}
              onChange={(e) => setDocIdentidad(e.target.value)}
            />
            {errors.docIdentidad && <p className="text-red-500 text-sm">{errors.docIdentidad}</p>}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
            <input
              type="text"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={tipoDocIdentidad}
              onChange={(e) => setTipoDocIdentidad(e.target.value)}
            />
          </div>
        </div>

        {/* Fila 3: Fecha de Nacimiento, Email, Celular y Dirección */}
        <div className="flex space-x-2 mb-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <input
              type="date"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={fechaNacim}
              onChange={(e) => setFechaNacim(e.target.value)}
            />
            {errors.fechaNacim && <p className="text-red-500 text-sm">{errors.fechaNacim}</p>}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Celular</label>
            <input
              type="text"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
            {errors.celular && <p className="text-red-500 text-sm">{errors.celular}</p>}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
            {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
          </div>
        </div>

        {/* Fila 4: Contraseña */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonaModal;