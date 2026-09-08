package com.dripshoes.backend;

import com.dripshoes.backend.models.Product;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    @Test
    void testCrearZapato() {
        Product zapato = new Product();
        zapato.setNombre("Air Max");
        zapato.setMarca("Nike");
        zapato.setPrecio(120.50);
        zapato.setCategoria("Caballeros");
        zapato.setImagen("https://link-a-imagen.com/zapato.jpg");

        assertNotNull(zapato.getNombre());
        assertEquals("Caballeros", zapato.getCategoria());
    }
}