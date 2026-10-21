// src/components/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

export const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0D0D11', color: '#F5F5F8' }}>
      <Header />
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;