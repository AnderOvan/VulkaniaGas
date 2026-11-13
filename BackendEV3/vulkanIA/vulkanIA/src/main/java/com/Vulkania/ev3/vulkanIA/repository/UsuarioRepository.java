package com.Vulkania.ev3.vulkanIA.repository;

import com.Vulkania.ev3.vulkanIA.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByRut(String rut);
    boolean existsByEmail(String email);
    Optional<Usuario> findByEmail(String email);
}