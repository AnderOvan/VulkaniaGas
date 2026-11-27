// src/pages/Productos.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IMAGEN_LOCAL_RESPALDO = '/images/gas-15kg.png';

const obtenerImagenProducto = (prod) => {
  if (prod.imagen && prod.imagen.startsWith('/images/')) return prod.imagen;
  if (prod.imagenUrl && prod.imagenUrl.startsWith('/images/')) return prod.imagenUrl;

  const nombre = (prod.nombre || '').toLowerCase();
  if (nombre.includes('5kg') || nombre.includes('5 kg')) return '/images/gas-5kg.png';
  if (nombre.includes('11kg') || nombre.includes('11 kg')) return '/images/gas-11kg.png';
  if (nombre.includes('15kg') || nombre.includes('15 kg')) return '/images/gas-15kg.png';
  if (nombre.includes('45kg') || nombre.includes('45 kg')) return '/images/gas-45kg.png';

  return IMAGEN_LOCAL_RESPALDO;
};

const CATEGORIAS_FILTRO = [
  'Todos',
  'Cilindros Completos',
  'Cargas / Recargas',
  'Válvulas y Accesorios',
  'Calefacción',
];

export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  const navigate = useNavigate();
  const sesion = JSON.parse(localStorage.getItem('usuarioVulkania') || 'null');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${apiUrl}/productos`);
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setMensaje('⚠️ No se pudo conectar con el servidor de productos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) return;

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        if (existe.cantidad >= producto.stock) {
          setMensaje(`⚠️ No hay más stock disponible para ${producto.nombre}.`);
          return prev;
        }
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setMensaje('');
  };

  const quitarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleConfirmarPedido = async () => {
    if (carrito.length === 0) return;

    if (!sesion?.token) {
      setMensaje('⚠️ Debes iniciar sesión para realizar un pedido.');
      setTimeout(() => navigate('/login'), 1200);
      return;
    }

    try {
      for (const item of carrito) {
        const payload = {
          productoId: item.id,
          cantidad: item.cantidad,
          clienteEmail: sesion.email || 'cliente@vulkania.cl',
          direccionEntrega: direccionEntrega.trim() || 'Despacho a domicilio',
        };

        const res = await fetch(`${apiUrl}/pedidos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sesion.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('usuarioVulkania');
          setMensaje('⚠️ Sesión expirada. Vuelve a iniciar sesión.');
          navigate('/login');
          return;
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setMensaje(`❌ Error en ${item.nombre}: ${errData.mensaje || 'Stock insuficiente'}`);
          cargarProductos();
          return;
        }
      }

      setMensaje('🔥 ¡Pedido realizado con éxito! Stock descontado en la base de datos.');
      setCarrito([]);
      setDireccionEntrega('');
      cargarProductos();
    } catch (error) {
      setMensaje('⚠️ Error de conexión al enviar el pedido.');
    }
  };

  const productosFiltrados =
    categoriaActiva === 'Todos'
      ? productos
      : productos.filter((p) => p.categoria === categoriaActiva);

  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '75vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Catálogo <span style={{ color: '#FF3B00' }}>Vulkania Gas</span>
        </h2>
        <p style={{ color: '#A0A0AB', marginBottom: '1.5rem' }}>
          Selecciona tus cilindros, recargas o accesorios disponibles en stock.
        </p>

        {/* Filtro de 4 categorías */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
          {CATEGORIAS_FILTRO.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                border: categoriaActiva === cat ? '1px solid #FF3B00' : '1px solid #2A2A35',
                backgroundColor: categoriaActiva === cat ? '#FF3B00' : '#18181E',
                color: '#F5F5F8',
                fontWeight: categoriaActiva === cat ? 'bold' : 'normal',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {mensaje && (
          <div
            style={{
              backgroundColor: '#18181E',
              border: '1px solid #FF8800',
              color: '#FF8800',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
            }}
          >
            {mensaje}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Grilla de Productos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.2rem' }}>
            {cargando ? (
              <p style={{ color: '#A0A0AB' }}>Cargando catálogo desde el servidor...</p>
            ) : productosFiltrados.length === 0 ? (
              <p style={{ color: '#A0A0AB' }}>No hay productos disponibles en esta categoría.</p>
            ) : (
              productosFiltrados.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    backgroundColor: '#18181E',
                    border: '1px solid #2A2A35',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ width: '100%', height: '165px', backgroundColor: '#121217', overflow: 'hidden' }}>
                      <img
                        src={obtenerImagenProducto(prod)}
                        alt={prod.nombre}
                        onError={(e) => {
                          e.currentTarget.src = IMAGEN_LOCAL_RESPALDO;
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>

                    <div style={{ padding: '1.2rem 1.4rem 0.5rem' }}>
                      {prod.categoria && (
                        <span style={{ fontSize: '0.72rem', color: '#FF8800', textTransform: 'uppercase', fontWeight: 'bold' }}>
                          {prod.categoria}
                        </span>
                      )}
                      <h3 style={{ margin: '0.3rem 0 0.4rem', fontSize: '1.1rem' }}>{prod.nombre}</h3>
                      {prod.descripcion && (
                        <p style={{ color: '#A0A0AB', fontSize: '0.85rem', margin: '0 0 0.6rem', lineHeight: '1.4' }}>
                          {prod.descripcion}
                        </p>
                      )}
                      <p style={{ color: '#FF3B00', fontSize: '1.3rem', fontWeight: 'bold', margin: '0.4rem 0' }}>
                        ${Number(prod.precio).toLocaleString('es-CL')}
                      </p>
                      <p style={{ color: prod.stock > 0 ? '#4ADE80' : '#FF4D4D', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        {prod.stock > 0 ? `Stock disponible: ${prod.stock}` : 'Agotado'}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '0 1.4rem 1.4rem' }}>
                    <button
                      onClick={() => agregarAlCarrito(prod)}
                      disabled={prod.stock <= 0}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        backgroundColor: prod.stock > 0 ? '#FF3B00' : '#2A2A35',
                        color: prod.stock > 0 ? '#FFFFFF' : '#777',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: prod.stock > 0 ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {prod.stock > 0 ? 'Agregar al pedido' : 'Sin stock'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resumen del Pedido (Carrito) */}
          <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #2A2A35', paddingBottom: '0.8rem' }}>
              Tu Pedido ({carrito.reduce((acc, i) => acc + i.cantidad, 0)})
            </h3>

            {carrito.length === 0 ? (
              <p style={{ color: '#A0A0AB', fontSize: '0.9rem' }}>Aún no has agregado productos.</p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  {carrito.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                      <div>
                        <strong>{item.nombre}</strong>
                        <div style={{ color: '#A0A0AB' }}>
                          {item.cantidad} x ${Number(item.precio).toLocaleString('es-CL')}
                        </div>
                      </div>
                      <button
                        onClick={() => quitarDelCarrito(item.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #2A2A35',
                          color: '#FF4D4D',
                          borderRadius: '4px',
                          padding: '0.2rem 0.5rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#A0A0AB', marginBottom: '0.35rem' }}>
                    Dirección de entrega (opcional)
                  </label>
                  <input
                    type="text"
                    value={direccionEntrega}
                    onChange={(e) => setDireccionEntrega(e.target.value)}
                    placeholder="Ej: Av. Pajaritos 1234, Maipú"
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      backgroundColor: '#0D0D11',
                      border: '1px solid #2A2A35',
                      color: '#F5F5F8',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div
                  style={{
                    borderTop: '1px solid #2A2A35',
                    paddingTop: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    marginBottom: '1.2rem',
                  }}
                >
                  <span>Total:</span>
                  <span style={{ color: '#FF3B00' }}>${total.toLocaleString('es-CL')}</span>
                </div>

                <button
                  onClick={handleConfirmarPedido}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    backgroundColor: '#FF3B00',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Confirmar Compra
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productos;