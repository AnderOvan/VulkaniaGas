package com.Vulkania.ev3.vulkanIA.repository;

import com.Vulkania.ev3.vulkanIA.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}