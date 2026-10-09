# 🌋 Vulkania Gas Online - Single Page Application (SPA)

> **Asignatura:** DSY1104 - Desarrollo Fullstack  
> **Evaluación:** Evaluación Parcial 2 (EP2) - Duoc UC  
> **Tecnologías:** React 18 + Vite + React Router DOM + Vitest + React Testing Library  

---

## 📋 Descripción del Proyecto
**Vulkania Gas Online** es una Single Page Application (SPA) e-commerce moderna orientada a la distribución de cilindros de gas licuado (5kg, 11kg, 15kg y 45kg), cargas y accesorios a domicilio. 

El sistema cuenta con navegación fluida sin recargas de página, gestión global de carrito de compras con persistencia automática en `localStorage`, validaciones estrictas de formularios de usuario y suite de pruebas unitarias automatizadas.

---

## 🎨 Identidad Visual y Paleta Volcánica

La interfaz utiliza un diseño oscuro (*Dark Mode*) basado en colores de basalto, magma y lava:

| Elemento | Uso CSS | Código Hex |
| :--- | :--- | :--- |
| **Fondo Principal** | Obsidiana / Basalto | `#0D0D11` |
| **Tarjetas / Contenedores** | Piedra Volcánica | `#18181E` |
| **Acento Primario** | Lava Fuego | `#FF3B00` |
| **Acento Secundario** | Magma Amber | `#FF8800` |
| **Texto Principal** | Platino / Titanio | `#F5F5F8` |
| **Texto Secundario** | Ceniza | `#A0A0AB` |
| **Bordes** | Líneas de Basalto | `#2A2A35` |

---

## 👥 Distribución del Grupo (3 Integrantes)

### 🟢 Alumno 1: Layout, Páginas Públicas y Autenticación
* **Componentes Layout:** `Header.jsx`, `Navbar.jsx`, `Footer.jsx`
* **Vistas Públicas:** `Home.jsx`, `Nosotros.jsx`, `Blog.jsx`, `Contacto.jsx`
* **Módulo de Autenticación:**
  * `Login.jsx`: Formulario de acceso de clientes.
  * `Registro.jsx`: Formulario con **validación estricta de RUT chileno (Módulo 11) sin puntos ni guion** y correo válido.
* **Pruebas Unitarias (Vitest + RTL):**
  * `src/tests/Navbar.test.jsx`
  * `src/tests/Registro.test.jsx`
  * `src/tests/Contacto.test.jsx`

### 🟠 Alumno 2: E-Commerce, Carrito, LocalStorage y Checkout
* **Capa de Datos:** `src/data/gasData.js` (Catálogo con precios CLP, stock, pesos y categorías).
* **Estado Global:** `src/context/CartContext.jsx` con sincronización automática en `localStorage`.
* **Vistas de Catálogo y Compra:** `Productos.jsx`, `DetalleProducto.jsx`, `Carrito.jsx`, `Checkout.jsx`.
* **Pruebas Unitarias:** Pruebas de interacción con el carrito, ajuste de cantidades y persistencia de datos.

### 🔵 Alumno 3: Administración CRUD y Documentación ERS
* **Panel Administrativo:** `AdminDashboard.jsx`, `AdminProductos.jsx` (alerta de stock crítico), `AdminUsuarios.jsx`.
* **Testing de Spies:** Cobertura de funciones con `vi.fn()`.
* **Entregables:** Documento ERS V2 e Informe de Cobertura de Testing.

---

## 📂 Estructura del Proyecto

```text
VulkaniaGas/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── components/
    │   └── layout/
    │       ├── Navbar.jsx
    │       ├── Header.jsx
    │       └── Footer.jsx
    ├── context/
    │   └── CartContext.jsx
    ├── data/
    │   └── gasData.js
    ├── pages/
    │   ├── Home.jsx
    │   ├── Productos.jsx
    │   ├── DetalleProducto.jsx
    │   ├── Carrito.jsx
    │   ├── Checkout.jsx
    │   ├── Nosotros.jsx
    │   ├── Blog.jsx
    │   ├── Login.jsx
    │   ├── Registro.jsx
    │   ├── Contacto.jsx
    │   └── admin/
    │       ├── AdminDashboard.jsx
    │       ├── AdminProductos.jsx
    │       └── AdminUsuarios.jsx
    └── tests/
        ├── Navbar.test.jsx
        ├── Registro.test.jsx
        └── Contacto.test.jsx
