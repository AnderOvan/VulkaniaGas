// src/pages/Productos.jsx
import React, { useState, useEffect } from 'react';

export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    fetch(`${apiUrl}/productos`)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al cargar productos:', err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p style={{ color: '#F5F5F8', textAlign: 'center', padding: '2rem' }}>Cargando catálogo...</p>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ color: '#F5F5F8', marginBottom: '1.5rem' }}>
        Catálogo <span style={{ color: '#FF3B00' }}>Vulkania Gas</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {productos.map((prod) => (
          <div key={prod.id} style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '10px', padding: '1.2rem', color: '#F5F5F8' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{prod.nombre}</h3>
            <p style={{ color: '#A0A0AB', fontSize: '0.9rem' }}>{prod.descripcion}</p>
            <p style={{ color: '#FF8800', fontWeight: 'bold', fontSize: '1.2rem' }}>
              ${Number(prod.precio).toLocaleString('es-CL')}
            </p>
            <span style={{ fontSize: '0.85rem', color: prod.stock > 0 ? '#4ADE80' : '#FF3B00' }}>
              {prod.stock > 0 ? `Stock disponible: ${prod.stock}` : 'Agotado'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;