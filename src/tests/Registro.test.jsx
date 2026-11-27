// src/tests/Registro.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Registro, { validarRutSinFormato } from '../pages/Registro';

describe('Prueba Unitaria 2: Registro y Validación de RUT', () => {
  it('Debe rechazar RUTs ingresados con puntos o guion y aceptar el formato limpio sin puntos', () => {
    // Verificación directa de la función Módulo 11 sin puntos ni guion
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

    expect(screen.getByText(/sin puntos ni guion/i)).toBeInTheDocument();
  });
});