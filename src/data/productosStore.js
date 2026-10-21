// src/data/productosStore.js
// Persistencia del catálogo en localStorage. Si aún no hay nada guardado,
// se parte desde el catálogo base de gasData.js.
import { gasProducts, CATEGORIAS } from './gasData';

export const STORAGE_KEY = 'vulkania_productos';
export const STOCK_CRITICO = 10;

// Categorías asignables a un producto (sin "Todos")
export const CATEGORIAS_PRODUCTO = Object.values(CATEGORIAS).filter((c) => c !== CATEGORIAS.TODOS);

export const obtenerProductos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const datos = JSON.parse(raw);
      if (Array.isArray(datos)) return datos;
    }
  } catch {
    // JSON corrupto o localStorage no disponible: se usa el catálogo base
  }
  return gasProducts;
};

export const guardarProductos = (lista) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  return lista;
};

export const restaurarProductos = () => {
  localStorage.removeItem(STORAGE_KEY);
  return gasProducts;
};

const slug = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'producto';

export const generarIdProducto = (nombre, productos) => {
  const base = slug(nombre);
  let id = base;
  let n = 2;
  while (productos.some((p) => p.id === id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
};

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

// Normaliza los datos del formulario al formato del catálogo
export const armarProducto = (datos, id) => ({
  id,
  nombre: datos.nombre.trim(),
  descripcion: (datos.descripcion || '').trim(),
  precio: Number(datos.precio),
  categoria: datos.categoria,
  peso: datos.peso.trim(),
  stock: Number(datos.stock),
  destacado: Boolean(datos.destacado),
  imagen: (datos.imagen || '').trim()
});

export const agregarProducto = (datos) => {
  const productos = obtenerProductos();
  const nuevo = armarProducto(datos, generarIdProducto(datos.nombre, productos));
  guardarProductos([...productos, nuevo]);
  return nuevo;
};

export const actualizarProducto = (id, datos) => {
  const productos = obtenerProductos();
  const actualizado = armarProducto(datos, id);
  guardarProductos(productos.map((p) => (p.id === id ? actualizado : p)));
  return actualizado;
};

export const eliminarProducto = (id) => {
  const productos = obtenerProductos().filter((p) => p.id !== id);
  guardarProductos(productos);
  return productos;
};
