const apiUrl = "http://127.0.0.1:8000/api"; // Ajusta según tu configuración

export const getSilabo = async (idCargaDocente: number): Promise<any> => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Usuario no autenticado");

    const response = await fetch(`${apiUrl}/silabo/${idCargaDocente}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error("Error al obtener el sílabo");

    return await response.json();
};
