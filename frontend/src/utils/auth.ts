import Cookies from 'js-cookie';
import { NavigateFunction } from 'react-router-dom';

interface AuthData {
    token: string;
    role: string;
    name: string;
    email: string;
}

export const isAuthenticated = (): AuthData | null => {
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  const name = Cookies.get('name');
  const email = Cookies.get('email');

  if (token && role && name && email) {
    return { token, role, name, email  };
  }

  return null;
};

export const handleLogin = (token: string, role: string, name: string, email: string) => {
    // Guardar el token y el rol en las cookies
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('role', role, { expires: 7 });
    Cookies.set('name', name, { expires: 7 });
    Cookies.set('email', email, { expires: 7 });
};
