// src/pages/Blog.jsx
import React from 'react';

export const Blog = () => {
  const articulos = [
    {
      id: 1,
      titulo: '¿Cómo identificar si un cilindro de gas cumple con las normas SEC?',
      resumen: 'Aprende a verificar los sellos de seguridad, el estado de la válvula y las fechas de prueba hidráulica antes de la instalación.',
      fecha: '05 de Octubre, 2026',
      categoria: 'Seguridad'
    },
    {
      id: 2,
      titulo: 'Consejos para reducir el consumo de gas en invierno',
      resumen: 'Estrategias eficientes para optimizar el uso de calefactores y calefones sin perder la calidez en tu hogar.',
      fecha: '28 de Septiembre, 2026',
      categoria: 'Ahorro'
    },
    {
      id: 3,
      titulo: 'Cilindro vs. Carga: ¿Cuándo conviene comprar el envase completo?',
      resumen: 'Te explicamos la diferencia comercial y legal entre adquirir un envase por primera vez o solicitar solo la recarga.',
      fecha: '15 de Septiembre, 2026',
      categoria: 'Guía de Compra'
    }
  ];

  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '80vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#F5F5F8' }}>
            Blog <span style={{ color: '#FF3B00' }}>Volcánico</span>
          </h1>
          <p style={{ color: '#A0A0AB', fontSize: '1rem', marginTop: '0.5rem' }}>
            Consejos de seguridad, guías prácticas y novedades sobre el gas licuado en Chile.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {articulos.map((art) => (
            <article
              key={art.id}
              style={{
                backgroundColor: '#18181E',
                border: '1px solid #2A2A35',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255, 59, 0, 0.15)', color: '#FF3B00', border: '1px solid #FF3B00', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>
                    {art.categoria}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#A0A0AB' }}>{art.fecha}</span>
                </div>
                <h3 style={{ color: '#F5F5F8', fontSize: '1.2rem', marginBottom: '0.8rem', lineHeight: '1.4' }}>
                  {art.titulo}
                </h3>
                <p style={{ color: '#A0A0AB', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {art.resumen}
                </p>
              </div>

              <button
                style={{
                  marginTop: '1.2rem',
                  backgroundColor: 'transparent',
                  color: '#FF8800',
                  border: '1px solid #FF8800',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: 'fit-content'
                }}
              >
                Leer artículo →
              </button>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Blog;