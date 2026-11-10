package com.dripshoes.backend.services;

import com.dripshoes.backend.models.Product;
import com.dripshoes.backend.repositories.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;

    // Dependency Injection mediante el constructor
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> obtenerTodos() {
        return productRepository.findAll();
    }

    public Product guardar(Product producto) {
        return productRepository.save(producto);
    }

    public Optional<Product> obtenerPorId(Long id) {
        return productRepository.findById(id);
    }

    public void eliminar(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> obtenerPorCategoria(String categoria) {
        return productRepository.findVisibleByCategoryJPQL(categoria);
    }

    public List<Product> buscarZapatillas(String termino) {
        return productRepository.buscarPorNombreOMarcaJPQL(termino);
    }

    // --- NUEVO MÉTODO PARA CAMBIAR LA VISIBILIDAD (OCULTAR / MOSTRAR) ---
    public Product toggleVisibilidad(Long id) {
        Product producto = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        
        // Asumiendo que tu atributo de visibilidad es booleano (ej: activo, visible, etc.)
        // Si tu variable se llama diferente (ej: visible), cámbiala aquí:
        producto.setVisible(!producto.getVisible());
        
        return productRepository.save(producto);
    }
}