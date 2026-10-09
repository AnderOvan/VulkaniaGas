// src/components/layout/Header.jsx
import React from 'react';

export const Header = () => {
  return (
    <div
      style={{
        backgroundColor: '#0D0D11',
        borderBottom: '1px solid #2A2A35',
        color: '#A0A0AB',
        fontSize: '0.8rem',
        padding: '0.4rem 1.5rem'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div>
          <span style={{ color: '#FF8800', fontWeight: 'bold' }}>🔥 Despacho Exprés 24/7:</span> Santiago y Regiones
        </div>
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          <span>📞 Urgencias: <strong style={{ color: '#F5F5F8' }}>800 600 VULKANIA</strong></span>
          <span>✉️ <span style={{ color: '#F5F5F8' }}>contacto@vulkaniagas.cl</span></span>
        </div>
      </div>
    </div>
  );
};

export default Header;