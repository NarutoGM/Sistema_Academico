import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Cambia esta URL por tu endpoint real

// Función para obtener las peticiones desde el backend
export const getPeticiones = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Se asume que la respuesta es un arreglo de peticiones
    } catch (error) {
        console.error("Error al obtener las peticiones", error);
        throw error; // Lanza el error para que lo manejes más adelante si es necesario
    }
};
