import React, { useState } from 'react';

interface ModalCrearUsuarioProps {
  isModalOpen: boolean;
  closeModal: () => void;
  guardarusuario: (usuarioData: UsuarioData) => Promise<{ [key: string]: string } | undefined>;
}

interface UsuarioData {
  name: string;
  lastname: string;
  dni: string;
  email: string;
  password: string;
}

const ModalCrearUsuario: React.FC<ModalCrearUsuarioProps> = ({
  isModalOpen,
  closeModal,
  guardarusuario,
}) => {
  const initialUsuarioData = {
    name: '',
    lastname: '',
    dni: '',
    email: '',
    password: '',
  };

  const [usuarioData, setUsuarioData] = useState<UsuarioData>(initialUsuarioData);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuarioData((prevData) => ({ ...prevData, [name]: value }));
    setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: '' })); // Limpiar el mensaje de error al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await guardarusuario(usuarioData);
    if (errors) {
      console.log("Errores de validación recibidos:", errors); // Verifica si los errores están llegando
      setErrorMessages(errors);
    } else {
      setUsuarioData(initialUsuarioData);
      closeModal();
    }
  };
  

  React.useEffect(() => {
    if (isModalOpen) {
      setUsuarioData(initialUsuarioData);
      setErrorMessages({}); // Limpia los errores al abrir el modal
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={usuarioData.name}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
            {errorMessages.name && <p className="text-red-600 text-sm">{errorMessages.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              name="lastname"
              value={usuarioData.lastname}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
            {errorMessages.lastname && <p className="text-red-600 text-sm">{errorMessages.lastname}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">DNI</label>
            <input
              type="text"
              name="dni"
              value={usuarioData.dni}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
            {errorMessages.dni && <p className="text-red-600 text-sm">{errorMessages.dni}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              name="email"
              value={usuarioData.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
            {errorMessages.email && <p className="text-red-600 text-sm">{errorMessages.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={usuarioData.password}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
            {errorMessages.password && <p className="text-red-600 text-sm">{errorMessages.password}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearUsuario;
