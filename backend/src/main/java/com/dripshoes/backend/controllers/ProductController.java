package com.dripshoes.backend.controllers;

import com.dripshoes.backend.models.Product;
import com.dripshoes.backend.services.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200") 
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 1. RUTAS ESPECÍFICAS PRIMERO (Evita confusiones con el {id})
    @GetMapping("/buscar")
    public List<Product> buscarProductos(@RequestParam String termino) {
        return productService.buscarZapatillas(termino);
    }

    @PutMapping("/{id}/toggle")
    public Product toggleVisibilidad(@PathVariable Long id) {
        return productService.obtenerPorId(id).map(producto -> {
            boolean estadoActual = producto.getVisible() != null ? producto.getVisible() : true;
            producto.setVisible(!estadoActual);
            return productService.guardar(producto);
        }).orElseThrow(() -> new RuntimeException("Zapato no encontrado en el sistema"));
    }

    // 2. RUTAS GENERALES DESPUÉS
    @GetMapping
    public List<Product> listarProductos(@RequestParam(required = false) String categoria) {
        if (categoria != null && !categoria.isEmpty()) {
            return productService.obtenerPorCategoria(categoria);
        }
        return productService.obtenerTodos();
    }

    @PostMapping
    public Product crearProducto(@RequestBody Product producto) {
        return productService.guardar(producto);
    }

    @PutMapping("/{id}")
    public Product actualizarProducto(@PathVariable Long id, @RequestBody Product productoActualizado) {
        return productService.obtenerPorId(id).map(producto -> {
            producto.setNombre(productoActualizado.getNombre());
            producto.setMarca(productoActualizado.getMarca());
            producto.setPrecio(productoActualizado.getPrecio());
            producto.setCategoria(productoActualizado.getCategoria());
            producto.setDescripcion(productoActualizado.getDescripcion());
            if(productoActualizado.getImagen() != null) {
                producto.setImagen(productoActualizado.getImagen());
            }
            return productService.guardar(producto);
        }).orElseThrow(() -> new RuntimeException("Zapato no encontrado en el sistema"));
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productService.eliminar(id);
    }
}