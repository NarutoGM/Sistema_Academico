import Cookies from 'js-cookie';
import { NavigateFunction } from 'react-router-dom';

interface AuthData {
    token: string;
    role: string;
    name: string;
    email: string;
    id: string;
}

export const isAuthenticated = (): AuthData | null => {
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  const name = Cookies.get('name');
  const email = Cookies.get('email');
  const id = Cookies.get('id');

  if (token && role && name && email && id) {
    return { token, role, name, email, id};
  }

  return null;
};

export const handleLogin = (token: string, role: string, name: string, email: string,id :string) => {
    // Guardar el token y el rol en las cookies
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('role', role, { expires: 7 });
    Cookies.set('name', name, { expires: 7 });
    Cookies.set('email', email, { expires: 7 });
    Cookies.set('id', id, { expires: 7 });

};
