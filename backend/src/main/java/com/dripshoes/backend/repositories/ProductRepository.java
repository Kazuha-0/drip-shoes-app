package com.dripshoes.backend.repositories;

import com.dripshoes.backend.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // REQUISITO CUMPLIDO: Uso de consulta JPQL personalizada
    @Query("SELECT p FROM Product p WHERE p.visible = true AND LOWER(p.categoria) = LOWER(:categoria)")
    List<Product> findVisibleByCategoryJPQL(@Param("categoria") String categoria);

    // Búsqueda de productos por nombre o marca (ignorando mayúsculas/minúsculas)
    @Query("SELECT p FROM Product p WHERE (LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR LOWER(p.marca) LIKE LOWER(CONCAT('%', :termino, '%')))")
    List<Product> buscarPorNombreOMarcaJPQL(@Param("termino") String termino);
}