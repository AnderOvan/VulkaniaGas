import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';
import { gasProducts } from '../data/gasData';
import { useCart } from '../context/CartContext';

export const Home = () => {
  const { addToCart, formatCLP } = useCart();
  const productosDestacados = gasProducts.filter((p) => p.destacado);

  return (
    <div style={{ backgroundColor: '#0D0D11', minHeight: '100vh', paddingBottom: '4rem' }}>
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

      {/* Sección Productos Destacados */}
      <section style={{ maxWidth: '1200px', margin: '3rem auto 0', padding: '0 2rem' }}>
        <div style={{ borderTop: '1px solid #2A2A35', paddingTop: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#F5F5F8', marginBottom: '1.5rem' }}>
            Cilindros y Recargas <span style={{ color: '#FF8800' }}>Destacadas</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {productosDestacados.map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: '#18181E',
                  border: '1px solid #2A2A35',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#FF8800', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {prod.categoria}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', color: '#F5F5F8', margin: '0.3rem 0', fontWeight: '700' }}>
                    {prod.nombre}
                  </h3>
                  <p style={{ color: '#A0A0AB', fontSize: '0.875rem', lineHeight: '1.4' }}>
                    {prod.descripcion}
                  </p>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.8rem', borderTop: '1px solid #2A2A35', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F5F5F8' }}>
                    {formatCLP(prod.precio)}
                  </span>
                  <button
                    onClick={() => addToCart(prod)}
                    style={{
                      backgroundColor: '#FF3B00',
                      color: '#FFF',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;