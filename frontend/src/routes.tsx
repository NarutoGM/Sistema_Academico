import { useEffect, useState } from 'react';
import { createBrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { BrowserRouter as Router} from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';

import Permisos from './pages/Permisos/index';
import Roles from './pages/Roles/index';

import AdministrarUsuarios from './pages/AdministrarUsuarios/index';
import Horarios from './pages/Horarios/index';
import GenerarHorario from './pages/GenerarHorario/index';
import CargaDocente from './pages/CargaDocente/index';


import SubirArchivo from './pages/SubirArchivo/index';
import Silabo from './pages/Silabo/index';
import MisCursos from './pages/MisCursos/index';
import Versilabos from './pages/VerSilabos/index';
import Reporte1 from './pages/Reportes/index';
import Reporte2 from './pages/ReporteG/index';

import AperturarCursos from './pages/AperturarCursos/index';
import Reportedash from './pages/Reportedash/index';
import SolicitudApertura from './pages/AperturarCursos/SolicitudApertura';
import ReportesPeticiones from './pages/AperturarCursos/ReportesPeticiones'; 



import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import ProtectedRoute from './components/Auth/protected_route';

const router = createBrowserRouter([
    {
        path: "/login",
        element: <SignIn />,
        id: "login",
    },
    {
        path: '/',
        loader: async () => {
            console.log('loading...');
            return "hola";
        },
        element: <ProtectedRoute> <DefaultLayout/> </ProtectedRoute>,
        id: 'root',
        children: [
            // {
            //     index: true,
            //     element: <HomeRedirect/>,
            // },
            {
                path: '/dashboard',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <ECommerce />
                    </ProtectedRoute>
                ),
            },           {
                path: '/versilabos',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="versilabos | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Versilabos />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/calendar',
                element: (
                    <ProtectedRoute>
                        <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Calendar />
                        </ProtectedRoute>

                ),
            },
          
            
        
            {
                path: '/profile',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Profile />
                    </ProtectedRoute>
                ),
            },
   
            {
                path: '/forms/form-elements',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <FormElements />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/forms/form-layout',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <FormLayout />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/tables',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Tables />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/settings',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Settings />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/chart',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Chart />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/ui/alerts',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Alerts />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/ui/buttons',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Buttons />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/auth/signin',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <SignIn />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/auth/signup',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <SignUp />
                    </ProtectedRoute>
                ),
            },
      

         
            {
                path: '/permisos',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Permisos | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Permisos />
                        </ProtectedRoute>
                ),
            }, 
            {
                path: '/roles',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Roles | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Roles />
                        </ProtectedRoute>
                ),
            },
    
            {
                path: '/administrarusuario',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Administrar usuario | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <AdministrarUsuarios/>
                        </ProtectedRoute>
                ),
            },
            
            {
                path: '/horarios',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Administrar usuario | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Horarios/>
                        </ProtectedRoute>
                ),
            },
            {
                path: '/generar-horarios',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Generar horario | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <GenerarHorario/>
                        </ProtectedRoute>
                ),
            },
            {
                path: '/cargaDocente',
                element: (
                    <ProtectedRoute >
                        <PageTitle title="Administrar usuario | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <CargaDocente/>
                        </ProtectedRoute>
                ),
            },
            {
                path:'/subirarchivo',
                element: (
                    <ProtectedRoute>
                        <PageTitle title="General Alumno | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <SubirArchivo/>
                    </ProtectedRoute>
                ),
            },
            {
                path:'/silabos',
                element: (
                    <ProtectedRoute>
                        <PageTitle title="General Alumno | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Silabo/>
                    </ProtectedRoute>
                ),
            },
            {
                path:'/MisCursos',
                element: (
                    <ProtectedRoute>
                        <PageTitle title="MisCursos | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <MisCursos/>
                    </ProtectedRoute>
                ),
            },
           
            {
                path:'/reportes/1',
                element: (
                    <ProtectedRoute>
                        <PageTitle title="academicos | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Reporte1/>
                    </ProtectedRoute>
                ),
            },
            {
                path:'/reportes/2',
                element: (
                    <ProtectedRoute>
                        <PageTitle title="academicos | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Reporte2/>
                    </ProtectedRoute>
                ),
            },
            {
                path:'/aperturacursos',
                element: (
                    <ProtectedRoute>
                        <PageTitle title="Aperturar Cursos | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <AperturarCursos/>
                    </ProtectedRoute>
                ),
            },
            {
                path:'/reportedash',
                element: (
                    <ProtectedRoute>
                        <PageTitle title="Aperturar Cursos | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Reportedash/>
                    </ProtectedRoute>
                ),
            },
            {
            path:'/solicitud-apertura',
                element: (
                    <ProtectedRoute>
                        <PageTitle title="Aperturar Cursos | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <SolicitudApertura/>
                    </ProtectedRoute>
                ),
            },
            {
                path:'/reporte-apertura',
                element: (
                    <ProtectedRoute>
                        <PageTitle title="Aperturar Cursos | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <ReportesPeticiones/>
                    </ProtectedRoute>
                ),
            }

            
            
        ]
    },
]);

export default router;