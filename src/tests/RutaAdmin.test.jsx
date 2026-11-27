// src/tests/RutaAdmin.test.jsx
// Pruebas de control de acceso en el frontend (IE3.3.3): invitado, cliente y administrador.
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { RutaAdmin } from '../components/RutaAdmin';
import { CLAVE_SESION } from '../services/api';

// Arma un JWT de prueba (la firma da igual: solo el backend la verifica)
const tokenConExp = (segundos) => {
  const b64 = (o) => btoa(JSON.stringify(o)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${b64({ alg: 'HS256' })}.${b64({ sub: 'x@y.cl', rol: 'ADMIN', exp: Math.floor(Date.now() / 1000) + segundos })}.firma`;
};

const guardarSesionDePrueba = (rol, segundos = 3600) =>
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: 'Prueba', rol, token: tokenConExp(segundos) }));

const renderizarAdmin = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div>Pantalla de login</div>} />
          <Route path="/admin" element={<RutaAdmin><div>Contenido admin</div></RutaAdmin>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

describe('RutaAdmin: restricción de rutas por rol', () => {
  beforeEach(() => localStorage.clear());

  it('sin sesión redirige al login', () => {
    renderizarAdmin();
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });

  it('un cliente ve "Acceso denegado"', () => {
    guardarSesionDePrueba('CLIENTE');
    renderizarAdmin();
    expect(screen.getByText('Acceso denegado')).toBeInTheDocument();
    expect(screen.queryByText('Contenido admin')).not.toBeInTheDocument();
  });

  it('un administrador accede al contenido', () => {
    guardarSesionDePrueba('ADMIN');
    renderizarAdmin();
    expect(screen.getByText('Contenido admin')).toBeInTheDocument();
  });

  it('una sesión con token vencido se descarta al recargar', () => {
    guardarSesionDePrueba('ADMIN', -60);
    renderizarAdmin();
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });
});
