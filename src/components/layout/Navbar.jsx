import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const { totalItems } = useCart();

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#FF3B00' : '#F5F5F8',
    fontWeight: isActive ? '700' : '500',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease'
  });

  return (
    <nav style={{ backgroundColor: '#18181E', borderBottom: '1px solid #2A2A35', padding: '1rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>🌋</span>
          <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#F5F5F8', letterSpacing: '0.5px' }}>
            VULKANIA <span style={{ color: '#FF3B00' }}>GAS</span>
          </span>
        </Link>

        {/* Links de Navegación */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <NavLink to="/" style={linkStyle}>Inicio</NavLink>
          <NavLink to="/productos" style={linkStyle}>Productos</NavLink>
          <NavLink to="/nosotros" style={linkStyle}>Nosotros</NavLink>
          <NavLink to="/blog" style={linkStyle}>Blog</NavLink>
          <NavLink to="/contacto" style={linkStyle}>Contacto</NavLink>
        </div>

        {/* Carrito y Botones de Autenticación */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Botón de Carrito con Contador */}
          <Link
            to="/carrito"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0D0D11',
              color: '#F5F5F8',
              border: '1px solid #2A2A35',
              padding: '0.5rem 0.8rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            🛒
            {totalItems > 0 && (
              <span style={{
                backgroundColor: '#FF3B00',
                color: '#FFFFFF',
                borderRadius: '50%',
                padding: '2px 7px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          <Link
            to="/login"
            style={{
              color: '#F5F5F8',
              border: '1px solid #2A2A35',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '600'
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
              fontWeight: '700'
            }}
          >
            Registrarse
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;