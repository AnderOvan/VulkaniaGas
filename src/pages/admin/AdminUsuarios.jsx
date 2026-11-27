// src/pages/admin/AdminUsuarios.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/usuarios`;

export const AdminUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const sesion = JSON.parse(localStorage.getItem('usuarioVulkania') || 'null');

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    ...(sesion?.token ? { Authorization: `Bearer ${sesion.token}` } : {})
  });

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const response = await fetch(API_URL, {
        headers: getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('usuarioVulkania');
        navigate('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios desde el backend:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleEliminar = async (usuario) => {
    if (usuario.id === sesion?.id) {
      alert('No puedes eliminar tu propio usuario administrador en sesión.');
      return;
    }
    if (!window.confirm(`¿Eliminar al usuario "${usuario.nombre}" (${usuario.email})?`)) return;

    try {
      const res = await fetch(`${API_URL}/${usuario.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('usuarioVulkania');
        navigate('/login');
        return;
      }

      if (res.ok) {
        setMensaje('Usuario eliminado correctamente.');
        await cargarUsuarios();
      }
    } catch (error) {
      setMensaje('Error al eliminar usuario.');
    }
  };

  const visibles = usuarios.filter((u) => {
    const q = busqueda.trim().toLowerCase();
    return (
      u.nombre?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.rut?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container-vulkania admin-page">
      <div className="admin-header">
        <div>
          <h1 className="title-vulkania">Usuarios Registrados</h1>
          <p className="subtitle-vulkania">{usuarios.length} usuarios en la base de datos.</p>
        </div>
      </div>

      {mensaje && <div className="admin-success" role="status">{mensaje}</div>}

      <div className="admin-toolbar">
        <input
          type="search"
          className="input-vulkania"
          placeholder="Buscar por nombre, correo o RUT…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="card-vulkania admin-table-wrap">
        {cargando ? (
          <p className="subtitle-vulkania">Cargando usuarios...</p>
        ) : visibles.length === 0 ? (
          <p className="subtitle-vulkania">No se encontraron usuarios.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>RUT</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td><div className="product-name">{u.nombre}</div></td>
                  <td>{u.rut}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.rol === 'ADMIN' ? 'badge-warn' : 'badge-ok'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary btn-sm btn-danger"
                      onClick={() => handleEliminar(u)}
                    >
                      Eliminar
                    </button>
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