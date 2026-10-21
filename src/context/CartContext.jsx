import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto del carrito
const CartContext = createContext();

const CART_STORAGE_KEY = 'vulkania_cart_v1';

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error al cargar el carrito de localStorage:', error);
      return [];
    }
  });

  // Guardar en localStorage ante cualquier cambio en 'cart'
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage:', error);
    }
  }, [cart]);

  /**
   * Agregar producto al carrito
   * @param {Object} product - Producto a agregar
   * @param {number} quantity - Cantidad deseada (por defecto 1)
   */
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);

      if (existingIndex >= 0) {
        const updatedCart = [...prevCart];
        const currentQty = updatedCart[existingIndex].cantidad;
        const newQty = Math.min(currentQty + quantity, product.stock);

        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          cantidad: newQty
        };
        return updatedCart;
      } else {
        
        const initialQty = Math.min(quantity, product.stock);
        return [...prevCart, { ...product, cantidad: initialQty }];
      }
    });
  };

  /**
   * Eliminar un producto por completo del carrito
   * @param {string} id - ID del producto
   */
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  /**
   * Actualizar la cantidad de un producto específico
   * @param {string} id - ID del producto
   * @param {number} newQuantity - Nueva cantidad
   */
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const validQty = Math.min(newQuantity, item.stock);
          return { ...item, cantidad: validQty };
        }
        return item;
      })
    );
  };

  /**
   * Vaciar el carrito por completo
   */
  const clearCart = () => {
    setCart([]);
  };

  // Cálculos derivados del estado
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  /**
   * Utilidad para dar formato a moneda CLP chilena
   * @param {number} amount - Monto en pesos
   */
  const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        formatCLP
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto del carrito fácilmente
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
};