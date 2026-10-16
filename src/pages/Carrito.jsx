import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Carrito = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, formatCLP } = useCart();
  const navigate = useNavigate();

  // Recálculo local por seguridad si cartTotal viene inconsistente
  const subtotalCalculado = cart.reduce((acc, item) => {
    const p = Number(item.precio) || 0;
    const q = Number(item.cantidad) || 0;
    return acc + p * q;
  }, 0);

  const subtotal = subtotalCalculado > 0 ? subtotalCalculado : (Number(cartTotal) || 0);
  const costoEnvio = subtotal > 50000 || cart.length === 0 ? 0 : 2990;
  const totalFinal = subtotal + costoEnvio;

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '16px', padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '500px' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🛒</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#F5F5F8', margin: '0 0 0.5rem 0' }}>Tu carrito está vacío</h2>
          <p style={{ color: '#A0A0AB', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
            Aún no has agregado cilindros o cargas de gas. Revisa nuestro catálogo para realizar tu pedido con despacho expreso.
          </p>
          <Link
            to="/productos"
            style={{
              backgroundColor: '#FF3B00',
              color: '#FFFFFF',
              padding: '0.9rem 1.8rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '800',
              fontSize: '0.95rem',
              display: 'inline-block'
            }}
          >
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Encabezado */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', borderBottom: '1px solid #2A2A35', paddingBottom: '1.2rem' }}>
          <div>
            <span style={{ color: '#FF8800', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Módulo E-Commerce
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#F5F5F8', margin: '0.2rem 0 0 0' }}>
              Carrito de <span style={{ color: '#FF3B00' }}>Compras</span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            style={{
              backgroundColor: 'transparent',
              color: '#FF3B00',
              border: '1px solid rgba(255, 59, 0, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🗑️ Vaciar Carrito
          </button>
        </header>

        {/* Layout en 2 columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Lista de Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.map((item) => {
              const precioUnitario = Number(item.precio) || 0;
              const cantidad = Number(item.cantidad) || 1;

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#18181E',
                    border: '1px solid #2A2A35',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem'
                  }}
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2A2A35', backgroundColor: '#0D0D11' }}
                  />

                  <div style={{ flex: '1' }}>
                    <span style={{ fontSize: '0.7rem', color: '#FF8800', fontWeight: '800', textTransform: 'uppercase' }}>
                      {item.categoria}
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#F5F5F8', margin: '0.2rem 0 0.5rem 0' }}>
                      {item.nombre}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', borderRadius: '6px' }}>
                        <button
                          onClick={() => updateQuantity(item.id, cantidad - 1)}
                          style={{ backgroundColor: 'transparent', color: '#F5F5F8', border: 'none', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: '800', color: '#F5F5F8' }}>
                          {cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, cantidad + 1)}
                          disabled={cantidad >= (item.stock || 99)}
                          style={{ backgroundColor: 'transparent', color: '#F5F5F8', border: 'none', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold', opacity: cantidad >= (item.stock || 99) ? 0.3 : 1 }}
                        >
                          +
                        </button>
                      </div>

                      <span style={{ fontSize: '0.8rem', color: '#A0A0AB' }}>
                        x {formatCLP(precioUnitario)}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#F5F5F8' }}>
                      {formatCLP(precioUnitario * cantidad)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#A0A0AB', cursor: 'pointer', fontSize: '0.9rem' }}
                      title="Eliminar producto"
                    >
                      ✖
                    </button>
                  </div>
                </div>
              );
            })}

            <Link
              to="/productos"
              style={{ color: '#FF8800', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '700', marginTop: '0.5rem', display: 'inline-block' }}
            >
              ← Añadir más productos al pedido
            </Link>
          </div>

          {/* Resumen de Compra */}
          <div style={{
            backgroundColor: '#18181E',
            border: '1px solid #2A2A35',
            borderRadius: '16px',
            padding: '1.8rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#F5F5F8', marginBottom: '1.2rem', borderBottom: '1px solid #2A2A35', paddingBottom: '0.8rem' }}>
              Resumen de Compra
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A0A0AB' }}>
                <span>Subtotal productos:</span>
                <span style={{ color: '#F5F5F8', fontWeight: '700' }}>{formatCLP(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A0A0AB' }}>
                <span>Despacho expreso:</span>
                <span style={{ color: costoEnvio === 0 ? '#00E676' : '#F5F5F8', fontWeight: '700' }}>
                  {costoEnvio === 0 ? '¡GRATIS!' : formatCLP(costoEnvio)}
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #2A2A35', paddingTop: '1rem', marginBottom: '1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F5F5F8' }}>Total a pagar:</span>
              <span style={{ fontSize: '2rem', fontWeight: '900', color: '#FF3B00' }}>
                {formatCLP(totalFinal)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              style={{
                width: '100%',
                backgroundColor: '#FF3B00',
                color: '#FFFFFF',
                border: 'none',
                padding: '1rem',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Ir a Pagar →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Carrito;