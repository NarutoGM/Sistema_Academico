import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import fetcher from '@/utils/fetcher';
import { handleLogin } from '@/utils/auth';

// Formulario de inicio de sesión (LoginForm)
const LoginForm = () => {
    const LoginSchema = z.object({
        email: z.string().trim().email({ message: "Formato de correo no válido" }),
        password: z.string().trim(),
    })

    type FormData = z.infer<typeof LoginSchema>;

    const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm<FormData>({ resolver: zodResolver(LoginSchema) });

    type LoginResponse = {
        token: string,
        role: string
        name: string
    }

    const navigate = useNavigate();

    async function onSubmit(data: FormData) {
        try {
            console.log(data);
            // Enviar los datos a la API
            const response = await fetcher(`/api/login`, {
                method: 'POST',
                body: JSON.stringify(data),
            });
            
            const responseJ = await response.json() as LoginResponse;
            handleLogin(responseJ.token, responseJ.role, responseJ.name);
            navigate('/dashboard');
            clearErrors();
            reset();
        } catch {
        }
    }

    

    

    return (

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Dirección de Email */}
                <div>
                    <label htmlFor="email" className='block font-medium text-sm text-gray-700 dark:text-gray-300'>Email</label>
                    <input
                        {...register('email')}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        autoComplete="username"
                    />
                </div>

                {/* Contraseña */}
                <div className="mt-4">
                    <label htmlFor="password" className='block font-medium text-sm text-gray-700 dark:text-gray-300' >Contraseña</label>
                    <input
                        {...register('password')}
                        type='password'
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        autoComplete="current-password"
                    />
                </div>

                {/* Botón de Ingresar */}
                <div className="flex items-center justify-center mt-4">
                    <button className='inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-sm text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150'>Ingresar</button>
                </div>

                {/* Links de registro */}
                <div className="flex justify-between mt-10 text-sm text-center gap-5">
                    <Link
                        to="/registerMedico"
                        className="flex-1 p-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Registrarse como médico
                    </Link>
                    <Link
                        to="/registerPaciente"
                        className="flex-1 p-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Registrarse como paciente
                    </Link>
                </div>
            </form>
    );
};

export default LoginForm;
