```markdown
# 🌋 Vulkania Gas Online - Plataforma E-Commerce Fullstack

> **Asignatura:** DSY1104 - Desarrollo Fullstack  
> **Evaluación:** Evaluación 3 (EV3) - Duoc UC  
> **Stack Tecnológico:** React 18 + Vite + Spring Boot + Spring Security (JWT) + MySQL + Swagger UI  

---

## 📋 Descripción del Proyecto
**Vulkania Gas Online** es una aplicación web Fullstack orientada a la venta y distribución a domicilio de cilindros de gas licuado (5kg, 11kg, 15kg y 45kg), cargas y accesorios.

El sistema integra un frontend SPA en **React** conectado a una API REST desarrollada en **Java Spring Boot** con persistencia en **MySQL (`vulkania_gas_db`)**. Incluye autenticación stateless mediante **JSON Web Tokens (JWT)**, control de acceso basado en roles (`ADMIN` y `CLIENTE`), validación y descuento automático de stock en tiempo real al confirmar compras, documentación interactiva en **Swagger UI** y un panel administrativo completo.

---

## 🎨 Identidad Visual y Paleta Volcánica

La interfaz utiliza un diseño oscuro (*Dark Mode*) inspirado en basalto, magma y lava:

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

## 🚀 Cómo Iniciar el Proyecto (Backend + Frontend)

### Requisitos Previos
- **Node.js** (v18 o superior) y **npm**
- **Java JDK 17** o superior
- **XAMPP** (o servidor MySQL activo en el puerto `3306`)

---

### Paso 1: Levantar la Base de Datos (MySQL)
1. Abre el panel de **XAMPP** e inicia los servicios **Apache** y **MySQL**.
2. Entra a **phpMyAdmin** en `http://localhost/phpmyadmin`.
3. Crea una base de datos vacía llamada **`vulkania_gas_db`** con cotejamiento `utf8mb4_general_ci`.  
   *(Al iniciar el backend, Spring Data JPA creará automáticamente las tablas `productos`, `usuarios` y `pedidos`, además de cargar los productos iniciales y el usuario administrador).*

---

### Paso 2: Iniciar el Backend (Spring Boot API)
1. Abre una terminal en la raíz del proyecto y entra a la carpeta del servidor Java:
   ```bash
   cd BackendEV3/vulkanIA/vulkanIA

```

2. Ejecuta el servidor con Maven Wrapper:
* **En Windows (PowerShell / CMD):**
```bash
.\mvnw.cmd spring-boot:run

```


* **En Linux / Mac:**
```bash
./mvnw spring-boot:run

```




3. Verifica que el servidor levantó en el puerto **`8080`**:
* **API Base:** `http://localhost:8080/api`
* **Documentación Swagger UI:** `http://localhost:8080/swagger-ui/index.html`



---

### Paso 3: Iniciar el Frontend (React + Vite)

1. Abre una **segunda terminal** en la carpeta raíz del proyecto (`VulkaniaGas-main`).
2. Instala las dependencias (solo la primera vez):
```bash
npm install

```


3. Inicia el servidor de desarrollo:
```bash
npm run dev

```


4. Abre la aplicación en tu navegador en **`http://localhost:5173`**.

---

## 🔐 Credenciales de Acceso (Demo)

El sistema inicializa automáticamente una cuenta de administrador al arrancar el backend:

| Rol | Correo Electrónico | Contraseña | Permisos |
| --- | --- | --- | --- |
| **Administrador** | `admin@vulkania.cl` | `admin123` | Acceso a `/admin` (CRUD de Productos, Gestión de Usuarios y Gestión de Pedidos). |
| **Cliente** | *Registrable en `/registro*` | *Definida al registrar* | Compra en catálogo (`/productos`) con descuento automático de stock. |

---

## 👥 Arquitectura y Módulos del Proyecto

### 🟢 Layout, Páginas Públicas y Autenticación

* **Componentes Layout:** `Header.jsx`, `Navbar.jsx` (con sincronización de sesión en `localStorage` e insignia `ADMIN`), `Footer.jsx`.
* **Vistas Públicas:** `Home.jsx`, `Nosotros.jsx`, `Blog.jsx`, `DetalleBlog.jsx`, `Contacto.jsx`.
* **Autenticación JWT:** `Login.jsx` (con persistencia de sesión `usuarioVulkania` y autocompletado seguro) y `Registro.jsx` (validación de RUT chileno Módulo 11).

### 🟠 Catálogo, Carrito y Lógica de Negocio (Pedidos)

* **Catálogo Dinámico (`Productos.jsx`):** Consume `GET /api/productos`, filtra por categorías (`Cilindros Completos`, `Cargas / Recargas`, `Válvulas y Accesorios`, `Calefacción`) y muestra imágenes locales desde `public/images/`.
* **Procesamiento de Compras (`POST /api/pedidos`):** Valida stock disponible en el backend, descuenta unidades en MySQL de forma transaccional y registra cada orden con correo y dirección de entrega.

### 🔵 Panel Administrativo Protegido (`/admin`)

* **Protección de Rutas (`App.jsx`):** Componente guardia `RutaAdmin` que bloquea el acceso si no existe token válido o si `rol !== 'ADMIN'`.
* **Gestión de Productos (`AdminProductos.jsx`):** CRUD completo (`GET`, `POST`, `PUT`, `DELETE`) autenticado con header `Authorization: Bearer <token>` y alertas de stock crítico.
* **Gestión de Usuarios (`AdminUsuarios.jsx`):** Listado de usuarios reales desde MySQL y eliminación protegida.
* **Gestión de Pedidos (`AdminPedidos.jsx`):** Historial de ventas, cálculo de ingresos totales, creación manual de pedidos y eliminación con restauración automática de stock.

---

## 📂 Estructura del Repositorio

```text
VulkaniaGas/
├── BackendEV3/
│   └── vulkanIA/vulkanIA/                # API REST Spring Boot + Spring Security + JPA
│       └── src/main/java/com/Vulkania/ev3/vulkanIA/
│           ├── config/                   # DataInitializer, JwtFilter, JwtUtil, SecurityConfig
│           ├── controller/               # PedidoController, ProductoController, UsuarioController
│           ├── dto/                      # LoginDTO, PedidoDTO, RegistroDTO
│           ├── model/                    # Pedido, Producto, Usuario
│           ├── repository/               # Repositorios Spring Data JPA
│           └── service/                  # Lógica de negocio
├── public/
│   └── images/                           # Imágenes locales de cilindros (5kg, 11kg, 15kg, 45kg)
├── src/
│   ├── components/layout/                # Header.jsx, Navbar.jsx, Footer.jsx
│   ├── data/                             # Validaciones y utilidades de catálogo
│   ├── pages/                            # Home, Productos, Nosotros, Blog, Login, Registro, Contacto
│   │   └── admin/                        # AdminProductos.jsx, AdminUsuarios.jsx, AdminPedidos.jsx
│   ├── tests/                            # Pruebas unitarias (Vitest + React Testing Library)
│   ├── App.jsx                           # Enrutamiento público y guardia RutaAdmin
│   └── main.jsx
├── package.json
└── README.md

```
git push

```
