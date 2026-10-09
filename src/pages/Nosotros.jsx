// src/pages/Nosotros.jsx
import React from 'react';

export const Nosotros = () => {
  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '80vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: '#FF8800', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            Nuestra Historia
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#F5F5F8', marginTop: '0.3rem' }}>
            Sobre <span style={{ color: '#FF3B00' }}>Vulkania Gas</span>
          </h1>
          <p style={{ color: '#A0A0AB', fontSize: '1.1rem', maxWidth: '700px', margin: '1rem auto 0 auto', lineHeight: '1.6' }}>
            Nacidos al pie de los Andes, llevamos la calidez y fuerza del fuego volcánico a miles de hogares y comercios chilenos con la mayor velocidad del mercado.
          </p>
        </div>

        {/* Tarjetas Misión / Visión */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '1.8rem', borderRadius: '12px' }}>
            <h3 style={{ color: '#FF3B00', fontSize: '1.3rem', marginBottom: '0.8rem' }}>🔥 Nuestra Misión</h3>
            <p style={{ color: '#A0A0AB', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Garantizar el abastecimiento continuo de gas licuado en cilindros y formatos comerciales, asegurando el peso exacto, precios justos y una entrega en tiempo récord.
            </p>
          </div>

          <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '1.8rem', borderRadius: '12px' }}>
            <h3 style={{ color: '#FF8800', fontSize: '1.3rem', marginBottom: '0.8rem' }}>🌋 Nuestra Visión</h3>
            <p style={{ color: '#A0A0AB', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Consolidarnos como la distribuidora digital multicanal líder en Chile, reconocida por la innovación en su plataforma SPA y la excelencia en el servicio al cliente.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '2rem', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#F5F5F8', marginBottom: '1.5rem', textAlign: 'center' }}>
            Pilares de Confianza
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <h4 style={{ color: '#F5F5F8', marginBottom: '0.3rem' }}>Rapidez</h4>
              <p style={{ color: '#A0A0AB', fontSize: '0.85rem' }}>Despachos priorizados en menos de 45 minutos.</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
              <h4 style={{ color: '#F5F5F8', marginBottom: '0.3rem' }}>Seguridad SEC</h4>
              <p style={{ color: '#A0A0AB', fontSize: '0.85rem' }}>Válvulas y envases bajo normativa oficial.</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚖️</div>
              <h4 style={{ color: '#F5F5F8', marginBottom: '0.3rem' }}>Peso Justo</h4>
              <p style={{ color: '#A0A0AB', fontSize: '0.85rem' }}>Sellos de garantía inviolables en cada carga.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Nosotros;