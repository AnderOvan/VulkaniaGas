// src/pages/admin/AdminPedidos.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Estado para formulario de nuevo pedido manual
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoPedido, setNuevoPedido] = useState({
    productoId: '',
    cantidad: 1,
    clienteEmail: '',
    direccionEntrega: '',
  });

  const navigate = useNavigate();
  const sesion = JSON.parse(localStorage.getItem('usuarioVulkania') || 'null');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    ...(sesion?.token ? { Authorization: `Bearer ${sesion.token}` } : {}),
  });

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [resPedidos, resProductos] = await Promise.all([
        fetch(`${apiUrl}/pedidos`, { headers: getAuthHeaders() }),
        fetch(`${apiUrl}/productos`),
      ]);

      if (resPedidos.status === 401 || resPedidos.status === 403) {
        localStorage.removeItem('usuarioVulkania');
        navigate('/login');
        return;
      }

      if (resPedidos.ok) {
        const dataPedidos = await resPedidos.json();
        setPedidos(dataPedidos.sort((a, b) => b.id - a.id));
      } else {
        setError('No se pudieron cargar los pedidos.');
      }

      if (resProductos.ok) {
        const dataProductos = await resProductos.json();
        setProductos(dataProductos);
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearPedido = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (!nuevoPedido.productoId || Number(nuevoPedido.cantidad) <= 0) {
      setError('Selecciona un producto y una cantidad válida.');
      return;
    }

    try {
      const payload = {
        productoId: Number(nuevoPedido.productoId),
        cantidad: Number(nuevoPedido.cantidad),
        clienteEmail: nuevoPedido.clienteEmail.trim() || 'venta.telefonica@vulkania.cl',
        direccionEntrega: nuevoPedido.direccionEntrega.trim() || 'Retiro en local',
      };

      const res = await fetch(`${apiUrl}/pedidos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMensaje('🔥 Pedido creado y stock descontado correctamente.');
        setNuevoPedido({ productoId: '', cantidad: 1, clienteEmail: '', direccionEntrega: '' });
        setMostrarForm(false);
        cargarDatos();
      } else {
        setError(data.mensaje || 'Error al crear el pedido (verifica el stock).');
      }
    } catch (err) {
      setError('Error de conexión al registrar el pedido.');
    }
  };

  const handleEliminarPedido = async (pedido) => {
    if (!window.confirm(`¿Eliminar el pedido #${pedido.id} (${pedido.nombreProducto})? Se restaurará el stock.`)) {
      return;
    }
    setError('');
    setMensaje('');

    try {
      const res = await fetch(`${apiUrl}/pedidos/${pedido.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('usuarioVulkania');
        navigate('/login');
        return;
      }

      if (res.ok) {
        setMensaje(`Pedido #${pedido.id} eliminado y stock restaurado.`);
        cargarDatos();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.mensaje || 'No se pudo eliminar el pedido.');
      }
    } catch (err) {
      setError('Error de conexión al eliminar el pedido.');
    }
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const term = busqueda.toLowerCase();
    return (
      (p.clienteEmail || '').toLowerCase().includes(term) ||
      (p.nombreProducto || '').toLowerCase().includes(term) ||
      (p.direccionEntrega || '').toLowerCase().includes(term) ||
      String(p.id).includes(term)
    );
  });

  const ingresosTotales = pedidos.reduce((acc, p) => acc + (Number(p.total) || 0), 0);

  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '75vh', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        
        {/* Encabezado y resumen */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ margin: '0 0 0.3rem', fontSize: '2rem', fontWeight: '800' }}>Pedidos</h1>
            <p style={{ margin: 0, color: '#A0A0AB', fontSize: '0.95rem' }}>
              {pedidos.length} pedidos registrados en el sistema.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '0.65rem 1.1rem', borderRadius: '8px' }}>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#A0A0AB', textTransform: 'uppercase' }}>
                Ventas Totales
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4ADE80' }}>
                ${ingresosTotales.toLocaleString('es-CL')}
              </span>
            </div>

            <button
              onClick={() => {
                setMostrarForm(!mostrarForm);
                setError('');
                setMensaje('');
              }}
              style={{
                backgroundColor: '#FF3B00',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.85rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {mostrarForm ? '✕ Cancelar' : '+ Nuevo Pedido'}
            </button>
          </div>
        </div>

        {/* Formulario para Crear Pedido Manual */}
        {mostrarForm && (
          <form
            onSubmit={handleCrearPedido}
            style={{
              backgroundColor: '#18181E',
              border: '1px solid #2A2A35',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#FF8800' }}>Registrar Pedido Manual</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#A0A0AB', marginBottom: '0.35rem' }}>Producto</label>
                <select
                  value={nuevoPedido.productoId}
                  onChange={(e) => setNuevoPedido({ ...nuevoPedido, productoId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px' }}
                >
                  <option value="">Selecciona un cilindro...</option>
                  {productos.map((prod) => (
                    <option key={prod.id} value={prod.id} disabled={prod.stock <= 0}>
                      {prod.nombre} (${Number(prod.precio).toLocaleString('es-CL')} · Stock: {prod.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#A0A0AB', marginBottom: '0.35rem' }}>Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={nuevoPedido.cantidad}
                  onChange={(e) => setNuevoPedido({ ...nuevoPedido, cantidad: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#A0A0AB', marginBottom: '0.35rem' }}>Correo Cliente</label>
                <input
                  type="email"
                  placeholder="cliente@ejemplo.cl"
                  value={nuevoPedido.clienteEmail}
                  onChange={(e) => setNuevoPedido({ ...nuevoPedido, clienteEmail: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#A0A0AB', marginBottom: '0.35rem' }}>Dirección de Entrega</label>
                <input
                  type="text"
                  placeholder="Av. Pajaritos 1234, Maipú"
                  value={nuevoPedido.direccionEntrega}
                  onChange={(e) => setNuevoPedido({ ...nuevoPedido, direccionEntrega: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#FF3B00',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.7rem 1.4rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Guardar Pedido
            </button>
          </form>
        )}

        {/* Buscador */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por ID, correo del cliente, producto o dirección..."
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              backgroundColor: '#18181E',
              border: '1px solid #2A2A35',
              color: '#F5F5F8',
              borderRadius: '8px',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {mensaje && (
          <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.12)', border: '1px solid #4ADE80', color: '#4ADE80', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {mensaje}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: 'rgba(255, 59, 0, 0.15)', border: '1px solid #FF3B00', color: '#FF3B00', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Tabla de Pedidos */}
        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '12px', overflowX: 'auto' }}>
          {cargando ? (
            <p style={{ padding: '1.5rem', color: '#A0A0AB' }}>Cargando historial de pedidos...</p>
          ) : pedidosFiltrados.length === 0 ? (
            <p style={{ padding: '1.5rem', color: '#A0A0AB' }}>No se encontraron pedidos.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A35', color: '#A0A0AB', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem 1.2rem' }}>ID</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Cliente</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Producto</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Cant.</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Total</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Dirección de Entrega</th>
                  <th style={{ padding: '1rem 1.2rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} style={{ borderBottom: '1px solid #2A2A35', fontSize: '0.92rem' }}>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 'bold', color: '#FF8800' }}>
                      #{pedido.id}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      {pedido.clienteEmail}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>
                      {pedido.nombreProducto}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span style={{ backgroundColor: '#0D0D11', border: '1px solid #2A2A35', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.85rem' }}>
                        {pedido.cantidad} un.
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 'bold', color: '#4ADE80' }}>
                      ${Number(pedido.total).toLocaleString('es-CL')}
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#A0A0AB' }}>
                      {pedido.direccionEntrega || 'Retiro en tienda'}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <button
                        type="button"
                        onClick={() => handleEliminarPedido(pedido)}
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid rgba(255, 77, 77, 0.5)',
                          color: '#FF4D4D',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPedidos;