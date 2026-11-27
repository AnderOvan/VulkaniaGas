// src/services/api.js
// Punto único de acceso a la API REST: agrega el token JWT, y trata la sesión vencida o inválida.

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const CLAVE_SESION = 'usuarioVulkania';
export const EVENTO_SESION_EXPIRADA = 'vulkania:sesion-expirada';

// Lee el payload (parte central) de un JWT sin verificar la firma: la firma solo la verifica el backend.
const leerPayload = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

/** Milisegundos que faltan para que venza el token (0 o negativo = ya venció o es inválido). */
export const msHastaExpirar = (token) => {
  const payload = leerPayload(token);
  if (!payload || typeof payload.exp !== 'number') return 0;
  return payload.exp * 1000 - Date.now();
};

export const cerrarSesion = () => localStorage.removeItem(CLAVE_SESION);

export const guardarSesion = (datos) => localStorage.setItem(CLAVE_SESION, JSON.stringify(datos));

/** Devuelve la sesión guardada (login + token) o null si no existe, está dañada o el token ya venció. */
export const obtenerSesion = () => {
  try {
    const crudo = localStorage.getItem(CLAVE_SESION);
    if (!crudo) return null;
    const sesion = JSON.parse(crudo);
    if (!sesion?.token || msHastaExpirar(sesion.token) <= 0) {
      cerrarSesion();
      return null;
    }
    return sesion;
  } catch {
    cerrarSesion();
    return null;
  }
};

/**
 * fetch hacia la API con el token en "Authorization: Bearer".
 * Si el backend responde 401 (token vencido, inválido o usuario desactivado) se borra la sesión
 * y se avisa a la app para que redirija al login.
 */
export const apiFetch = async (ruta, opciones = {}) => {
  const sesion = obtenerSesion();
  const headers = { ...(opciones.headers || {}) };
  if (opciones.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  if (sesion) headers.Authorization = `Bearer ${sesion.token}`;

  const respuesta = await fetch(`${API_BASE}${ruta}`, { ...opciones, headers });

  if (respuesta.status === 401) {
    cerrarSesion();
    window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
  }
  return respuesta;
};

/** Extrae el mensaje de error que envía el backend ({ "mensaje": "..." }) o uno por defecto. */
export const leerMensaje = async (respuesta, porDefecto = 'Ocurrió un error.') => {
  if (respuesta.status === 401) return 'Tu sesión expiró. Inicia sesión nuevamente.';
  if (respuesta.status === 403) return 'No tienes permisos para realizar esta acción.';
  try {
    const datos = await respuesta.json();
    return datos.mensaje || datos.error || porDefecto;
  } catch {
    return porDefecto;
  }
};
