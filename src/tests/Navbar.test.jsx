// src/tests/Navbar.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from '../components/layout/Navbar';

describe('Prueba Unitaria 1: Navbar', () => {
  it('Debe renderizar la marca Vulkania y todos los enlaces de navegación pública', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText(/VULKANIA/i)).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });
});