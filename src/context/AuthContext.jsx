

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  cerrarSesion as borrarSesion,
  EVENTO_SESION_EXPIRADA,
  guardarSesion,
  msHastaExpirar,
  obtenerSesion
} from '../services/api';


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


  useEffect(() => {
    const alExpirar = () => {
      setUsuario(null);
      setSesionExpirada(true);
    };
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, []);

 
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

