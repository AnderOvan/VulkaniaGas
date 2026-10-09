// src/pages/Login.jsx
import React, { useState } from 'react';

export const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (correo && password) {
      setMensaje('🔥 Sesión iniciada correctamente.');
    } else {
      setMensaje('⚠️ Por favor completa todos los campos.');
    }
  };

  return (
    <div style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '380px' }}>
        <h2 style={{ color: '#F5F5F8', textAlign: 'center', marginBottom: '1.5rem' }}>
          Acceso <span style={{ color: '#FF3B00' }}>Clientes</span>
        </h2>

        {mensaje && (
          <p style={{ color: '#FF8800', textAlign: 'center', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#A0A0AB', marginBottom: '0.3rem' }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#A0A0AB', marginBottom: '0.3rem' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            style={{ padding: '0.8rem', backgroundColor: '#FF3B00', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;