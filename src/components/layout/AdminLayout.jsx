// src/components/layout/AdminLayout.jsx
import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import '../../pages/admin/Admin.css';

const enlaces = [
  { to: '/admin', etiqueta: 'Resumen', end: true },
  { to: '/admin/productos', etiqueta: 'Productos' },
  { to: '/admin/usuarios', etiqueta: 'Usuarios' }
];

export const AdminLayout = () => (
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
    </aside>

    <main className="admin-content">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;