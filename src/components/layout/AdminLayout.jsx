// src/components/layout/AdminLayout.jsx
import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../pages/admin/Admin.css';

const enlaces = [
  { to: '/admin', etiqueta: 'Resumen', end: true },
  { to: '/admin/productos', etiqueta: 'Productos' },
  { to: '/admin/usuarios', etiqueta: 'Usuarios' }
];

export const AdminLayout = () => {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
  <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-brand">🌋 Vulkania <span>Admin</span></div>

      <nav aria-label="Panel administrativo" className="admin-menu">
        {enlaces.map(({ to, etiqueta, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}
          >
            {etiqueta}
          </NavLink>
        ))}
      </nav>

      <Link to="/" className="admin-link">← Volver al sitio</Link>

      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        {usuario && <div className="admin-link" style={{ cursor: 'default' }}>{usuario.nombre}</div>}
        <button
          type="button"
          className="admin-link"
          onClick={salir}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>

    <main className="admin-content">
      <Outlet />
    </main>
  </div>
  );
};

export default AdminLayout;