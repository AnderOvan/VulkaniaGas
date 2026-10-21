// src/pages/admin/AdminProductos.jsx
import React, { useState } from 'react';
import {
  CATEGORIAS_PRODUCTO,
  STOCK_CRITICO,
  obtenerProductos,
  validarProducto,
  agregarProducto,
  actualizarProducto,
  eliminarProducto
} from '../../data/productosStore';
import './Admin.css';

const FORM_VACIO = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: '',
  peso: '',
  stock: '',
  destacado: false,
  imagen: ''
};

const formatoCLP = (n) =>
  n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

const estadoStock = (stock) => {
  if (stock === 0) return { clase: 'badge-danger', texto: 'Agotado' };
  if (stock <= STOCK_CRITICO) return { clase: 'badge-warn', texto: `${stock} · Crítico` };
  return { clase: 'badge-ok', texto: `${stock}` };
};

export const AdminProductos = () => {
  const [productos, setProductos] = useState(obtenerProductos);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const criticos = productos.filter((p) => p.stock <= STOCK_CRITICO);

  const visibles = productos.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
    const coincideCategoria = !filtroCategoria || p.categoria === filtroCategoria;
    return coincideTexto && coincideCategoria;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setErrores({});
    setMensaje('');
    setMostrarForm(true);
  };

  const abrirEditar = (producto) => {
    setForm({ ...FORM_VACIO, ...producto });
    setEditandoId(producto.id);
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
    const nuevosErrores = validarProducto(form, productos, editandoId);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    if (editandoId) {
      actualizarProducto(editandoId, form);
      setMensaje('Producto actualizado correctamente.');
    } else {
      agregarProducto(form);
      setMensaje('Producto creado correctamente.');
    }
    setProductos(obtenerProductos());
    cerrarForm();
  };

  const handleEliminar = (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;
    eliminarProducto(producto.id);
    setProductos(obtenerProductos());
    setMensaje('Producto eliminado.');
    if (editandoId === producto.id) cerrarForm();
  };

  const campo = (name, label, props = {}) => (
    <div className="admin-field">
      <label htmlFor={`prod-${name}`}>{label}</label>
      <input
        id={`prod-${name}`}
        name={name}
        className="input-vulkania"
        value={form[name]}
        onChange={handleChange}
        {...props}
      />
      {errores[name] && <span className="admin-error" role="alert">{errores[name]}</span>}
    </div>
  );

  return (
    <div className="container-vulkania admin-page">
      <div className="admin-header">
        <div>
          <h1 className="title-vulkania">Productos</h1>
          <p className="subtitle-vulkania">{productos.length} productos en el catálogo.</p>
        </div>
        <button type="button" className="btn-vulkania" onClick={abrirCrear}>
          + Nuevo producto
        </button>
      </div>

      {criticos.length > 0 && (
        <div className="alert-vulkania admin-alert" role="status">
          ⚠️ Stock crítico (≤ {STOCK_CRITICO}): {criticos.map((p) => p.nombre).join(' · ')}
        </div>
      )}

      {mensaje && <div className="admin-success" role="status">{mensaje}</div>}

      {mostrarForm && (
        <form className="card-vulkania admin-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de producto">
          <h2 className="product-name">{editandoId ? 'Editar producto' : 'Nuevo producto'}</h2>

          <div className="admin-form-grid">
            {campo('nombre', 'Nombre', { type: 'text', placeholder: 'Cilindro Gas Licuado 11kg' })}
            {campo('peso', 'Peso', { type: 'text', placeholder: '11 kg' })}
            {campo('precio', 'Precio (CLP)', { type: 'number', min: 1, step: 1, placeholder: '42990' })}
            {campo('stock', 'Stock', { type: 'number', min: 0, step: 1, placeholder: '10' })}

            <div className="admin-field">
              <label htmlFor="prod-categoria">Categoría</label>
              <select
                id="prod-categoria"
                name="categoria"
                className="input-vulkania"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="">Selecciona…</option>
                {CATEGORIAS_PRODUCTO.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errores.categoria && <span className="admin-error" role="alert">{errores.categoria}</span>}
            </div>

            {campo('imagen', 'URL de imagen (opcional)', { type: 'text', placeholder: 'https://…' })}
          </div>

          <div className="admin-field">
            <label htmlFor="prod-descripcion">Descripción</label>
            <textarea
              id="prod-descripcion"
              name="descripcion"
              className="input-vulkania"
              rows={3}
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>

          <label className="admin-check">
            <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} />
            Producto destacado
          </label>

          <div className="admin-actions">
            <button type="submit" className="btn-vulkania">
              {editandoId ? 'Guardar cambios' : 'Crear producto'}
            </button>
            <button type="button" className="btn-secondary" onClick={cerrarForm}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="admin-toolbar">
        <input
          type="search"
          className="input-vulkania"
          placeholder="Buscar por nombre…"
          aria-label="Buscar producto"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="input-vulkania"
          aria-label="Filtrar por categoría"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS_PRODUCTO.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="card-vulkania admin-table-wrap">
        {visibles.length === 0 ? (
          <p className="subtitle-vulkania">No hay productos que coincidan con la búsqueda.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((p) => {
                const estado = estadoStock(p.stock);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="product-name">{p.nombre}</div>
                      <div className="admin-muted">{p.peso}</div>
                    </td>
                    <td>{p.categoria}</td>
                    <td>{formatoCLP(p.precio)}</td>
                    <td><span className={`badge ${estado.clase}`}>{estado.texto}</span></td>
                    <td>{p.destacado ? '★' : '—'}</td>
                    <td>
                      <div className="admin-actions">
                        <button type="button" className="btn-secondary btn-sm" onClick={() => abrirEditar(p)}>
                          Editar
                        </button>
                        <button type="button" className="btn-secondary btn-sm btn-danger" onClick={() => handleEliminar(p)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProductos;
