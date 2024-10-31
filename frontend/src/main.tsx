import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, RouterProvider } from 'react-router-dom';
import './css/style.css';
import './css/satoshi.css';
import 'flatpickr/dist/flatpickr.min.css';
import router from './routes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <RouterProvider router={router}/>
  // </React.StrictMode>,
);