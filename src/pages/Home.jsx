// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';

export const Home = () => {
  const [destacados, setDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Leer sesión persistida desde localStorage
  const sesion = JSON.parse(localStorage.getItem('usuarioVulkania') || 'null');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    fetch(`${apiUrl}/productos`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const filtrados = data.filter((p) => p.destacado);
        setDestacados((filtrados.length > 0 ? filtrados : data).slice(0, 3));
        setCargando(false);
      })
      .catch(() => {
        setCargando(false);
      });
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8' }}>
      {/* Hero Section con imagen de fondo a pantalla completa */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '82vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `linear-gradient(90deg, rgba(13, 13, 17, 0.94) 0%, rgba(13, 13, 17, 0.72) 55%, rgba(13, 13, 17, 0.35) 100%), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderBottom: '1px solid #2A2A35',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '4rem 2rem',
          }}
        >
          <div style={{ maxWidth: '620px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255, 59, 0, 0.15)',
                border: '1px solid rgba(255, 59, 0, 0.4)',
                color: '#FF8800',
                padding: '0.35rem 0.9rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                letterSpacing: '1.2px',
              }}
            >
              {sesion
                ? `👋 Bienvenido, ${sesion.nombre} (${sesion.rol})`
                : '🔥 Energía Pura a tu Puerta · 24/7'}
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: '900',
                color: '#F5F5F8',
                marginTop: '1rem',
                marginBottom: '1rem',
                lineHeight: '1.08',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
              }}
            >
              Distribución de Gas con{' '}
              <span style={{ color: '#FF3B00' }}>Potencia Volcánica</span>
            </h1>

            <p
              style={{
                color: '#D4D4DC',
                fontSize: '1.15rem',
                lineHeight: '1.6',
                marginBottom: '2.2rem',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
              }}
            >
              Pide tus cilindros de 5kg, 11kg, 15kg o 45kg con despacho expreso
              a domicilio. Garantía de peso exacto y máxima seguridad
              certificada SEC.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <Link
                to="/productos"
                style={{
                  backgroundColor: '#FF3B00',
                  color: '#FFFFFF',
                  padding: '0.95rem 2rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 8px 24px rgba(255, 59, 0, 0.35)',
                }}
              >
                Pedir Gas Ahora
              </Link>

              {sesion?.rol === 'ADMIN' ? (
                <Link
                  to="/admin"
                  style={{
                    backgroundColor: 'rgba(24, 24, 30, 0.9)',
                    border: '1px solid #FF8800',
                    color: '#FF8800',
                    padding: '0.95rem 2rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }}
                >
                  ⚙️ Panel Administrador
                </Link>
              ) : (
                <Link
                  to={sesion ? '/nosotros' : '/login'}
                  style={{
                    backgroundColor: 'rgba(24, 24, 30, 0.85)',
                    border: '1px solid #3A3A48',
                    color: '#F5F5F8',
                    padding: '0.95rem 2rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                  }}
                >
                  {sesion ? 'Ver Cobertura' : 'Iniciar Sesión'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Franja rápida de ventajas */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2.5rem 2rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>⚡</div>
          <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem' }}>Despacho Expreso</h3>
          <p style={{ margin: 0, color: '#A0A0AB', fontSize: '0.9rem' }}>
            Entrega rápida en menos de 45 minutos en Santiago y alrededores.
          </p>
        </div>

        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🛡️</div>
          <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem' }}>Certificación SEC</h3>
          <p style={{ margin: 0, color: '#A0A0AB', fontSize: '0.9rem' }}>
            Cilindros inspeccionados, sellados y con válvula de seguridad garantizada.
          </p>
        </div>

        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>📦</div>
          <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem' }}>Stock en Tiempo Real</h3>
          <p style={{ margin: 0, color: '#A0A0AB', fontSize: '0.9rem' }}>
            Consulta disponibilidad inmediata conectada directamente a nuestra base de datos.
          </p>
        </div>
      </section>

      {/* Productos destacados desde MySQL (Spring Boot) */}
      {!cargando && destacados.length > 0 && (
        <section
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1.5rem 2rem 3.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.6rem' }}>
              Cargas <span style={{ color: '#FF3B00' }}>Destacadas</span>
            </h2>
            <Link to="/productos" style={{ color: '#FF8800', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem' }}>
              Ver catálogo completo →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {destacados.map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: '#18181E',
                  border: '1px solid #2A2A35',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#FF8800', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {prod.categoria || 'Gas Licuado'} {prod.peso ? `· ${prod.peso}` : ''}
                  </span>
                  <h3 style={{ margin: '0.4rem 0 0.6rem', fontSize: '1.15rem' }}>{prod.nombre}</h3>
                  <p style={{ color: '#A0A0AB', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {prod.descripcion}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: '#FF8800', fontWeight: 'bold', fontSize: '1.25rem' }}>
                      ${Number(prod.precio).toLocaleString('es-CL')}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: prod.stock > 0 ? '#4ADE80' : '#FF3B00' }}>
                      {prod.stock > 0 ? `Stock: ${prod.stock}` : 'Agotado'}
                    </span>
                  </div>

                  <Link
                    to="/productos"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: '#FF3B00',
                      color: '#FFFFFF',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    Ir a Pedir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;