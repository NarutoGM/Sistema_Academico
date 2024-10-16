import { backendConfig } from "@/config/backend";
import Cookies from "js-cookie";

export default async function fetcher(ruta: string = "", init?: RequestInit) {
    const token = Cookies.get('token');
    return fetch(`${backendConfig.url}${ruta}`, {
        ...init,
        credentials: 'include', // Asegúrate de incluir las credenciales si es necesario
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            ...init?.headers,
        },
    });
}

