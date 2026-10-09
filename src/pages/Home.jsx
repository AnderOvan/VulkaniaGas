// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';

export const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '4rem 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', gap: '2rem' }}>
        <div style={{ flex: '1 1 450px' }}>
          <span style={{ color: '#FF8800', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            Energía Pura a tu Puerta
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#F5F5F8', marginTop: '0.5rem', lineHeight: '1.1' }}>
            Distribución de Gas con <span style={{ color: '#FF3B00' }}>Potencia Volcánica</span>
          </h1>
          <p style={{ color: '#A0A0AB', fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.5' }}>
            Pide tus cilindros de 5kg, 11kg, 15kg o 45kg con despacho expreso. Garantía de peso exacto y máxima seguridad certificada SEC.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <Link to="/productos" style={{ backgroundColor: '#FF3B00', color: '#FFFFFF', padding: '0.9rem 1.8rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              Pedir Gas Ahora
            </Link>
            <Link to="/nosotros" style={{ border: '1px solid #2A2A35', color: '#F5F5F8', padding: '0.9rem 1.8rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
              Ver Cobertura
            </Link>
          </div>
        </div>

        <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
          <img src={heroImg} alt="Vulkania Gas Hero" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', border: '1px solid #2A2A35' }} />
        </div>
      </section>
    </div>
  );
};

export default Home;