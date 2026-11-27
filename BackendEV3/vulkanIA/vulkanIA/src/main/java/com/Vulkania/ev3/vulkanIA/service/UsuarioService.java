package com.Vulkania.ev3.vulkanIA.service;

import com.Vulkania.ev3.vulkanIA.dto.LoginDTO;
import com.Vulkania.ev3.vulkanIA.dto.RegistroDTO;
import com.Vulkania.ev3.vulkanIA.dto.UsuarioAdminDTO;
import com.Vulkania.ev3.vulkanIA.model.Usuario;
import com.Vulkania.ev3.vulkanIA.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class UsuarioService {

    private static final Set<String> ROLES = Set.of("CLIENTE", "ADMIN");
    private static final Set<String> ESTADOS = Set.of("ACTIVO", "INACTIVO");
    private static final String MSG_ULTIMO_ADMIN = "Debe quedar al menos un administrador activo.";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // POST - Registro público: siempre crea un CLIENTE activo
    public Usuario registrar(RegistroDTO dto) {
        String rut = normalizarRut(dto.getRut());
        String email = normalizarEmail(dto.getEmail());
        validarIdentidad(dto.getNombre(), rut, email, null);
        validarPassword(dto.getPassword(), true);

        Usuario nuevo = new Usuario();
        nuevo.setNombre(dto.getNombre().trim());
        nuevo.setRut(rut);
        nuevo.setEmail(email);
        nuevo.setPassword(passwordEncoder.encode(dto.getPassword()));
        nuevo.setRol("CLIENTE");
        nuevo.setEstado("ACTIVO");
        return usuarioRepository.save(nuevo);
    }

    // POST - Login
    public Usuario login(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(normalizarEmail(dto.getEmail()))
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas."));

        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas.");
        }
        if ("INACTIVO".equals(usuario.getEstado())) {
            throw new RuntimeException("Tu cuenta está inactiva. Contacta al administrador.");
        }
        return usuario;
    }

    // GET - Listar todos
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // GET - Buscar por ID
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    // POST (admin) - Crear usuario con rol y estado
    public Usuario crearAdmin(UsuarioAdminDTO dto) {
        String rut = normalizarRut(dto.getRut());
        String email = normalizarEmail(dto.getEmail());
        validarIdentidad(dto.getNombre(), rut, email, null);
        validarPassword(dto.getPassword(), true);
        String rol = validarRol(dto.getRol());
        String estado = validarEstado(dto.getEstado());

        Usuario u = new Usuario();
        u.setNombre(dto.getNombre().trim());
        u.setRut(rut);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(dto.getPassword()));
        u.setRol(rol);
        u.setEstado(estado);
        return usuarioRepository.save(u);
    }

    // PUT (admin) - Actualizar datos, rol y estado
    public Usuario actualizar(Long id, UsuarioAdminDTO dto) {
        Usuario existente = obtenerPorId(id);
        String rut = normalizarRut(dto.getRut());
        String email = normalizarEmail(dto.getEmail());
        validarIdentidad(dto.getNombre(), rut, email, id);
        validarPassword(dto.getPassword(), false);
        String rol = validarRol(dto.getRol());
        String estado = validarEstado(dto.getEstado());
        verificarUltimoAdmin(existente, rol, estado);

        existente.setNombre(dto.getNombre().trim());
        existente.setRut(rut);
        existente.setEmail(email);
        existente.setRol(rol);
        existente.setEstado(estado);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existente.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return usuarioRepository.save(existente);
    }

    // PATCH (admin) - Activar / desactivar
    public Usuario cambiarEstado(Long id, String estadoNuevo) {
        Usuario existente = obtenerPorId(id);
        String estado = validarEstado(estadoNuevo);
        verificarUltimoAdmin(existente, existente.getRol(), estado);
        existente.setEstado(estado);
        return usuarioRepository.save(existente);
    }

    // DELETE (admin) - Eliminar usuario (nunca al último admin activo)
    public void eliminar(Long id) {
        Usuario existente = obtenerPorId(id);
        if (esAdminActivo(existente)
                && usuarioRepository.countByRolAndEstado("ADMIN", "ACTIVO") <= 1) {
            throw new IllegalStateException("No puedes eliminar al único administrador activo.");
        }
        usuarioRepository.delete(existente);
    }

    // ---------- reglas de negocio y validaciones ----------

    /** Regla: siempre debe quedar al menos un administrador activo. */
    private void verificarUltimoAdmin(Usuario original, String nuevoRol, String nuevoEstado) {
        boolean seguiraAdminActivo = "ADMIN".equals(nuevoRol) && "ACTIVO".equals(nuevoEstado);
        if (esAdminActivo(original) && !seguiraAdminActivo
                && usuarioRepository.countByRolAndEstado("ADMIN", "ACTIVO") <= 1) {
            throw new IllegalStateException(MSG_ULTIMO_ADMIN);
        }
    }

    private boolean esAdminActivo(Usuario u) {
        return "ADMIN".equals(u.getRol()) && !"INACTIVO".equals(u.getEstado());
    }

    private void validarIdentidad(String nombre, String rut, String email, Long idEditando) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio.");
        }
        if (rut.isEmpty()) {
            throw new IllegalArgumentException("El RUT es obligatorio.");
        }
        if (rut.contains(".") || rut.contains("-")) {
            throw new IllegalArgumentException("El RUT debe ingresarse sin puntos ni guion (Ej: 198765430).");
        }
        if (!rutValido(rut)) {
            throw new IllegalArgumentException("El RUT ingresado no es válido.");
        }
        usuarioRepository.findByRut(rut).filter(u -> !u.getId().equals(idEditando)).ifPresent(u -> {
            throw new IllegalStateException("El RUT ya se encuentra registrado.");
        });

        if (email.isEmpty()) {
            throw new IllegalArgumentException("El correo electrónico es obligatorio.");
        }
        if (!email.matches("^\\S+@\\S+\\.\\S+$")) {
            throw new IllegalArgumentException("El formato de correo no es válido.");
        }
        usuarioRepository.findByEmail(email).filter(u -> !u.getId().equals(idEditando)).ifPresent(u -> {
            throw new IllegalStateException("El correo ya está en uso.");
        });
    }

    private void validarPassword(String password, boolean obligatoria) {
        boolean vacia = password == null || password.isBlank();
        if (vacia && obligatoria) {
            throw new IllegalArgumentException("La contraseña es obligatoria.");
        }
        if (!vacia && password.length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres.");
        }
    }

    private String validarRol(String rol) {
        String valor = rol == null ? "" : rol.trim().toUpperCase();
        if (!ROLES.contains(valor)) throw new IllegalArgumentException("Selecciona un rol válido (CLIENTE o ADMIN).");
        return valor;
    }

    private String validarEstado(String estado) {
        String valor = estado == null ? "" : estado.trim().toUpperCase();
        if (!ESTADOS.contains(valor)) throw new IllegalArgumentException("Selecciona un estado válido (ACTIVO o INACTIVO).");
        return valor;
    }

    private String normalizarRut(String rut) {
        return rut == null ? "" : rut.trim().toUpperCase();
    }

    private String normalizarEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    /** Misma lógica de validarRutSinFormato del frontend (módulo 11, sin puntos ni guion). */
    static boolean rutValido(String rut) {
        if (rut == null || !rut.matches("[0-9]{7,8}[0-9K]")) return false;
        int largo = rut.length();
        int suma = 0;
        int mult = 2;
        for (int i = largo - 2; i >= 0; i--) {
            suma += (rut.charAt(i) - '0') * mult;
            mult = mult == 7 ? 2 : mult + 1;
        }
        int resto = 11 - (suma % 11);
        char esperado = resto == 11 ? '0' : resto == 10 ? 'K' : (char) ('0' + resto);
        return rut.charAt(largo - 1) == esperado;
    }
}
