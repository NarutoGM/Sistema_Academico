import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth'; // Importa la función de autenticación
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Arreglo de roles permitidos para esta ruta (opcional)
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const auth = isAuthenticated(); // Aquí obtienes los datos de autenticación, como el rol del usuario

  if (!auth) {
    return <Navigate to="/login" />; // Redirigir a login si no está autenticado
  }

  // Validar si allowedRoles existe y si el rol del usuario está incluido
  if (allowedRoles.length > 0 && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/forbidden" />; // Redirigir a una página de acceso denegado si no tiene el rol adecuado
  }

  return <>{children}</>; // Si el rol está permitido, renderizar el contenido
};

export default ProtectedRoute;
