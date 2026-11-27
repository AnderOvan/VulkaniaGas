// src/data/productosStore.js
// Constantes y validación de productos para el panel admin.
// Los datos ya NO se guardan aquí: viven en MySQL y se consumen desde la API REST.
import { CATEGORIAS } from './gasData';

export const STOCK_CRITICO = 10;
export const CATEGORIAS_PRODUCTO = Object.values(CATEGORIAS).filter((c) => c !== CATEGORIAS.TODOS);

// Devuelve un objeto { campo: 'mensaje' }. Vacío = datos válidos.
export const validarProducto = (datos, productos = [], idEditando = null) => {
  const errores = {};
  const nombre = (datos.nombre || '').trim();
  const precio = Number(datos.precio);
  const stock = Number(datos.stock);

  if (!nombre) {
    errores.nombre = 'El nombre es obligatorio.';
  } else if (productos.some((p) => p.id !== idEditando && p.nombre.trim().toLowerCase() === nombre.toLowerCase())) {
    errores.nombre = 'Ya existe un producto con ese nombre.';
  }

  if (datos.precio === '' || datos.precio === null || Number.isNaN(precio)) {
    errores.precio = 'El precio es obligatorio.';
  } else if (!Number.isInteger(precio) || precio <= 0) {
    errores.precio = 'El precio debe ser un entero mayor a 0 (CLP).';
  }

  if (datos.stock === '' || datos.stock === null || Number.isNaN(stock)) {
    errores.stock = 'El stock es obligatorio.';
  } else if (!Number.isInteger(stock) || stock < 0) {
    errores.stock = 'El stock debe ser un entero igual o mayor a 0.';
  }

  if (!CATEGORIAS_PRODUCTO.includes(datos.categoria)) {
    errores.categoria = 'Selecciona una categoría.';
  }

  if (!(datos.peso || '').trim()) {
    errores.peso = 'El peso es obligatorio (Ej: 11 kg).';
  }

  if ((datos.imagen || '').trim() && !/^https?:\/\/\S+$/i.test(datos.imagen.trim())) {
    errores.imagen = 'La imagen debe ser una URL que comience con http:// o https://';
  }

  return errores;
};
