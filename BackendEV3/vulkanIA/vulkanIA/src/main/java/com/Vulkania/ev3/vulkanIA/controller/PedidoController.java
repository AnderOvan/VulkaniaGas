package com.Vulkania.ev3.vulkanIA.controller;

import com.Vulkania.ev3.vulkanIA.dto.PedidoDTO;
import com.Vulkania.ev3.vulkanIA.model.Pedido;
import com.Vulkania.ev3.vulkanIA.model.Producto;
import com.Vulkania.ev3.vulkanIA.repository.PedidoRepository;
import com.Vulkania.ev3.vulkanIA.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    public PedidoController(PedidoRepository pedidoRepository, ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos() {
        return ResponseEntity.ok(pedidoRepository.findAll());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> crearPedido(@RequestBody PedidoDTO dto) {
        if (dto.getProductoId() == null || dto.getCantidad() == null || dto.getCantidad() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Producto y cantidad válida son obligatorios."));
        }

        Producto producto = productoRepository.findById(dto.getProductoId()).orElse(null);
        if (producto == null) {
            return ResponseEntity.status(404).body(Map.of("mensaje", "El producto solicitado no existe."));
        }

        // Regla de negocio: Validar stock disponible
        if (producto.getStock() < dto.getCantidad()) {
            return ResponseEntity.badRequest().body(Map.of(
                "mensaje", "Stock insuficiente. Disponible: " + producto.getStock()
            ));
        }

        // Regla de negocio: Descontar stock y guardar producto
        producto.setStock(producto.getStock() - dto.getCantidad());
        productoRepository.save(producto);

        // Registrar pedido en BD
        Pedido pedido = new Pedido();
        pedido.setProductoId(producto.getId());
        pedido.setNombreProducto(producto.getNombre());
        pedido.setCantidad(dto.getCantidad());
        pedido.setTotal(producto.getPrecio() * dto.getCantidad());
        pedido.setClienteEmail(dto.getClienteEmail() != null ? dto.getClienteEmail() : "cliente@vulkania.cl");
        pedido.setDireccionEntrega(dto.getDireccionEntrega() != null ? dto.getDireccionEntrega() : "Retiro en tienda");

        Pedido guardado = pedidoRepository.save(pedido);
        return ResponseEntity.ok(guardado);
    }
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> eliminarPedido(@PathVariable Long id) {
        Pedido pedido = pedidoRepository.findById(id).orElse(null);
        if (pedido == null) {
            return ResponseEntity.status(404).body(Map.of("mensaje", "Pedido no encontrado."));
        }

        // Devolver el stock al producto antes de eliminar el registro
        if (pedido.getProductoId() != null && pedido.getCantidad() != null) {
            productoRepository.findById(pedido.getProductoId()).ifPresent(producto -> {
                producto.setStock(producto.getStock() + pedido.getCantidad());
                productoRepository.save(producto);
            });
        }

        pedidoRepository.delete(pedido);
        return ResponseEntity.ok(Map.of("mensaje", "Pedido eliminado y stock restaurado."));
    }
}