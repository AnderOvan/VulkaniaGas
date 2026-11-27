// src/tests/Contacto.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Contacto from '../pages/Contacto';

describe('Prueba Unitaria 3: Formulario de Contacto', () => {
  it('Debe mostrar un mensaje de error si los campos obligatorios están vacíos', () => {
    render(<Contacto />);

    const botonEnviar = screen.getByRole('button', { name: /Enviar Mensaje/i });
    fireEvent.click(botonEnviar);

    expect(screen.getByRole('alert')).toHaveTextContent('Por favor, completa todos los campos requeridos.');
  });
});