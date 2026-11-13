// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Páginas
import { Home } from './pages/Home';
import { Nosotros } from './pages/Nosotros';
import { Blog } from './pages/Blog';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { Contacto } from './pages/Contacto';
import { Productos } from './pages/Productos';

export function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0D0D11' }}>
        <Header />
        <Navbar />
        
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/productos" element={<Productos />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;