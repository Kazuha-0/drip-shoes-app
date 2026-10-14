package com.dripshoes.backend.repositories;

import com.dripshoes.backend.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Permite buscar tanto por el campo 'usuario' (ej. admin123) como por 'email'
    Optional<Usuario> findByUsuarioOrEmail(String usuario, String email);
}