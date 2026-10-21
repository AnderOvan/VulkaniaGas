// src/data/usuariosStore.js
// Persistencia de usuarios en localStorage (el proyecto no tiene backend).
// Nota: el panel admin NO gestiona contraseñas; solo datos, rol y estado.
import { validarRutSinFormato } from '../pages/Registro';

export const STORAGE_KEY = 'vulkania_usuarios';
export const ROLES = ['cliente', 'admin'];
export const ESTADOS = ['activo', 'inactivo'];

export const usuariosIniciales = [
  { id: 'u-1', nombre: 'Administrador Vulkania', rut: '123456785', email: 'admin@vulkania.cl', rol: 'admin', estado: 'activo' },
  { id: 'u-2', nombre: 'María González', rut: '187654327', email: 'maria.gonzalez@correo.cl', rol: 'cliente', estado: 'activo' },
  { id: 'u-3', nombre: 'Pedro Soto', rut: '201112222', email: 'pedro.soto@correo.cl', rol: 'cliente', estado: 'activo' },
  { id: 'u-4', nombre: 'Camila Rojas', rut: '158889994', email: 'camila.rojas@correo.cl', rol: 'cliente', estado: 'inactivo' }
];

export const obtenerUsuarios = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const datos = JSON.parse(raw);
      if (Array.isArray(datos)) return datos;
    }
  } catch {
    // JSON corrupto o localStorage no disponible: se usan los usuarios base
  }
  return usuariosIniciales;
};

export const guardarUsuarios = (lista) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  return lista;
};

export const restaurarUsuarios = () => {
  localStorage.removeItem(STORAGE_KEY);
  return usuariosIniciales;
};

const generarIdUsuario = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? `u-${crypto.randomUUID()}` : `u-${Date.now()}`;

// Devuelve { campo: 'mensaje' }. Vacío = datos válidos.
export const validarUsuario = (datos, usuarios = [], idEditando = null) => {
  const errores = {};
  const nombre = (datos.nombre || '').trim();
  const rut = (datos.rut || '').trim().toUpperCase();
  const email = (datos.email || '').trim().toLowerCase();

  if (!nombre) errores.nombre = 'El nombre es obligatorio.';

  if (!rut) {
    errores.rut = 'El RUT es obligatorio.';
  } else if (/[.-]/.test(rut)) {
    errores.rut = 'El RUT debe ingresarse sin puntos ni guion (Ej: 198765430).';
  } else if (!validarRutSinFormato(rut)) {
    errores.rut = 'El RUT ingresado no es válido.';
  } else if (usuarios.some((u) => u.id !== idEditando && u.rut === rut)) {
    errores.rut = 'Ya existe un usuario con ese RUT.';
  }

  if (!email) {
    errores.email = 'El correo electrónico es obligatorio.';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errores.email = 'El formato de correo no es válido.';
  } else if (usuarios.some((u) => u.id !== idEditando && u.email.toLowerCase() === email)) {
    errores.email = 'Ya existe un usuario con ese correo.';
  }

  if (!ROLES.includes(datos.rol)) errores.rol = 'Selecciona un rol.';
  if (!ESTADOS.includes(datos.estado)) errores.estado = 'Selecciona un estado.';

  // Regla de negocio: siempre debe quedar al menos un admin activo
  if (idEditando) {
    const original = usuarios.find((u) => u.id === idEditando);
    const eraAdminActivo = original && original.rol === 'admin' && original.estado === 'activo';
    const seguiraAdminActivo = datos.rol === 'admin' && datos.estado === 'activo';
    const otrosAdmins = usuarios.filter((u) => u.id !== idEditando && u.rol === 'admin' && u.estado === 'activo');
    if (eraAdminActivo && !seguiraAdminActivo && otrosAdmins.length === 0) {
      errores.rol = 'Debe quedar al menos un administrador activo.';
    }
  }

  return errores;
};

export const puedeEliminarUsuario = (id, usuarios) => {
  const u = usuarios.find((x) => x.id === id);
  if (!u) return false;
  if (u.rol !== 'admin' || u.estado !== 'activo') return true;
  return usuarios.some((x) => x.id !== id && x.rol === 'admin' && x.estado === 'activo');
};

const armarUsuario = (datos, id) => ({
  id,
  nombre: datos.nombre.trim(),
  rut: datos.rut.trim().toUpperCase(),
  email: datos.email.trim().toLowerCase(),
  rol: datos.rol,
  estado: datos.estado
});

export const agregarUsuario = (datos) => {
  const nuevo = armarUsuario(datos, generarIdUsuario());
  guardarUsuarios([...obtenerUsuarios(), nuevo]);
  return nuevo;
};

export const actualizarUsuario = (id, datos) => {
  const actualizado = armarUsuario(datos, id);
  guardarUsuarios(obtenerUsuarios().map((u) => (u.id === id ? actualizado : u)));
  return actualizado;
};

export const eliminarUsuario = (id) => {
  const usuarios = obtenerUsuarios();
  if (!puedeEliminarUsuario(id, usuarios)) return usuarios;
  const restantes = usuarios.filter((u) => u.id !== id);
  guardarUsuarios(restantes);
  return restantes;
};
