import { useState } from 'react';
import { Link } from 'react-router-dom';
import { gasProducts, CATEGORIAS } from '../data/gasData';
import { useCart } from '../context/CartContext';

export const Productos = () => {
  const { addToCart, formatCLP } = useCart();
  const [categoriaSel, setCategoriaSel] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');

  // Filtrado dinámico
  const productosFiltrados = gasProducts.filter((prod) => {
    const coincideCategoria = categoriaSel === 'TODAS' || prod.categoria === categoriaSel;
    const coincideBusqueda =
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Encabezado Principal */}
        <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid #2A2A35', paddingBottom: '1.5rem' }}>
          <span style={{ color: '#FF8800', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Catálogo Oficial • Vulkania Gas
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '0.4rem', color: '#F5F5F8' }}>
            Nuestros <span style={{ color: '#FF3B00' }}>Productos & Cargas</span>
          </h1>
          <p style={{ color: '#A0A0AB', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '600px' }}>
            Selecciona tus cilindros o accesorios con garantía de peso exacto y despacho prioritario a tu domicilio.
          </p>
        </header>

        {/* Panel de Filtros y Buscador */}
        <div style={{
          backgroundColor: '#18181E',
          border: '1px solid #2A2A35',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Botones de Categorías */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSel(cat)}
                style={{
                  backgroundColor: categoriaSel === cat ? '#FF3B00' : '#0D0D11',
                  color: categoriaSel === cat ? '#FFFFFF' : '#A0A0AB',
                  border: categoriaSel === cat ? '1px solid #FF3B00' : '1px solid #2A2A35',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Campo de Búsqueda */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar cilindro, carga..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0D0D11',
                border: '1px solid #2A2A35',
                color: '#F5F5F8',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Banner Informativo */}
        <div style={{
          backgroundColor: 'rgba(255, 59, 0, 0.08)',
          border: '1px dashed #FF3B00',
          borderRadius: '10px',
          padding: '1rem 1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '1.8rem' }}>🚚</span>
          <div>
            <h4 style={{ margin: 0, color: '#FF8800', fontSize: '0.95rem', fontWeight: '800' }}>
              Despacho Exprés Garantizado
            </h4>
            <p style={{ margin: 0, color: '#A0A0AB', fontSize: '0.85rem' }}>
              Entregas en menos de 45 minutos en toda la zona de cobertura. Tu pedido se procesa al instante.
            </p>
          </div>
        </div>

        {/* Grilla de Tarjetas de Productos */}
        {productosFiltrados.length === 0 ? (
          <div style={{
            backgroundColor: '#18181E',
            border: '1px solid #2A2A35',
            borderRadius: '12px',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h3 style={{ marginTop: '1rem', color: '#F5F5F8' }}>No encontramos coincidencias</h3>
            <p style={{ color: '#A0A0AB', fontSize: '0.9rem' }}>
              Intenta buscando con otro nombre o selecciona la categoría "TODAS".
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '1.5rem'
          }}>
            {productosFiltrados.map((prod) => (
              <div
                key={prod.id}
                style={{
                  backgroundColor: '#18181E',
                  border: '1px solid #2A2A35',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div>
                  {/* Imagen y Badge de Categoría */}
                  <div style={{ position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', backgroundColor: '#0D0D11' }}>
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(13, 13, 17, 0.85)',
                      color: '#FF8800',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #2A2A35',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {prod.categoria}
                    </span>
                  </div>

                  {/* Nombre y Descripción */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#F5F5F8', margin: '0 0 0.5rem 0' }}>
                    {prod.nombre}
                  </h3>
                  <p style={{ color: '#A0A0AB', fontSize: '0.85rem', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                    {prod.descripcion}
                  </p>
                </div>

                {/* Precio y Botones */}
                <div style={{ borderTop: '1px solid #2A2A35', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                    <span style={{ color: '#A0A0AB', fontSize: '0.8rem' }}>Precio unitario:</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#F5F5F8' }}>
                      {formatCLP(prod.precio)}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.5rem' }}>
                    <Link
                      to={`/productos/${prod.id}`}
                      style={{
                        backgroundColor: '#0D0D11',
                        color: '#F5F5F8',
                        border: '1px solid #2A2A35',
                        borderRadius: '6px',
                        padding: '0.6rem 0',
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}
                    >
                      Ver Detalle
                    </Link>
                    <button
                      onClick={() => addToCart(prod)}
                      style={{
                        backgroundColor: '#FF3B00',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.6rem 0',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      🛒 Añadir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;