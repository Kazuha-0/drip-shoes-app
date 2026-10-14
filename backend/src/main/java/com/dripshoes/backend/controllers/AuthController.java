package com.dripshoes.backend.controllers;

import com.dripshoes.backend.models.Rol;
import com.dripshoes.backend.models.Usuario;
import com.dripshoes.backend.repositories.RolRepository;
import com.dripshoes.backend.repositories.UsuarioRepository;
import com.dripshoes.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepository, RolRepository rolRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // --- INICIAR SESIÓN ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String userOrEmail = credenciales.get("username");
        String password = credenciales.get("password");

        Optional<Usuario> userOpt = usuarioRepository.findByUsuarioOrEmail(userOrEmail, userOrEmail);

        if (userOpt.isPresent()) {
            Usuario usuario = userOpt.get();
            String dbPassword = usuario.getPassword();

            boolean passwordValida = dbPassword.startsWith("$2a$") 
                    ? passwordEncoder.matches(password, dbPassword) 
                    : dbPassword.equals(password);

            if (passwordValida && Boolean.TRUE.equals(usuario.getActivo())) {
                List<String> roles = usuario.getRoles().stream()
                        .map(Rol::getNombre)
                        .collect(Collectors.toList());

                String subject = usuario.getUsuario() != null ? usuario.getUsuario() : usuario.getEmail();
                String token = jwtUtil.generarToken(subject, roles);

                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "usuario", subject,
                    "roles", roles
                ));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensaje", "Usuario o contraseña incorrectos"));
    }

    // --- REGISTRAR NUEVO USUARIO EN SUPABASE ---
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Map<String, String> datos) {
        String username = datos.get("usuario");
        String email = datos.get("email");

        // Verificar que no exista el usuario o correo en Supabase
        if (usuarioRepository.findByUsuarioOrEmail(username, email).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("mensaje", "El usuario o correo electrónico ya está registrado"));
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(datos.get("nombre"));
        nuevoUsuario.setApellido(datos.get("apellido"));
        nuevoUsuario.setCelular(datos.get("celular"));
        nuevoUsuario.setEmail(email);
        nuevoUsuario.setUsuario(username);
        // Encriptamos la contraseña con BCrypt ($2a$10$...) igual que en la BD compartida
        nuevoUsuario.setPassword(passwordEncoder.encode(datos.get("password")));
        nuevoUsuario.setActivo(true);

        // Asignar ROLE_USUARIO por defecto en la tabla usuario_rol
        Rol rolUsuario = rolRepository.findByNombre("ROLE_USUARIO")
                .orElseThrow(() -> new RuntimeException("Error: ROLE_USUARIO no encontrado en la tabla roles"));
        nuevoUsuario.setRoles(Set.of(rolUsuario));

        usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Usuario registrado exitosamente en la base de datos"));
    }
}