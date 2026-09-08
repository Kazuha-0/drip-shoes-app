package com.dripshoes.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "productos")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String marca;
    private Double precio;

    // Nuevos campos solicitados
    private String descripcion;
    private String categoria; // "Caballeros", "Damas" o "Infantil"
    private String imagen;    // URL de la imagen del producto
}