import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth'; // Importa la función de autenticación

const HomeRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = isAuthenticated();

        if (auth) {
            navigate('/dashboard');
        } else {
            // Si no está autenticado, redirigir al login
            navigate('/login');
        }
    }, [navigate]);

    return null; // No renderiza nada, solo se encarga de redirigir
};

export default HomeRedirect;
