// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [sesion, setSesion] = useState(() =>
    JSON.parse(localStorage.getItem('usuarioVulkania') || 'null')
  );
  const navigate = useNavigate();
  const location = useLocation();

  // Sincroniza el Navbar cada vez que cambias de ruta o de sesión
  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuarioVulkania') || 'null');
    setSesion(usuarioGuardado);
  }, [location]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuarioVulkania');
    setSesion(null);
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#FF3B00' : '#F5F5F8',
    fontWeight: isActive ? '700' : '500',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease',
  });

  return (
    <nav style={{ backgroundColor: '#18181E', borderBottom: '1px solid #2A2A35', padding: '1rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>🌋</span>
          <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#F5F5F8', letterSpacing: '0.5px' }}>
            VULKANIA <span style={{ color: '#FF3B00' }}>GAS</span>
          </span>
        </Link>

        {/* Links de Navegación */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <NavLink to="/" style={linkStyle}>Inicio</NavLink>
          <NavLink to="/productos" style={linkStyle}>Productos</NavLink>
          <NavLink to="/nosotros" style={linkStyle}>Nosotros</NavLink>
          <NavLink to="/blog" style={linkStyle}>Blog</NavLink>
          <NavLink to="/contacto" style={linkStyle}>Contacto</NavLink>

          {/* Enlace exclusivo si el usuario es ADMIN */}
          {sesion?.rol === 'ADMIN' && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                color: isActive ? '#FFFFFF' : '#FF8800',
                backgroundColor: isActive ? '#FF3B00' : 'rgba(255, 136, 0, 0.12)',
                border: '1px solid #FF8800',
                padding: '0.35rem 0.85rem',
                borderRadius: '6px',
                fontWeight: '700',
                textDecoration: 'none',
                fontSize: '0.9rem',
              })}
            >
              ⚙️ Panel Admin
            </NavLink>
          )}
        </div>

        {/* Estado de Sesión / Botones de Autenticación */}
        {sesion ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', padding: '0.4rem 0.85rem', borderRadius: '999px' }}>
              <span style={{ fontSize: '0.88rem', color: '#F5F5F8', fontWeight: '600' }}>
                👤 {sesion.nombre || sesion.email}
              </span>
              {sesion.rol === 'ADMIN' && (
                <span
                  style={{
                    backgroundColor: '#FF3B00',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    letterSpacing: '0.5px',
                  }}
                >
                  ADMIN
                </span>
              )}
            </div>

            <button
              onClick={handleCerrarSesion}
              style={{
                backgroundColor: 'transparent',
                color: '#FF4D4D',
                border: '1px solid rgba(255, 77, 77, 0.4)',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <Link
              to="/login"
              style={{
                color: '#F5F5F8',
                border: '1px solid #2A2A35',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/registro"
              style={{
                backgroundColor: '#FF3B00',
                color: '#FFFFFF',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '700',
              }}
            >
              Registrarse
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;