package com.dripshoes.backend.controllers;

import com.dripshoes.backend.models.Product;
import com.dripshoes.backend.services.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // Habilita la conexión futura con la web en Angular
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Método GET: Lee y devuelve la lista completa de zapatos
    @GetMapping
public List<Product> listarProductos(@RequestParam(required = false) String categoria) {
    if (categoria != null && !categoria.isEmpty()) {
        return productService.obtenerPorCategoria(categoria);
    }
    return productService.obtenerTodos();
}

    // Método POST: Recibe un JSON y crea un nuevo zapato en Supabase
    @PostMapping
    public Product crearProducto(@RequestBody Product producto) {
        return productService.guardar(producto);
    }

    // Método PUT: Actualiza el precio o marca de un zapato existente por su ID
    @PutMapping("/{id}")
    public Product actualizarProducto(@PathVariable Long id, @RequestBody Product productoActualizado) {
        return productService.obtenerPorId(id).map(producto -> {
            producto.setNombre(productoActualizado.getNombre());
            producto.setMarca(productoActualizado.getMarca());
            producto.setPrecio(productoActualizado.getPrecio());
            return productService.guardar(producto);
        }).orElseThrow(() -> new RuntimeException("Zapato no encontrado en el sistema"));
    }

    // Método DELETE: Elimina un zapato del inventario
    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productService.eliminar(id);
    }
}