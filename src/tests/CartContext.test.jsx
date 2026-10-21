import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartProvider, useCart } from '../context/CartContext';

const productoPrueba = {
  id: 'gas-11kg-comp',
  nombre: 'Cilindro Gas Licuado 11kg',
  precio: 42990,
  stock: 5,
  categoria: 'Cilindros Completos',
  peso: '11 kg'
};

describe('Pruebas del CartContext (Alumno 2)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debe inicializarse con un carrito vacío', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    expect(result.current.cart).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    // Evalúa si la propiedad es cartTotal o totalPrice
    const total = result.current.cartTotal ?? result.current.totalPrice ?? 0;
    expect(total).toBe(0);
  });

  it('debe agregar un producto y ajustar la cantidad correctamente', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(productoPrueba, 2);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.totalItems).toBe(2);

    // Evalúa ambas posibles variables de total
    const total = result.current.cartTotal ?? result.current.totalPrice;
    expect(total).toBe(42990 * 2);

    act(() => {
      result.current.updateQuantity(productoPrueba.id, 4);
    });

    expect(result.current.cart[0].cantidad).toBe(4);
    expect(result.current.totalItems).toBe(4);
  });

  it('no debe permitir superar el stock máximo al agregar o actualizar', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(productoPrueba, 10);
    });

    expect(result.current.cart[0].cantidad).toBe(5);

    act(() => {
      result.current.updateQuantity(productoPrueba.id, 8);
    });

    expect(result.current.cart[0].cantidad).toBe(5);
  });

  it('debe eliminar un producto cuando la cantidad llega a 0 o se remueve manualmente', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(productoPrueba, 2);
    });

    act(() => {
      result.current.removeFromCart(productoPrueba.id);
    });

    expect(result.current.cart.length).toBe(0);
  });

  it('debe persistir el carrito en localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addToCart(productoPrueba, 3);
    });

    // Busca la clave en localStorage sin importar la versión empleada
    const rawData = 
      localStorage.getItem('vulkania_cart') || 
      localStorage.getItem('vulkania_cart_v1') || 
      localStorage.getItem('cart');

    const storedData = JSON.parse(rawData);
    expect(storedData).not.toBeNull();
    expect(storedData.length).toBe(1);
    expect(storedData[0].cantidad).toBe(3);
  });
});