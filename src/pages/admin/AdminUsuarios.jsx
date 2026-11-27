// src/pages/admin/AdminUsuarios.jsx
import React, { useState, useEffect } from 'react';
import { validarRutSinFormato } from '../Registro';
import { apiFetch, leerMensaje } from '../../services/api';
import './Admin.css';

// Los valores coinciden con los del backend (Spring Boot)
const ROLES = ['CLIENTE', 'ADMIN'];
const ESTADOS = ['ACTIVO', 'INACTIVO'];

const FORM_VACIO = { nombre: '', rut: '', email: '', password: '', rol: 'CLIENTE', estado: 'ACTIVO' };

const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();

// Validación de formulario en el cliente (el backend vuelve a validar todo)
const validarFormulario = (datos, esNuevo) => {
  const errores = {};
  const rut = (datos.rut || '').trim().toUpperCase();

  if (!(datos.nombre || '').trim()) errores.nombre = 'El nombre es obligatorio.';

  if (!rut) errores.rut = 'El RUT es obligatorio.';
  else if (/[.-]/.test(rut)) errores.rut = 'El RUT debe ingresarse sin puntos ni guion (Ej: 198765430).';
  else if (!validarRutSinFormato(rut)) errores.rut = 'El RUT ingresado no es válido.';

  if (!(datos.email || '').trim()) errores.email = 'El correo electrónico es obligatorio.';
  else if (!/^\S+@\S+\.\S+$/.test(datos.email.trim())) errores.email = 'El formato de correo no es válido.';

  if (esNuevo && !datos.password) errores.password = 'La contraseña es obligatoria.';
  else if (datos.password && datos.password.length < 6) errores.password = 'La contraseña debe tener al menos 6 caracteres.';

  return errores;
};

export const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');

  const avisar = (texto, error = false) => {
    setMensaje(texto);
    setEsError(error);
  };

  // GET: cargar usuarios desde MySQL (solo ADMIN; el backend responde 403 a un cliente)
  const cargarUsuarios = async () => {
    try {
      const res = await apiFetch('/usuarios');
      if (!res.ok) throw new Error(await leerMensaje(res, 'No se pudo cargar la lista de usuarios.'));
      setUsuarios(await res.json());
    } catch (error) {
      avisar(error instanceof TypeError ? 'No se pudo conectar con el servidor.' : error.message, true);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const visibles = usuarios.filter((u) => {
    const q = busqueda.trim().toLowerCase();
    const coincideTexto =
      !q || u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.rut.toLowerCase().includes(q);
    return coincideTexto && (!filtroRol || u.rol === filtroRol);
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setErrores({});
    setMensaje('');
    setMostrarForm(true);
  };

  const abrirEditar = (usuario) => {
    setForm({ ...FORM_VACIO, ...usuario, password: '' });
    setEditandoId(usuario.id);
    setErrores({});
    setMensaje('');
    setMostrarForm(true);
  };

  const cerrarForm = () => {
    setMostrarForm(false);
    setEditandoId(null);
    setForm(FORM_VACIO);
    setErrores({});
  };

  // POST / PUT: crear o actualizar en MySQL
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarFormulario(form, !editandoId);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      rut: form.rut.trim().toUpperCase(),
      email: form.email.trim(),
      password: form.password,
      rol: form.rol,
      estado: form.estado
    };

    try {
      const res = await apiFetch(editandoId ? `/usuarios/${editandoId}` : '/usuarios', {
        method: editandoId ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await leerMensaje(res, 'No se pudo guardar el usuario.'));

      avisar(editandoId ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
      await cargarUsuarios();
      cerrarForm();
    } catch (error) {
      avisar(error instanceof TypeError ? 'Error de conexión con el servidor.' : error.message, true);
    }
  };

  // DELETE: el backend impide eliminar al único administrador activo (409)
  const handleEliminar = async (usuario) => {
    if (!window.confirm(`¿Eliminar a "${usuario.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await apiFetch(`/usuarios/${usuario.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await leerMensaje(res, 'No se pudo eliminar el usuario.'));

      avisar('Usuario eliminado.');
      await cargarUsuarios();
      if (editandoId === usuario.id) cerrarForm();
    } catch (error) {
      avisar(error instanceof TypeError ? 'Error de conexión con el servidor.' : error.message, true);
    }
  };

  // PATCH: activar / desactivar
  const alternarEstado = async (usuario) => {
    const nuevo = usuario.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    try {
      const res = await apiFetch(`/usuarios/${usuario.id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: nuevo })
      });
      if (!res.ok) throw new Error(await leerMensaje(res, 'No se pudo cambiar el estado.'));

      avisar(`Usuario ${nuevo === 'ACTIVO' ? 'activado' : 'desactivado'}.`);
      await cargarUsuarios();
    } catch (error) {
      avisar(error instanceof TypeError ? 'Error de conexión con el servidor.' : error.message, true);
    }
  };

  return (
    <div className="container-vulkania admin-page">
      <div className="admin-header">
        <div>
          <h1 className="title-vulkania">Usuarios</h1>
          <p className="subtitle-vulkania">{usuarios.length} usuarios registrados.</p>
        </div>
        <button type="button" className="btn-vulkania" onClick={abrirCrear}>
          + Nuevo usuario
        </button>
      </div>

      {mensaje && (
        <div className={esError ? 'alert-vulkania admin-alert' : 'admin-success'} role={esError ? 'alert' : 'status'}>
          {mensaje}
        </div>
      )}

      {mostrarForm && (
        <form className="card-vulkania admin-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de usuario">
          <h2 className="product-name">{editandoId ? 'Editar usuario' : 'Nuevo usuario'}</h2>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="usr-nombre">Nombre completo</label>
              <input id="usr-nombre" name="nombre" type="text" className="input-vulkania"
                placeholder="Juan Pérez" value={form.nombre} onChange={handleChange} />
              {errores.nombre && <span className="admin-error" role="alert">{errores.nombre}</span>}
            </div>

            <div className="admin-field">
              <label htmlFor="usr-rut">RUT (sin puntos ni guion)</label>
              <input id="usr-rut" name="rut" type="text" className="input-vulkania"
                placeholder="198765430" value={form.rut} onChange={handleChange} />
              {errores.rut && <span className="admin-error" role="alert">{errores.rut}</span>}
            </div>

            <div className="admin-field">
              <label htmlFor="usr-email">Correo electrónico</label>
              <input id="usr-email" name="email" type="email" className="input-vulkania"
                placeholder="correo@ejemplo.cl" value={form.email} onChange={handleChange} />
              {errores.email && <span className="admin-error" role="alert">{errores.email}</span>}
            </div>

            <div className="admin-field">
              <label htmlFor="usr-password">{editandoId ? 'Nueva contraseña (opcional)' : 'Contraseña'}</label>
              <input id="usr-password" name="password" type="password" className="input-vulkania"
                autoComplete="new-password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={handleChange} />
              {errores.password && <span className="admin-error" role="alert">{errores.password}</span>}
            </div>

            <div className="admin-field">
              <label htmlFor="usr-rol">Rol</label>
              <select id="usr-rol" name="rol" className="input-vulkania" value={form.rol} onChange={handleChange}>
                {ROLES.map((r) => <option key={r} value={r}>{capitalizar(r)}</option>)}
              </select>
              {errores.rol && <span className="admin-error" role="alert">{errores.rol}</span>}
            </div>

            <div className="admin-field">
              <label htmlFor="usr-estado">Estado</label>
              <select id="usr-estado" name="estado" className="input-vulkania" value={form.estado} onChange={handleChange}>
                {ESTADOS.map((s) => <option key={s} value={s}>{capitalizar(s)}</option>)}
              </select>
              {errores.estado && <span className="admin-error" role="alert">{errores.estado}</span>}
            </div>
          </div>

          <div className="admin-actions">
            <button type="submit" className="btn-vulkania">
              {editandoId ? 'Guardar cambios' : 'Crear usuario'}
            </button>
            <button type="button" className="btn-secondary" onClick={cerrarForm}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="admin-toolbar">
        <input
          type="search"
          className="input-vulkania"
          placeholder="Buscar por nombre, correo o RUT…"
          aria-label="Buscar usuario"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="input-vulkania"
          aria-label="Filtrar por rol"
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
        >
          <option value="">Todos los roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{capitalizar(r)}</option>)}
        </select>
      </div>

      <div className="card-vulkania admin-table-wrap">
        {visibles.length === 0 ? (
          <p className="subtitle-vulkania">No hay usuarios que coincidan con la búsqueda.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((u) => (
                <tr key={u.id}>
                  <td className="product-name">{u.nombre}</td>
                  <td>{u.rut}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.rol === 'ADMIN' ? 'badge-warn' : 'badge-muted'}`}>{capitalizar(u.rol)}</span></td>
                  <td><span className={`badge ${u.estado === 'ACTIVO' ? 'badge-ok' : 'badge-danger'}`}>{capitalizar(u.estado)}</span></td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="btn-secondary btn-sm" onClick={() => abrirEditar(u)}>Editar</button>
                      <button type="button" className="btn-secondary btn-sm" onClick={() => alternarEstado(u)}>
                        {u.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                      </button>
                      <button type="button" className="btn-secondary btn-sm btn-danger" onClick={() => handleEliminar(u)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsuarios;
