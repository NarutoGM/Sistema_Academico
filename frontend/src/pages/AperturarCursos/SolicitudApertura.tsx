import { AlignCenter } from 'lucide-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

const SolicitudApertura = () => {
    const location = useLocation();
    const { curso } = location.state || {};

    if (!curso) {
        return <div className="p-4">No se proporcionaron datos del curso.</div>;
    }

    return (
        <div className="p-8 bg-gray-100 text-center">
            <div className="max-w-3xl mx-auto bg-white p-8 border shadow-lg">
                <p className="text-sm font-semibold uppercase mb-4">
                    "Año del Bicentenario, de la consolidación de nuestra Independencia, y de la conmemoración de las Heroicas Batallas de Junín y Ayacucho"
                </p>
                <h1 className="text-lg font-bold mb-6 uppercase">
                    Solicita: Apertura del curso de {curso.curso.name}
                </h1>
                <div className='text-center'><img src="https://www.unitru.edu.pe/Recursos/img-unt/logo-unt1.png" alt="" width="200" style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }} /></div><br />
                <p className="text-left mb-4">
                    Señor:
                    Decano de la Facultad de Ingenieria
                </p>

                <p className="text-left mb-6">
                    Los alumnos de la Facultad de Ingenieria, Escuela Profesional de Ingeniería de Sistemas, ante usted con el debido respeto nos presentamos para expresar lo siguiente:
                </p>

                <p className="text-left mb-6">
                    Que, por motivos del ciclo académico {curso.semestre_academico.nomSemestre}, los alumnos interesados solicitamos ante su despacho la apertura del curso de {curso.curso.name}, siendo este curso requisito para nuestra carrera en el sentido de poder abrir los cursos necesarios el siguiente ciclo y llevarlo con normalidad. Este curso resulta vital para la formación profesional y académica.
                </p>

                <p className="text-left mb-6">
                    Por ello, acudimos a su despacho solicitando la aprobación del curso en el semestre correspondiente.
                </p>

                <p className="text-left mb-6">
                    Esperamos una respuesta positiva en el menor tiempo posible.
                </p>

                <p className="text-left">
                    Atentamente,
                    <br />Los Alumnos de la Escuela Profesional de Ingeniería de Sistemas
                </p>

                <p className="text-left mt-8">
                    Trujillo, {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="mt-4">
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Imprimir o Guardar como PDF
                </button>
            </div>
        </div>
    );
};

export default SolicitudApertura;
