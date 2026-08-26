import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/base.css';
import Ingreso from './pages/Ingreso.jsx';
import Staff from './pages/Staff.jsx';
import RestablecerContrasena from './pages/RestablecerContrasena.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Ingreso />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
