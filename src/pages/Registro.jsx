// src/pages/Registro.jsx
import React, { useState } from 'react';

// Función para validar RUT Chileno SIN PUNTOS NI GUION
export const validarRutSinFormato = (rut) => {
  if (!rut) return false;
  
  if (/[.-]/.test(rut)) {
    return false;
  }

  const cleanRut = rut.trim().toUpperCase();
  if (!/^[0-9]{7,8}[0-9K]$/.test(cleanRut)) {
    return false;
  }

  const cuerpo = cleanRut.slice(0, -1);
  const dvIngresado = cleanRut.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperadoNum = 11 - (suma % 11);
  let dvEsperado = '';
  if (dvEsperadoNum === 11) dvEsperado = '0';
  else if (dvEsperadoNum === 10) dvEsperado = 'K';
  else dvEsperado = dvEsperadoNum.toString();

  return dvIngresado === dvEsperado;
};

export const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    email: '',
    password: ''
  });

  const [errores, setErrores] = useState({});
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errores[e.target.name]) {
      setErrores({ ...errores, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    }

    if (!formData.rut.trim()) {
      nuevosErrores.rut = 'El RUT es obligatorio.';
    } else if (/[.-]/.test(formData.rut)) {
      nuevosErrores.rut = 'El RUT debe ingresarse sin puntos ni guion (Ej: 19876543K).';
    } else if (!validarRutSinFormato(formData.rut)) {
      nuevosErrores.rut = 'El RUT ingresado no es válido.';
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'El formato de correo no es válido.';
    }

    if (!formData.password || formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
    } else {
      setErrores({});
      setRegistroExitoso(true);
    }
  };

  return (
    <div style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#18181E', border: '1px solid #2A2A35', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ color: '#F5F5F8', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          Crear <span style={{ color: '#FF3B00' }}>Cuenta</span>
        </h2>

        {registroExitoso ? (
          <div style={{ backgroundColor: 'rgba(255, 136, 0, 0.1)', border: '1px solid #FF8800', color: '#F5F5F8', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', color: '#FF8800' }}>¡Registro Exitoso!</p>
            <p style={{ fontSize: '0.9rem' }}>Tu usuario ha sido registrado en Vulkania Gas.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.875rem', color: '#A0A0AB' }}>Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
              />
              {errores.nombre && <span style={{ color: '#FF3B00', fontSize: '0.8rem' }}>{errores.nombre}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.875rem', color: '#A0A0AB' }}>RUT (Sin puntos ni guion)</label>
              <input
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                placeholder="19876543K"
                style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
              />
              {errores.rut && <span style={{ color: '#FF3B00', fontSize: '0.8rem' }}>{errores.rut}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.875rem', color: '#A0A0AB' }}>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.cl"
                style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
              />
              {errores.email && <span style={{ color: '#FF3B00', fontSize: '0.8rem' }}>{errores.email}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.875rem', color: '#A0A0AB' }}>Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.7rem', backgroundColor: '#0D0D11', border: '1px solid #2A2A35', color: '#F5F5F8', borderRadius: '6px', boxSizing: 'border-box' }}
              />
              {errores.password && <span style={{ color: '#FF3B00', fontSize: '0.8rem' }}>{errores.password}</span>}
            </div>

            <button
              type="submit"
              style={{ padding: '0.8rem', backgroundColor: '#FF3B00', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}
            >
              Registrarse
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Registro;