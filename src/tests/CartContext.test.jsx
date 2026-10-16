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
    expect(result.current.totalPrice).toBe(0);
  });

  it('debe agregar un producto y ajustar la cantidad correctamente', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    // Agregar producto
    act(() => {
      result.current.addToCart(productoPrueba, 2);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(42990 * 2);

    // Ajustar cantidad
    act(() => {
      result.current.updateQuantity(productoPrueba.id, 4);
    });

    expect(result.current.cart[0].cantidad).toBe(4);
    expect(result.current.totalItems).toBe(4);
  });

  it('no debe permitir superar el stock máximo al agregar o actualizar', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    // Intentar agregar más del stock permitido (stock = 5)
    act(() => {
      result.current.addToCart(productoPrueba, 10);
    });

    expect(result.current.cart[0].cantidad).toBe(5);

    // Intentar actualizar por encima del stock
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

    // Eliminar con removeFromCart
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

    // Verificar que se guardó en localStorage bajo la clave esperada
    const storedData = JSON.parse(localStorage.getItem('vulkania_cart_v1'));
    expect(storedData).not.toBeNull();
    expect(storedData.length).toBe(1);
    expect(storedData[0].cantidad).toBe(3);
  });
});