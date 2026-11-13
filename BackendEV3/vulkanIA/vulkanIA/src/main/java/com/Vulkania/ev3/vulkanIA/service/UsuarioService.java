package com.Vulkania.ev3.vulkanIA.service;

import com.Vulkania.ev3.vulkanIA.dto.LoginDTO;
import com.Vulkania.ev3.vulkanIA.dto.RegistroDTO;
import com.Vulkania.ev3.vulkanIA.model.Usuario;
import com.Vulkania.ev3.vulkanIA.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // POST - Crear usuario
    public Usuario registrar(RegistroDTO dto) {
        if (usuarioRepository.existsByRut(dto.getRut())) {
            throw new RuntimeException("El RUT ya se encuentra registrado.");
        }
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("El correo ya está en uso.");
        }

        Usuario nuevo = new Usuario();
        nuevo.setNombre(dto.getNombre());
        nuevo.setRut(dto.getRut().toUpperCase());
        nuevo.setEmail(dto.getEmail());
        nuevo.setPassword(passwordEncoder.encode(dto.getPassword()));

        return usuarioRepository.save(nuevo);
    }

    // POST - Login
    public Usuario login(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta.");
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

    // PUT - Actualizar usuario
    public Usuario actualizar(Long id, RegistroDTO dto) {
        Usuario existente = obtenerPorId(id);
        existente.setNombre(dto.getNombre());
        existente.setRut(dto.getRut().toUpperCase());
        existente.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existente.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return usuarioRepository.save(existente);
    }

    // DELETE - Eliminar usuario
    public void eliminar(Long id) {
        Usuario existente = obtenerPorId(id);
        usuarioRepository.delete(existente);
    }
}