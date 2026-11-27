// src/components/RutaAdmin.jsx
// Protege las vistas del panel: sin sesión -> login; con sesión pero sin rol ADMIN -> acceso denegado.
// Es solo una barrera de interfaz: la seguridad real la aplica el backend (401/403) en cada petición.
import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RutaAdmin = ({ children }) => {
  const { usuario, esAdmin } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  if (!esAdmin) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#F5F5F8' }}>
        <h2>Acceso denegado</h2>
        <p style={{ color: '#A0A0AB' }}>Tu cuenta no tiene permisos de administrador.</p>
        <Link to="/" style={{ color: '#FF3B00' }}>Volver al sitio</Link>
      </div>
    );
  }

  return children;
};

export default RutaAdmin;
