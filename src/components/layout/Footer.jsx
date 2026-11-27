// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#18181E', borderTop: '1px solid #2A2A35', color: '#A0A0AB', padding: '2.5rem 1rem 1.5rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
        
        <div>
          <h3 style={{ color: '#F5F5F8', fontSize: '1.2rem', marginBottom: '0.8rem' }}>🌋 Vulkania Gas Online</h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            Distribución rápida, segura y confiable de cilindros de gas licuado a domicilio las 24 horas.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#F5F5F8', fontSize: '1rem', marginBottom: '0.8rem' }}>Enlaces Rápidos</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <li><Link to="/productos" style={{ color: '#A0A0AB', textDecoration: 'none' }}>Catálogo de Cargas</Link></li>
            <li><Link to="/nosotros" style={{ color: '#A0A0AB', textDecoration: 'none' }}>Sobre Nosotros</Link></li>
            <li><Link to="/contacto" style={{ color: '#A0A0AB', textDecoration: 'none' }}>Atención al Cliente</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#F5F5F8', fontSize: '1rem', marginBottom: '0.8rem' }}>Atención Telefónica</h4>
          <p style={{ fontSize: '0.875rem', color: '#FF8800', fontWeight: 'bold' }}>📞 800 600 VULKANIA</p>
          <p style={{ fontSize: '0.85rem' }}>Santiago & Regiones, Chile</p>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #2A2A35', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} Vulkania Gas Online. DSY1104 - Evaluación Parcial 2.
      </div>
    </footer>
  );
};

export default Footer;