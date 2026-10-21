import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Registro from '../pages/Registro';

export const validarRutSinFormato = (rut) => {
  if (!rut) return false;
  const texto = String(rut).trim();
  // Si contiene puntos o guion, se rechaza
  if (texto.includes('.') || texto.includes('-')) return false;
  // Debe ser solo números seguido opcionalmente de K/k
  return /^[0-9]{7,8}[0-9kK]$/.test(texto);
};

describe('Prueba Unitaria 2: Registro y Validación de RUT', () => {
  it('Debe rechazar RUTs ingresados con puntos o guion y aceptar el formato limpio sin puntos', () => {
    expect(validarRutSinFormato('19.876.543-K')).toBe(false);
    expect(validarRutSinFormato('12345678-9')).toBe(false);
    expect(validarRutSinFormato('19876543K')).toBe(true);
  });

  it('Debe mostrar error en el formulario si se ingresa un RUT con guion', () => {
    render(<Registro />);
    
    const rutInput = screen.getByPlaceholderText('19876543K');
    const submitBtn = screen.getByRole('button', { name: /Registrarse/i });

    fireEvent.change(rutInput, { target: { value: '19876543-K' } });
    fireEvent.click(submitBtn);

    const mensajesError = screen.getAllByText(/sin puntos ni guion/i);
    expect(mensajesError.length).toBeGreaterThan(0);
  });
});