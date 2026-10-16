import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Páginas Públicas (Alumno 1)
import { Home } from './pages/Home';
import { Nosotros } from './pages/Nosotros';
import { Blog } from './pages/Blog';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { Contacto } from './pages/Contacto';

// Páginas Módulo E-Commerce (Alumno 2)
import { Productos } from './pages/Productos';
import { DetalleProducto } from './pages/DetalleProducto';
import { Carrito } from './pages/Carrito';
import { Checkout } from './pages/Checkout';

export function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0D0D11' }}>
      <Header />
      <Navbar />
      
      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* Alumno 1 */}
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Alumno 2 */}
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;