// src/data/productosStore.js

export const CATEGORIAS_PRODUCTO = [
  'Cilindros Domésticos',
  'Cilindros Industriales',
  'Estanques',
  'Accesorios y Reguladores'
];

export const STOCK_CRITICO = 5;

export const validarProducto = (form, productos = [], editandoId = null) => {
  const errores = {};

  if (!form.nombre || !form.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.';
  } else {
    const duplicado = productos.some(
      (p) =>
        p.id !== editandoId &&
        p.nombre.trim().toLowerCase() === form.nombre.trim().toLowerCase()
    );
    if (duplicado) {
      errores.nombre = 'Ya existe un producto con ese nombre.';
    }
  }

  if (!form.categoria) {
    errores.categoria = 'Selecciona una categoría.';
  }

  if (form.precio === '' || Number(form.precio) <= 0) {
    errores.precio = 'Ingresa un precio mayor a 0.';
  }

  if (form.stock === '' || Number(form.stock) < 0) {
    errores.stock = 'El stock no puede ser negativo.';
  }

  return errores;
};