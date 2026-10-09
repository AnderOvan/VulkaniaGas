// src/pages/Productos.jsx
import React from 'react';

export const Productos = () => {
  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '70vh', padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '2.5rem', borderRadius: '12px' }}>
        <span style={{ fontSize: '3rem' }}>🌋</span>
        <h2 style={{ fontSize: '2rem', color: '#FF3B00', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Catálogo de Productos
        </h2>
        <p style={{ color: '#A0A0AB', fontSize: '1rem', lineHeight: '1.5' }}>
          Esta sección corresponde al módulo del <strong>Alumno 2</strong> (Cilindros, recargas, carrito de compras y persistencia con LocalStorage).
        </p>
      </div>
    </div>
  );
};

export default Productos;