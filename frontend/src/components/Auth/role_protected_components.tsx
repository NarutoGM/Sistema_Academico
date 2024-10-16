import { isAuthenticated } from '@/utils/auth';
import { ReactNode } from 'react';

interface ProtectedElementProps {
    allowedRoles?: string[];
    children: ReactNode;
}

const ProtectedElement = ({ allowedRoles = [], children }: ProtectedElementProps) => {
    const auth = isAuthenticated();

    if (!auth || !allowedRoles.includes(auth.role)) {
        return null; // No muestra nada si el rol no está permitido
    }

    return <>{children}</>; // Muestra el contenido si el rol está permitido
};

export default ProtectedElement;


