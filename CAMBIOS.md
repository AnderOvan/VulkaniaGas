# Cambios aplicados al proyecto VulkaniaGas (EP3)

Backend (`BackendEV3/`) y frontend (`src/`) corregidos para que el acceso administrativo funcione de punta a punta:
login -> token JWT -> sesión que persiste -> rutas por rol -> CRUD protegido en el backend.

## Cómo ejecutarlo
1. MySQL (XAMPP, puerto 3307). La base `vulkania_gas_db` se crea sola.
2. Backend: `cd BackendEV3/vulkanIA/vulkanIA && ./mvnw spring-boot:run` -> http://localhost:8080/swagger-ui.html
3. Frontend: `npm install && npm run dev` -> http://localhost:5173
4. Admin de demostración: `admin@vulkania.cl` / `admin123` (el backend lo crea al iniciar).
   Para probar el rol cliente, registra un usuario desde la pantalla Registro.
5. Pruebas del frontend: `npm test`.
6. Secreto JWT: variable de entorno `JWT_SECRET` (mínimo 32 caracteres). Sin ella se usa un valor de desarrollo.

## Backend (carpeta BackendEV3)
| Archivo | Cambio |
|---|---|
| `resources/application.properties` | `jwt.secret` y `jwt.expiration-seconds` configurables |
| `config/JwtUtil.java` | valida expiración y firma (antes aceptaba tokens vencidos); secreto fuera del código |
| `config/SecurityConfig.java` | se quitó `anyRequest().permitAll()`; 401 sin token, 403 sin rol; usuarios y escritura de productos solo ADMIN |
| `model/Usuario.java` | campo `estado`; la contraseña ya no se devuelve en el JSON |
| `repository/UsuarioRepository.java` | `findByRut`, `countByRolAndEstado` |
| `dto/UsuarioAdminDTO.java` (nuevo) | datos del panel admin (rol y estado) |
| `service/UsuarioService.java` | validaciones (RUT, correo, contraseña), cuenta inactiva no inicia sesión, regla del último admin activo |
| `controller/UsuarioController.java` | `POST`, `PUT`, `PATCH /{id}/estado`; códigos 400/401/403/404/409 |

## Frontend (carpeta src)
| Archivo | Cambio |
|---|---|
| `services/api.js` (nuevo) | `apiFetch` agrega `Authorization: Bearer`; ante 401 borra la sesión y avisa a la app; `leerMensaje` |
| `context/AuthContext.jsx` (nuevo) | sesión compartida; se restaura de localStorage al recargar; descarta token vencido; cierra sola al vencer |
| `components/RutaAdmin.jsx` (nuevo) | sin sesión -> /login; cliente -> "Acceso denegado"; ADMIN -> contenido |
| `components/layout/AdminLayout.jsx` | marco del panel con `<Outlet />`, nombre de usuario y Cerrar sesión |
| `App.jsx` | rutas `/admin`, `/admin/productos`, `/admin/usuarios` bajo `RutaAdmin`; `AuthProvider` |
| `components/layout/Navbar.jsx` | invitado: Iniciar sesión/Registrarse; con sesión: nombre, "Panel admin" (solo ADMIN) y Cerrar sesión |
| `pages/Login.jsx` | usa `iniciarSesion`; muestra "Tu sesión expiró" |
| `pages/admin/AdminProductos.jsx` | POST/PUT/DELETE con token y mensajes del backend |
| `pages/admin/AdminUsuarios.jsx` | reescrito para usar la API (antes localStorage); campo contraseña; activar/desactivar por PATCH |
| `pages/admin/AdminDashboard.jsx` | resumen calculado con los productos de MySQL |
| `data/productosStore.js` | reducido a constantes y validación (los datos viven en MySQL) |
| `tests/RutaAdmin.test.jsx`, `tests/api.test.js` (nuevos) | invitado/cliente/admin, token vencido, envío del token, manejo de 401 |
| `package.json`, `vite.config.js`, `tests/setup.js` | vitest + Testing Library para poder ejecutar `npm test` |

## Verificación realizada
- Frontend: `vite build` sin errores, `oxlint` 0 errores, 9 de 11 pruebas pasan.
  Las 2 que fallan son de `Registro.test.jsx` y ya fallaban antes de estos cambios.
- Backend: NO se pudo compilar ni ejecutar en el entorno de preparación (sin Maven ni acceso a repositorios).
  Solo se probó por separado la lógica de JWT (válido, vencido, otra clave, adulterado) y la de RUT.
  Falta ejecutar `./mvnw spring-boot:run` y probar en Swagger.

## Pendiente / a revisar
- Swagger: springdoc 2.8.5 es para Spring Boot 3; con Boot 4 puede requerir springdoc 3.x. Falta el esquema `bearerAuth` (botón Authorize).
- `pom.xml`: Eureka Server y Gateway no se usan en la EP3.
- `ProductoController` no valida los datos de entrada; las categorías del seed del backend ("Cilindros") difieren de las del frontend ("Cilindros Completos").
- Las 2 pruebas fallidas de `Registro.test.jsx`.
