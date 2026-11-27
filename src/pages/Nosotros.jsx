// src/pages/Nosotros.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Nosotros = () => {
  const [stats, setStats] = useState({ totalProductos: 0, stockTotal: 0 });
  const sesion = JSON.parse(localStorage.getItem('usuarioVulkania') || 'null');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    fetch(`${apiUrl}/productos`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const stockTotal = data.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);
        setStats({
          totalProductos: data.length,
          stockTotal,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '80vh' }}>
      
      {/* Hero con imagen completa de fondo y degradado encima */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 'clamp(380px, 49vw, 680px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundImage: `linear-gradient(180deg, rgba(13, 13, 17, 0.55) 0%, rgba(13, 13, 17, 0.78) 65%, #0D0D11 100%), url('/images/pollo.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          padding: '4rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', zIndex: 1 }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255, 59, 0, 0.2)',
              border: '1px solid rgba(255, 59, 0, 0.5)',
              color: '#FF8800',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              letterSpacing: '1.2px',
            }}
          >
            Nuestra Historia
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: '900',
              color: '#F5F5F8',
              marginTop: '1rem',
              marginBottom: '1rem',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.85)',
            }}
          >
            Sobre <span style={{ color: '#FF3B00' }}>Vulkania Gas</span>
          </h1>
          <p
            style={{
              color: '#EAEAF0',
              fontSize: '1.15rem',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)',
            }}
          >
            Nacidos al pie de los Andes, llevamos la calidez y fuerza del fuego volcánico a miles de hogares y comercios chilenos con la mayor velocidad del mercado.
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem 3.5rem' }}>
        
        {/* Indicadores operativos conectados al backend */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FF3B00' }}>24/7</div>
            <div style={{ color: '#A0A0AB', fontSize: '0.85rem', marginTop: '0.25rem' }}>Despacho Continuo</div>
          </div>

          <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FF8800' }}>
              {stats.totalProductos > 0 ? stats.totalProductos : '8+'}
            </div>
            <div style={{ color: '#A0A0AB', fontSize: '0.85rem', marginTop: '0.25rem' }}>Formatos en Catálogo</div>
          </div>

          <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#4ADE80' }}>
              {stats.stockTotal > 0 ? `${stats.stockTotal} un.` : 'En línea'}
            </div>
            <div style={{ color: '#A0A0AB', fontSize: '0.85rem', marginTop: '0.25rem' }}>Stock Disponible Hoy</div>
          </div>
        </div>

        {/* Tarjetas Misión / Visión */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '1.8rem', borderRadius: '12px' }}>
            <h3 style={{ color: '#FF3B00', fontSize: '1.3rem', marginBottom: '0.8rem' }}>🔥 Nuestra Misión</h3>
            <p style={{ color: '#A0A0AB', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
              Garantizar el abastecimiento continuo de gas licuado en cilindros y formatos comerciales, asegurando el peso exacto, precios justos y una entrega en tiempo récord.
            </p>
          </div>

          <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '1.8rem', borderRadius: '12px' }}>
            <h3 style={{ color: '#FF8800', fontSize: '1.3rem', marginBottom: '0.8rem' }}>🌋 Nuestra Visión</h3>
            <p style={{ color: '#A0A0AB', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
              Consolidarnos como la distribuidora digital multicanal líder en Chile, reconocida por la innovación en su plataforma SPA y la excelencia en el servicio al cliente.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '2rem', borderRadius: '12px', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#F5F5F8', marginBottom: '1.5rem', textAlign: 'center' }}>
            Pilares de Confianza
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <h4 style={{ color: '#F5F5F8', marginBottom: '0.3rem' }}>Rapidez</h4>
              <p style={{ color: '#A0A0AB', fontSize: '0.85rem', margin: 0 }}>Despachos priorizados en menos de 45 minutos.</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
              <h4 style={{ color: '#F5F5F8', marginBottom: '0.3rem' }}>Seguridad SEC</h4>
              <p style={{ color: '#A0A0AB', fontSize: '0.85rem', margin: 0 }}>Válvulas y envases bajo normativa oficial.</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚖️</div>
              <h4 style={{ color: '#F5F5F8', marginBottom: '0.3rem' }}>Peso Justo</h4>
              <p style={{ color: '#A0A0AB', fontSize: '0.85rem', margin: 0 }}>Sellos de garantía inviolables en cada carga.</p>
            </div>
          </div>
        </div>

        {/* Llamado a la acción final */}
        <div
          style={{
            backgroundColor: '#18181E',
            border: '1px solid rgba(255, 59, 0, 0.4)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: '0 0 0.6rem', fontSize: '1.35rem' }}>
            ¿Listo para realizar tu pedido?
          </h3>
          <p style={{ color: '#A0A0AB', margin: '0 0 1.4rem', fontSize: '0.95rem' }}>
            Revisa nuestro stock en tiempo real y recibe tu cilindro directamente en tu domicilio.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/productos"
              style={{
                backgroundColor: '#FF3B00',
                color: '#FFFFFF',
                padding: '0.8rem 1.8rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Ver Catálogo
            </Link>
            {sesion?.rol === 'ADMIN' && (
              <Link
                to="/admin"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #FF8800',
                  color: '#FF8800',
                  padding: '0.8rem 1.8rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                Ir a Gestión Admin
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Nosotros;