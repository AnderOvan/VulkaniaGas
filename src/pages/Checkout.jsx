import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Checkout = () => {
  const { cart, cartTotal, clearCart, formatCLP } = useCart();
  const navigate = useNavigate();

  // Cálculo de subtotal y regla de despacho
  const subtotal = Number(cartTotal) || cart.reduce((acc, item) => acc + (Number(item.precio) || 0) * (Number(item.cantidad) || 0), 0);
  const costoEnvio = subtotal > 50000 || cart.length === 0 ? 0 : 2990;
  const totalConEnvio = subtotal + costoEnvio;

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    direccion: '',
    comuna: 'Santiago',
    metodoPago: 'webpay',
    notas: ''
  });

  const [errores, setErrores] = useState({});
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [numeroOrden, setNumeroOrden] = useState('');

  if (cart.length === 0 && !compraExitosa) {
    return (
      <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '3.5rem 2rem', borderRadius: '16px', textAlign: 'center', maxWidth: '480px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>📦</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FF3B00', margin: '0 0 0.5rem 0' }}>No hay productos para pagar</h2>
          <p style={{ color: '#A0A0AB', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
            Tu carrito está vacío. Agrega cilindros o cargas de gas antes de proceder al checkout.
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
              display: 'inline-block',
              boxShadow: '0 4px 15px rgba(255, 59, 0, 0.3)'
            }}
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.nombreCompleto.trim()) nuevosErrores.nombreCompleto = 'El nombre completo es obligatorio';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) nuevosErrores.email = 'Ingresa un correo electrónico válido';
    if (!formData.telefono.trim() || formData.telefono.length < 8) nuevosErrores.telefono = 'Teléfono requerido (mínimo 8 dígitos)';
    if (!formData.direccion.trim()) nuevosErrores.direccion = 'La dirección de despacho es obligatoria';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const ordenGenerada = `VULK-${Math.floor(100000 + Math.random() * 900000)}`;
    setNumeroOrden(ordenGenerada);
    setCompraExitosa(true);
    clearCart();
  };

  if (compraExitosa) {
    return (
      <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '100vh', padding: '4rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', maxWidth: '520px', width: '100%', padding: '2.5rem', borderRadius: '20px', textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
          <div style={{ width: '70px', height: '70px', backgroundColor: 'rgba(255, 59, 0, 0.15)', color: '#FF3B00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '2rem', fontWeight: 'bold', border: '2px solid rgba(255, 59, 0, 0.4)' }}>
            ✓
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#F5F5F8', margin: '0 0 0.5rem 0' }}>¡Pedido Confirmado!</h1>
          <p style={{ color: '#A0A0AB', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
            Gracias por confiar en Vulkania Gas. Tu orden ha sido recibida y el camión repartidor ya está coordinando la entrega expreso.
          </p>

          <div style={{ backgroundColor: '#0D0D11', border: '1px solid #2A2A35', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2A2A35', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
              <span style={{ color: '#A0A0AB', fontSize: '0.85rem' }}>N° de Orden:</span>
              <strong style={{ color: '#FF8800', fontFamily: 'monospace', fontSize: '1rem' }}>{numeroOrden}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2A2A35', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
              <span style={{ color: '#A0A0AB', fontSize: '0.85rem' }}>Cliente:</span>
              <span style={{ color: '#F5F5F8', fontWeight: '600', fontSize: '0.85rem' }}>{formData.nombreCompleto}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #2A2A35', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
              <span style={{ color: '#A0A0AB', fontSize: '0.85rem' }}>Despacho en:</span>
              <span style={{ color: '#F5F5F8', fontWeight: '600', fontSize: '0.85rem' }}>{formData.direccion}, {formData.comuna}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#A0A0AB', fontSize: '0.85rem' }}>Método de Pago:</span>
              <span style={{ backgroundColor: '#2A2A35', color: '#F5F5F8', fontSize: '0.75rem', fontWeight: '800', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                {formData.metodoPago}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/productos')}
            style={{
              width: '100%',
              backgroundColor: '#FF3B00',
              color: '#FFFFFF',
              border: 'none',
              padding: '1rem',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 59, 0, 0.3)'
            }}
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        
        {/* Encabezado Principal */}
        <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid #2A2A35', paddingBottom: '1.2rem' }}>
          <span style={{ color: '#FF8800', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Despacho Seguro • SEC Certificado
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: '#F5F5F8', margin: '0.3rem 0 0 0' }}>
            Finalizar <span style={{ color: '#FF3B00' }}>Compra</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Columna Izquierda: Formulario de Datos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Sección 1: Datos de Entrega */}
            <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '16px', padding: '1.8rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F5F5F8', margin: '0 0 1.5rem 0', borderBottom: '1px solid #2A2A35', paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#FF3B00' }}>1.</span> Datos del Destinatario
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#A0A0AB', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez González"
                    style={{
                      width: '100%',
                      backgroundColor: '#0D0D11',
                      border: errores.nombreCompleto ? '1px solid #FF3B00' : '1px solid #2A2A35',
                      color: '#F5F5F8',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errores.nombreCompleto && <span style={{ color: '#FF3B00', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>{errores.nombreCompleto}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#A0A0AB', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.cl"
                      style={{
                        width: '100%',
                        backgroundColor: '#0D0D11',
                        border: errores.email ? '1px solid #FF3B00' : '1px solid #2A2A35',
                        color: '#F5F5F8',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    {errores.email && <span style={{ color: '#FF3B00', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>{errores.email}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#A0A0AB', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                      Teléfono Móvil *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+56 9 1234 5678"
                      style={{
                        width: '100%',
                        backgroundColor: '#0D0D11',
                        border: errores.telefono ? '1px solid #FF3B00' : '1px solid #2A2A35',
                        color: '#F5F5F8',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    {errores.telefono && <span style={{ color: '#FF3B00', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>{errores.telefono}</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#A0A0AB', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                      Dirección de Despacho *
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      placeholder="Av. Las Condes 1234, Depto 402"
                      style={{
                        width: '100%',
                        backgroundColor: '#0D0D11',
                        border: errores.direccion ? '1px solid #FF3B00' : '1px solid #2A2A35',
                        color: '#F5F5F8',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    {errores.direccion && <span style={{ color: '#FF3B00', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block' }}>{errores.direccion}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#A0A0AB', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                      Comuna
                    </label>
                    <select
                      name="comuna"
                      value={formData.comuna}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        backgroundColor: '#0D0D11',
                        border: '1px solid #2A2A35',
                        color: '#F5F5F8',
                        padding: '0.75rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        cursor: 'pointer',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="Santiago">Santiago</option>
                      <option value="Maipú">Maipú</option>
                      <option value="Providencia">Providencia</option>
                      <option value="Las Condes">Las Condes</option>
                      <option value="Puente Alto">Puente Alto</option>
                      <option value="Cerrillos">Cerrillos</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Método de Pago */}
            <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '16px', padding: '1.8rem', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F5F5F8', margin: '0 0 1.2rem 0', borderBottom: '1px solid #2A2A35', paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#FF3B00' }}>2.</span> Método de Pago
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
                {[
                  { id: 'webpay', label: 'Webpay / Redcompra', icon: '💳' },
                  { id: 'transferencia', label: 'Transferencia Bancaria', icon: '🏦' },
                  { id: 'efectivo', label: 'Pago contra Entrega', icon: '💵' }
                ].map((metodo) => (
                  <label
                    key={metodo.id}
                    style={{
                      border: formData.metodoPago === metodo.id ? '1px solid #FF3B00' : '1px solid #2A2A35',
                      backgroundColor: formData.metodoPago === metodo.id ? 'rgba(255, 59, 0, 0.1)' : '#0D0D11',
                      padding: '1rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value={metodo.id}
                      checked={formData.metodoPago === metodo.id}
                      onChange={handleChange}
                      style={{ accentColor: '#FF3B00' }}
                    />
                    <span style={{ fontSize: '1.2rem' }}>{metodo.icon}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#F5F5F8' }}>{metodo.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Columna Derecha: Resumen de la Orden */}
          <div style={{
            backgroundColor: '#18181E',
            border: '1px solid #2A2A35',
            borderRadius: '16px',
            padding: '1.8rem',
            position: 'sticky',
            top: '20px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#F5F5F8', marginBottom: '1.2rem', borderBottom: '1px solid #2A2A35', paddingBottom: '0.8rem' }}>
              Resumen del Pedido
            </h2>

            {/* Lista de productos */}
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingRight: '4px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: '1px dashed #2A2A35', paddingBottom: '0.6rem' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '700', color: '#F5F5F8' }}>{item.nombre}</p>
                    <p style={{ margin: 0, color: '#A0A0AB', fontSize: '0.75rem' }}>Cantidad: {item.cantidad}</p>
                  </div>
                  <span style={{ fontWeight: '800', color: '#F5F5F8' }}>
                    {formatCLP((Number(item.precio) || 0) * (Number(item.cantidad) || 0))}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotales */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', marginBottom: '1.5rem', borderTop: '1px solid #2A2A35', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A0A0AB' }}>
                <span>Subtotal productos:</span>
                <span style={{ color: '#F5F5F8', fontWeight: '700' }}>{formatCLP(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A0A0AB' }}>
                <span>Costo despacho:</span>
                <span style={{ color: costoEnvio === 0 ? '#00E676' : '#F5F5F8', fontWeight: '700' }}>
                  {costoEnvio === 0 ? '¡GRATIS!' : formatCLP(costoEnvio)}
                </span>
              </div>
            </div>

            {/* Total Final */}
            <div style={{ borderTop: '1px solid #2A2A35', paddingTop: '1rem', marginBottom: '1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F5F5F8' }}>Total a Pagar:</span>
              <span style={{ fontSize: '2rem', fontWeight: '900', color: '#FF3B00' }}>
                {formatCLP(totalConEnvio)}
              </span>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#FF3B00',
                color: '#FFFFFF',
                border: 'none',
                padding: '1rem',
                borderRadius: '10px',
                fontWeight: '900',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 59, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              🔒 Confirmar y Pagar Order
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;