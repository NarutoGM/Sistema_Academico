import { useEffect, useState } from 'react';
import { createBrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import CrearFlujoActividades from './pages/Activities/CrearFlujoActividades';
import ThesisEvaluation from './pages/Thesis evaluation/Calificación de Tesis Component';
import ThesisDetails from './pages/Thesis evaluation/Detalle de Tesis Component';
import Responsable from './pages/Responsable';
import CreateActivity from './pages/Activities/CreateActivity';
import FlujoActividades from './pages/Activities/FlujoActividades';
import Persona from './pages/Persona/index';

import Unidades from './pages/Unidades/Unidades';
import Permisos from './pages/Permisos/index';
import Roles from './pages/Roles/index';
import Tramite from './pages/Tramite';
import TramiteAsesor from './pages/TramiteAsesor';




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
import { FlujoIndex } from './pages/flujos';
import ProtectedRoute from './components/Auth/protected_route';
import FilteredUnidad from './pages/Unidades/Unidades';
import FilteredThesis from './pages/Thesis evaluation/Filtered Table Component';
import { User } from 'lucide-react';

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
                path: '/activity',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores','Estudiante']}>
                        <PageTitle title="CreateActivity | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <CreateActivity />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/flujoactividades',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="FlujoActividades | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <FlujoActividades />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/crearflujoactividades',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="CrearFlujoActividades | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <CrearFlujoActividades />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/thesis',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="Filtered Thesis | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <FilteredThesis />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/thesisEvaluation',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="Thesis Evaluation | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <ThesisEvaluation />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/thesisDetails',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="Thesis Details | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <ThesisDetails />
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
                path: '/responsable',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="Responsable | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Responsable />
                        </ProtectedRoute>
                ),
            },
            {
                path: '/responsable',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="Responsable | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Responsable />
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
                path: '/flujos',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="Flujos" />
                        <FlujoIndex />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/users',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="Flujos" />
                        <Persona />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/unidades',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores', 'Administrador']}>
                        <PageTitle title="Unidades | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Unidades />
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
                        <PageTitle title="Especialidad | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Roles />
                        </ProtectedRoute>
                ),
            },
            {
                path: '/tramite',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores','Estudiante','Asesor']}>
                        <PageTitle title="Tramites | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Tramite/>
                        </ProtectedRoute>
                ),
            },
            {
                path: '/tramiteasesor',
                element: (
                    <ProtectedRoute allowedRoles={['Profesores','Estudiante','Asesor']}>
                        <PageTitle title="Tramites | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <TramiteAsesor/>
                        </ProtectedRoute>
                ),
            },
        ]
    },
]);

export default router;