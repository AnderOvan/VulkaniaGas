// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Sesión y protección de rutas
import { AuthProvider } from './context/AuthContext';
import { RutaAdmin } from './components/RutaAdmin';

// Layout
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminLayout } from './components/layout/AdminLayout';

// Páginas públicas
import { Home } from './pages/Home';
import { Nosotros } from './pages/Nosotros';
import { Blog } from './pages/Blog';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { Contacto } from './pages/Contacto';
import { Productos } from './pages/Productos';

// Páginas del panel administrativo
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProductos } from './pages/admin/AdminProductos';
import { AdminUsuarios } from './pages/admin/AdminUsuarios';

// Marco del sitio público (Header + Navbar + contenido + Footer)
const LayoutPublico = () => (
  <>
    <Header />
    <Navbar />
    <main style={{ flexGrow: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </>
);

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0D0D11' }}>
          <Routes>
            <Route element={<LayoutPublico />}>
              <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/productos" element={<Productos />} />
            </Route>

            {/* Panel admin: el marco completo queda protegido, y con él los tres paneles hijos */}
            <Route path="/admin" element={<RutaAdmin><AdminLayout /></RutaAdmin>}>
              <Route index element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
