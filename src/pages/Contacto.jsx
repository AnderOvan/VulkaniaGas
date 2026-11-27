// src/pages/Contacto.jsx
import React, { useState } from 'react';

export const Contacto = () => {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }
    setError('');
    setEnviado(true);
  };

  return (
    <div style={{ backgroundColor: '#0D0D11', color: '#F5F5F8', minHeight: '80vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>
            Centro de <span style={{ color: '#FF3B00' }}>Contacto</span>
          </h1>
          <p style={{ color: '#A0A0AB', marginTop: '0.5rem' }}>
            ¿Tienes alguna consulta sobre tu pedido o cobertura? Escríbenos directamente.
          </p>
        </div>

        <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', borderRadius: '12px', padding: '2rem' }}>
          {enviado ? (
            <div role="status" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <span style={{ fontSize: '3rem' }}>🔥</span>
              <h3 style={{ color: '#FF8800', margin: '1rem 0 0.5rem 0' }}>¡Mensaje Enviado con Éxito!</h3>
              <p style={{ color: '#A0A0AB' }}>Nos pondremos en contacto contigo a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {error && (
                <div role="alert" style={{ backgroundColor: 'rgba(255, 59, 0, 0.15)', border: '1px solid #FF3B00', color: '#F5F5F8', padding: '0.8rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#A0A0AB', marginBottom: '0.3rem' }}>Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: María González"
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#A0A0AB', marginBottom: '0.3rem' }}>Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.cl"
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#A0A0AB', marginBottom: '0.3rem' }}>Mensaje</label>
                <textarea
                  name="mensaje"
                  rows="4"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="Escribe tu consulta aquí..."
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical' }}
                ></textarea>
              </div>

              <button
                type="submit"
                style={{ padding: '0.85rem', backgroundColor: '#FF3B00', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}
              >
                Enviar Mensaje
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contacto;