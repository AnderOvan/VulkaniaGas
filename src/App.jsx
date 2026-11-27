// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

// Layout
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Páginas públicas
import { Home } from './pages/Home';
import { Nosotros } from './pages/Nosotros';
import { Blog } from './pages/Blog';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { Contacto } from './pages/Contacto';
import { Productos } from './pages/Productos';

// Páginas Admin
import { AdminProductos } from './pages/admin/AdminProductos';
import { AdminUsuarios } from './pages/admin/AdminUsuarios';
import { AdminPedidos } from './pages/admin/AdminPedidos';

// Guardia de ruta protegida para ADMIN
const RutaAdmin = ({ children }) => {
  const sesion = JSON.parse(localStorage.getItem('usuarioVulkania') || 'null');
  const location = useLocation();

  if (!sesion || !sesion.token) {
    return <Navigate to="/login" replace />;
  }

  if (sesion.rol !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const getTabStyle = (path, isDefault = false) => {
    const active = location.pathname === path || (isDefault && location.pathname === '/admin');
    return {
      color: active ? '#FF3B00' : '#F5F5F8',
      textDecoration: 'none',
      fontWeight: 'bold',
      borderBottom: active ? '2px solid #FF3B00' : '2px solid transparent',
      paddingBottom: '0.25rem',
    };
  };

  return (
    <div>
      {/* Barra rápida de navegación interna del panel Admin */}
      <div style={{ backgroundColor: '#18181E', borderBottom: '1px solid #2A2A35', padding: '0.75rem 1.5rem', display: 'flex', gap: '1.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/admin/productos" style={getTabStyle('/admin/productos', true)}>
          📦 Gestión de Productos
        </Link>
        <Link to="/admin/usuarios" style={getTabStyle('/admin/usuarios')}>
          👥 Gestión de Usuarios
        </Link>
        <Link to="/admin/pedidos" style={getTabStyle('/admin/pedidos')}>
          📋 Gestión de Pedidos
        </Link>
      </div>
      {children}
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0D0D11' }}>
        <Header />
        <Navbar />

        <main style={{ flexGrow: 1 }}>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/productos" element={<Productos />} />

            {/* Rutas Protegidas ADMIN */}
            <Route path="/admin" element={<RutaAdmin><AdminProductos /></RutaAdmin>} />
            <Route path="/admin/productos" element={<RutaAdmin><AdminProductos /></RutaAdmin>} />
            <Route path="/admin/usuarios" element={<RutaAdmin><AdminUsuarios /></RutaAdmin>} />
            <Route path="/admin/pedidos" element={<RutaAdmin><AdminPedidos /></RutaAdmin>} />

            {/* Ruta comodín por si escriben cualquier URL */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;