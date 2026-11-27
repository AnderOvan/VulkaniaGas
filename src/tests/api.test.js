// Pruebas del cliente de API: envío del token y tratamiento de la sesión inválida (IE3.3.2).
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiFetch, CLAVE_SESION, EVENTO_SESION_EXPIRADA, leerMensaje } from '../services/api';

const tokenValido = () => {
  const b64 = (o) => btoa(JSON.stringify(o)).replace(/=/g, '');
  return `${b64({ alg: 'HS256' })}.${b64({ exp: Math.floor(Date.now() / 1000) + 3600 })}.firma`;
};

describe('apiFetch', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('agrega Authorization: Bearer cuando hay sesión', async () => {
    const token = tokenValido();
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ token, rol: 'ADMIN' }));
    const espia = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ status: 200, ok: true });

    await apiFetch('/productos');

    expect(espia.mock.calls[0][1].headers.Authorization).toBe(`Bearer ${token}`);
  });

  it('ante un 401 borra la sesión y avisa a la app', async () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ token: tokenValido(), rol: 'ADMIN' }));
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ status: 401, ok: false });
    const aviso = vi.fn();
    window.addEventListener(EVENTO_SESION_EXPIRADA, aviso);

    await apiFetch('/usuarios');

    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
    expect(aviso).toHaveBeenCalledTimes(1);
    window.removeEventListener(EVENTO_SESION_EXPIRADA, aviso);
  });

  it('leerMensaje distingue 403 de un error con mensaje del backend', async () => {
    expect(await leerMensaje({ status: 403 })).toMatch(/permisos/i);
    expect(await leerMensaje({ status: 409, json: async () => ({ mensaje: 'Regla de negocio' }) })).toBe('Regla de negocio');
  });
});
