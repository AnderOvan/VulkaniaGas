// src/context/AuthContext.jsx
// Estado de sesión compartido por toda la app. Se restaura desde localStorage al recargar la página.
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  cerrarSesion as borrarSesion,
  EVENTO_SESION_EXPIRADA,
  guardarSesion,
  msHastaExpirar,
  obtenerSesion
} from '../services/api';

// Valor por defecto: permite usar useAuth() en componentes aislados (por ejemplo, en tests).
const AuthContext = createContext({
  usuario: null,
  esAdmin: false,
  sesionExpirada: false,
  iniciarSesion: () => {},
  cerrarSesion: () => {}
});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => obtenerSesion());
  const [sesionExpirada, setSesionExpirada] = useState(false);

  // El backend respondió 401: la sesión ya no es válida.
  useEffect(() => {
    const alExpirar = () => {
      setUsuario(null);
      setSesionExpirada(true);
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, []);

  // Cierra la sesión sola cuando vence el token, aunque la persona no haga ninguna petición.
  useEffect(() => {
    if (!usuario?.token) return undefined;
    const espera = Math.max(msHastaExpirar(usuario.token), 0);
    const temporizador = setTimeout(() => {
      borrarSesion();
      setUsuario(null);
      setSesionExpirada(true);
    }, espera);
    return () => clearTimeout(temporizador);
  }, [usuario]);

  const iniciarSesion = (datos) => {
    guardarSesion(datos);
    setUsuario(datos);
    setSesionExpirada(false);
  };

  const cerrarSesion = () => {
    borrarSesion();
    setUsuario(null);
    setSesionExpirada(false);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, esAdmin: usuario?.rol === 'ADMIN', sesionExpirada, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
