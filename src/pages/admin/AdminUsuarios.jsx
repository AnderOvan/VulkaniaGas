// src/pages/admin/AdminUsuarios.jsx
import React, { useState } from 'react';
import {
  ROLES,
  ESTADOS,
  obtenerUsuarios,
  validarUsuario,
  puedeEliminarUsuario,
  agregarUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../../data/usuariosStore';
import './Admin.css';

const FORM_VACIO = { nombre: '', rut: '', email: '', rol: 'cliente', estado: 'activo' };

const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1);

export const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState(obtenerUsuarios);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('');

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
    setForm({ ...FORM_VACIO, ...usuario });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = validarUsuario(form, usuarios, editandoId);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (editandoId) {
      actualizarUsuario(editandoId, form);
      setMensaje('Usuario actualizado correctamente.');
    } else {
      agregarUsuario(form);
      setMensaje('Usuario creado correctamente.');
    }
    setUsuarios(obtenerUsuarios());
    cerrarForm();
  };

  const handleEliminar = (usuario) => {
    if (!puedeEliminarUsuario(usuario.id, usuarios)) {
      setMensaje('No puedes eliminar al único administrador activo.');
      return;
    }
    if (!window.confirm(`¿Eliminar a "${usuario.nombre}"? Esta acción no se puede deshacer.`)) return;
    eliminarUsuario(usuario.id);
    setUsuarios(obtenerUsuarios());
    setMensaje('Usuario eliminado.');
    if (editandoId === usuario.id) cerrarForm();
  };

  const alternarEstado = (usuario) => {
    const nuevo = { ...usuario, estado: usuario.estado === 'activo' ? 'inactivo' : 'activo' };
    const errs = validarUsuario(nuevo, usuarios, usuario.id);
    if (errs.rol) {
      setMensaje(errs.rol);
      return;
    }
    actualizarUsuario(usuario.id, nuevo);
    setUsuarios(obtenerUsuarios());
    setMensaje(`Usuario ${nuevo.estado === 'activo' ? 'activado' : 'desactivado'}.`);
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

      {mensaje && <div className="admin-success" role="status">{mensaje}</div>}

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
                  <td><span className={`badge ${u.rol === 'admin' ? 'badge-warn' : 'badge-muted'}`}>{capitalizar(u.rol)}</span></td>
                  <td><span className={`badge ${u.estado === 'activo' ? 'badge-ok' : 'badge-danger'}`}>{capitalizar(u.estado)}</span></td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="btn-secondary btn-sm" onClick={() => abrirEditar(u)}>Editar</button>
                      <button type="button" className="btn-secondary btn-sm" onClick={() => alternarEstado(u)}>
                        {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
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
