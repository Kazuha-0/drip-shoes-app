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

    // Método GET: Lee y devuelve la lista completa de zapatos
    @GetMapping
    public List<Product> listarProductos(@RequestParam(required = false) String categoria) {
        if (categoria != null && !categoria.isEmpty()) {
            return productService.obtenerPorCategoria(categoria);
        }
        return productService.obtenerTodos();
    }

    // Método POST: Recibe un JSON y crea un nuevo zapato
    @PostMapping
    public Product crearProducto(@RequestBody Product producto) {
        return productService.guardar(producto);
    }

    // Método PUT: Actualiza el producto entero por su ID
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

    // ¡AQUÍ ESTÁ LA RUTA QUE FALTABA PARA OCULTAR (TOGGLE)!
    @PutMapping("/{id}/toggle")
    public Product toggleVisibilidad(@PathVariable Long id) {
        return productService.obtenerPorId(id).map(producto -> {
            // Si es null por alguna razón, asumimos que era true. Luego lo invertimos.
            boolean estadoActual = producto.getVisible() != null ? producto.getVisible() : true;
            producto.setVisible(!estadoActual);
            return productService.guardar(producto);
        }).orElseThrow(() -> new RuntimeException("Zapato no encontrado en el sistema"));
    }

    // Método DELETE: Elimina un zapato del inventario
    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productService.eliminar(id);
    }
// Método GET para la barra de búsqueda
    @GetMapping("/buscar")
    public List<Product> buscarProductos(@RequestParam String termino) {
        return productService.buscarZapatillas(termino);
    }

}