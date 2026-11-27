package com.Vulkania.ev3.vulkanIA.config;

import com.Vulkania.ev3.vulkanIA.model.Producto;
import com.Vulkania.ev3.vulkanIA.model.Usuario;
import com.Vulkania.ev3.vulkanIA.repository.ProductoRepository;
import com.Vulkania.ev3.vulkanIA.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductoRepository productoRepository,
                                   UsuarioRepository usuarioRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            if (!usuarioRepository.existsByEmail("admin@vulkania.cl")) {
                Usuario admin = new Usuario();
                admin.setNombre("Administrador Vulkania");
                admin.setRut("111111111");
                admin.setEmail("admin@vulkania.cl");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRol("ADMIN");
                usuarioRepository.save(admin);
            }

            if (productoRepository.count() == 0) {
                Producto p1 = new Producto();
                p1.setNombre("Cilindro Gas Licuado 5kg");
                p1.setCategoria("Cilindros");
                p1.setPeso("5 kg");
                p1.setPrecio(11990);
                p1.setStock(25);
                p1.setDestacado(false);
                p1.setDescripcion("Ideal para estufas portátiles y camping.");
                p1.setImagen("/img/gas-5kg.png");

                Producto p2 = new Producto();
                p2.setNombre("Cilindro Gas Licuado 11kg");
                p2.setCategoria("Cilindros");
                p2.setPeso("11 kg");
                p2.setPrecio(19990);
                p2.setStock(40);
                p2.setDestacado(true);
                p2.setDescripcion("Formato estándar para cocina y calefón.");
                p2.setImagen("/img/gas-11kg.png");

                Producto p3 = new Producto();
                p3.setNombre("Cilindro Gas Licuado 15kg");
                p3.setCategoria("Cilindros");
                p3.setPeso("15 kg");
                p3.setPrecio(24990);
                p3.setStock(30);
                p3.setDestacado(true);
                p3.setDescripcion("Mayor rendimiento para hogares.");
                p3.setImagen("/img/gas-15kg.png");

                Producto p4 = new Producto();
                p4.setNombre("Cilindro Gas Licuado 45kg");
                p4.setCategoria("Cilindros");
                p4.setPeso("45 kg");
                p4.setPrecio(68990);
                p4.setStock(8);
                p4.setDestacado(false);
                p4.setDescripcion("Uso industrial y comercial de alta demanda.");
                p4.setImagen("/img/gas-45kg.png");

                productoRepository.save(p1);
                productoRepository.save(p2);
                productoRepository.save(p3);
                productoRepository.save(p4);
            }
        };
    }
}