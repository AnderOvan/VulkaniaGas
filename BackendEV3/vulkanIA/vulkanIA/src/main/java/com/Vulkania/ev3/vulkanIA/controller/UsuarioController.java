package com.Vulkania.ev3.vulkanIA.controller;

import com.Vulkania.ev3.vulkanIA.config.JwtUtil;
import com.Vulkania.ev3.vulkanIA.dto.LoginDTO;
import com.Vulkania.ev3.vulkanIA.dto.RegistroDTO;
import com.Vulkania.ev3.vulkanIA.dto.UsuarioAdminDTO;
import com.Vulkania.ev3.vulkanIA.model.Usuario;
import com.Vulkania.ev3.vulkanIA.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public UsuarioController(UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    // ----- Público -----

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody RegistroDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.registrar(dto));
        } catch (RuntimeException e) {
            return error(e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            Usuario u = usuarioService.login(dto);
            String token = jwtUtil.generarToken(u.getEmail(), u.getRol());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "id", u.getId(),
                "nombre", u.getNombre(),
                "email", u.getEmail(),
                "rut", u.getRut(),
                "rol", u.getRol()
            ));
        } catch (RuntimeException e) {
            // Credenciales inválidas o cuenta inactiva
            HttpStatus status = e.getMessage() != null && e.getMessage().contains("inactiva")
                    ? HttpStatus.FORBIDDEN : HttpStatus.UNAUTHORIZED;
            return ResponseEntity.status(status).body(Map.of("mensaje", e.getMessage()));
        }
    }

    // ----- Solo ADMIN (ver SecurityConfig) -----

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuario(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody UsuarioAdminDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crearAdmin(dto));
        } catch (RuntimeException e) {
            return error(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioAdminDTO dto) {
        try {
            return ResponseEntity.ok(usuarioService.actualizar(id, dto));
        } catch (RuntimeException e) {
            return error(e);
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> cuerpo) {
        try {
            return ResponseEntity.ok(usuarioService.cambiarEstado(id, cuerpo.get("estado")));
        } catch (RuntimeException e) {
            return error(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado correctamente."));
        } catch (RuntimeException e) {
            return error(e);
        }
    }

    /** IllegalArgument -> 400 (dato inválido), IllegalState -> 409 (regla de negocio), otro -> 404. */
    private ResponseEntity<?> error(RuntimeException e) {
        HttpStatus status = e instanceof IllegalArgumentException ? HttpStatus.BAD_REQUEST
                : e instanceof IllegalStateException ? HttpStatus.CONFLICT
                : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(Map.of("mensaje", e.getMessage()));
    }
}
