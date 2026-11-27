package com.Vulkania.ev3.vulkanIA.repository;

import com.Vulkania.ev3.vulkanIA.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}