import React from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos, STOCK_CRITICO } from '../../data/productosStore';
import './Admin.css';

export const AdminDashboard = () => {
  const gasProducts = obtenerProductos();
  const criticos = gasProducts.filter((p) => p.stock <= STOCK_CRITICO);
  const valorInventario = gasProducts.reduce((total, p) => total + p.precio * p.stock, 0);

  return (
    <div className="container-vulkania admin-page">
      <div className="admin-header">
        <div>
          <h1 className="title-vulkania">Panel administrativo</h1>
          <p className="subtitle-vulkania">Estado actual del catálogo.</p>
        </div>
        <Link to="/admin/productos" className="btn-vulkania">Gestionar productos</Link>
      </div>

      <div className="admin-grid">
        <div className="card-vulkania">
          <div className="admin-kpi-label">Productos</div>
          <div className="admin-kpi-value">{gasProducts.length}</div>
        </div>

        <div className="card-vulkania">
          <div className="admin-kpi-label">Stock crítico (≤ {STOCK_CRITICO})</div>
          <div className={`admin-kpi-value ${criticos.length > 0 ? 'warn' : ''}`}>{criticos.length}</div>
        </div>

        <div className="card-vulkania">
          <div className="admin-kpi-label">Valor del inventario</div>
          <div className="admin-kpi-value">
            {valorInventario.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      <div className="card-vulkania">
        <h2 className="product-name">Productos por reponer</h2>
        {criticos.length === 0 ? (
          <p className="subtitle-vulkania">Todos los productos tienen stock suficiente.</p>
        ) : (
          <ul className="admin-list">
            {criticos.map((p) => (
              <li key={p.id}>
                <span>{p.nombre}</span>
                <span className={`badge ${p.stock === 0 ? 'badge-danger' : 'badge-warn'}`}>
                  {p.stock === 0 ? 'Agotado' : `${p.stock} en stock`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;