// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const response = await fetch(`${apiUrl}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('usuarioVulkania', JSON.stringify(data));
        navigate(data.rol === 'ADMIN' ? '/admin' : '/');
      } else {
        setError(data.mensaje || 'Credenciales incorrectas.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor de Vulkania Gas.');
    }
  };

  return (
    <div style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ color: '#F5F5F8', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          Iniciar <span style={{ color: '#FF3B00' }}>Sesión</span>
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {error && (
            <div style={{ backgroundColor: 'rgba(255, 59, 0, 0.15)', border: '1px solid #FF3B00', color: '#FF3B00', padding: '0.7rem', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.875rem', color: '#A0A0AB' }}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.cl"
              style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.875rem', color: '#A0A0AB' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            style={{ padding: '0.8rem', backgroundColor: '#FF3B00', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;