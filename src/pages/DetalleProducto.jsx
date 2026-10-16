import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gasProducts } from '../data/gasData';
import { useCart } from '../context/CartContext';

export const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, formatCLP } = useCart();
  const [cantidad, setCantidad] = useState(1);

  // Buscar el producto por ID
  const producto = gasProducts.find((item) => item.id === id);

  if (!producto) {
    return (
      <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', maxWidth: '480px' }}>
          <span style={{ fontSize: '3.5rem' }}>⚠️</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '1rem', color: '#F5F5F8' }}>Producto No Encontrado</h2>
          <p style={{ color: '#A0A0AB', fontSize: '0.95rem', marginTop: '0.5rem', marginBottom: '1.8rem' }}>
            El cilindro o accesorio que buscas no existe o ha sido descontinuado de nuestro catálogo.
          </p>
          <Link
            to="/productos"
            style={{
              backgroundColor: '#FF3B00',
              color: '#FFF',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.9rem'
            }}
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const incrementarCantidad = () => {
    if (cantidad < producto.stock) {
      setCantidad((prev) => prev + 1);
    }
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad((prev) => prev - 1);
    }
  };

  const handleAgregarAlCarrito = () => {
    addToCart(producto, cantidad);
  };

  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Navegación Miga de Pan (Breadcrumb) */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.875rem', color: '#A0A0AB' }}>
          <Link to="/" style={{ color: '#A0A0AB', textDecoration: 'none' }}>Inicio</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <Link to="/productos" style={{ color: '#A0A0AB', textDecoration: 'none' }}>Productos</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span style={{ color: '#FF8800', fontWeight: '600' }}>{producto.nombre}</span>
        </nav>

        {/* Contenedor Principal del Producto */}
        <div style={{
          backgroundColor: '#18181E',
          border: '1px solid #2A2A35',
          borderRadius: '16px',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}>
          
          {/* Columna Izquierda: Imagen y Badges */}
          <div>
            <div style={{
              position: 'relative',
              backgroundColor: '#0D0D11',
              border: '1px solid #2A2A35',
              borderRadius: '12px',
              overflow: 'hidden',
              height: '360px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                backgroundColor: 'rgba(13, 13, 17, 0.9)',
                color: '#FF8800',
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #2A2A35',
                textTransform: 'uppercase'
              }}>
                {producto.categoria}
              </span>
            </div>

            {/* Garantías del Producto */}
            <div style={{
              marginTop: '1.5rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div style={{ backgroundColor: '#0D0D11', border: '1px solid #2A2A35', padding: '0.8rem 1rem', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#A0A0AB', fontWeight: '600' }}>Certificado SEC</p>
              </div>
              <div style={{ backgroundColor: '#0D0D11', border: '1px solid #2A2A35', padding: '0.8rem 1rem', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>⚖️</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#A0A0AB', fontWeight: '600' }}>Garantía Peso Exacto</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información y Compra */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ color: '#FF8800', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Disponible para entrega inmediata
              </span>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#F5F5F8', margin: '0.4rem 0 1rem 0', lineHeight: '1.2' }}>
                {producto.nombre}
              </h1>

              {/* Precio */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #2A2A35' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: '900', color: '#F5F5F8' }}>
                  {formatCLP(producto.precio * cantidad)}
                </span>
                {cantidad > 1 && (
                  <span style={{ fontSize: '0.9rem', color: '#A0A0AB' }}>
                    ({formatCLP(producto.precio)} c/u)
                  </span>
                )}
              </div>

              {/* Descripción */}
              <p style={{ color: '#A0A0AB', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.8rem' }}>
                {producto.descripcion}
              </p>

              {/* Indicador de Stock */}
              <div style={{ marginBottom: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: producto.stock > 0 ? '#00E676' : '#FF3B00', display: 'inline-block' }}></span>
                <span style={{ fontSize: '0.875rem', color: '#F5F5F8', fontWeight: '600' }}>
                  Stock disponible: <strong style={{ color: '#FF8800' }}>{producto.stock} unidades</strong>
                </span>
              </div>

              {/* Control de Cantidad */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', color: '#A0A0AB', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Cantidad a pedir:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={decrementarCantidad}
                    disabled={cantidad <= 1}
                    style={{
                      backgroundColor: '#0D0D11',
                      color: '#F5F5F8',
                      border: '1px solid #2A2A35',
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      cursor: cantidad <= 1 ? 'not-allowed' : 'pointer',
                      opacity: cantidad <= 1 ? 0.4 : 1
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    backgroundColor: '#0D0D11',
                    border: '1px solid #2A2A35',
                    width: '60px',
                    height: '42px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    color: '#F5F5F8'
                  }}>
                    {cantidad}
                  </span>
                  <button
                    onClick={incrementarCantidad}
                    disabled={cantidad >= producto.stock}
                    style={{
                      backgroundColor: '#0D0D11',
                      color: '#F5F5F8',
                      border: '1px solid #2A2A35',
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      cursor: cantidad >= producto.stock ? 'not-allowed' : 'pointer',
                      opacity: cantidad >= producto.stock ? 0.4 : 1
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Acciones de Compra */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
              <button
                onClick={handleAgregarAlCarrito}
                style={{
                  backgroundColor: '#FF3B00',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(255, 59, 0, 0.3)'
                }}
              >
                🛒 Añadir al Carrito ({cantidad})
              </button>
              <button
                onClick={() => navigate('/productos')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#A0A0AB',
                  border: '1px solid #2A2A35',
                  padding: '0.8rem',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                ← Seguir Explorando Productos
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;