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

import java.util.*;
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

    // --- 1. LOGIN ---
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

                if (roles.isEmpty() && ("admin123".equalsIgnoreCase(usuario.getUsuario()) || "admin@dripshoes.com".equalsIgnoreCase(usuario.getEmail()))) {
                    roles = List.of("ROLE_ADMIN");
                }

                String subject = usuario.getUsuario() != null ? usuario.getUsuario() : usuario.getEmail();
                String token = jwtUtil.generarToken(subject, roles);

                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("token", token);
                respuesta.put("id", usuario.getId());
                respuesta.put("usuario", usuario.getUsuario() != null ? usuario.getUsuario() : "");
                respuesta.put("nombre", usuario.getNombre() != null ? usuario.getNombre() : "");
                respuesta.put("apellido", usuario.getApellido() != null ? usuario.getApellido() : "");
                respuesta.put("email", usuario.getEmail() != null ? usuario.getEmail() : "");
                respuesta.put("celular", usuario.getCelular() != null ? usuario.getCelular() : "");
                respuesta.put("roles", roles);

                return ResponseEntity.ok(respuesta);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensaje", "Usuario o contraseña incorrectos"));
    }

    // --- 2. REGISTRO ---
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Map<String, String> datos) {
        String username = datos.get("usuario");
        String email = datos.get("email");

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
        nuevoUsuario.setPassword(passwordEncoder.encode(datos.get("password")));
        nuevoUsuario.setActivo(true);

        Rol rolUsuario = rolRepository.findByNombre("ROLE_USUARIO")
                .orElseThrow(() -> new RuntimeException("Error: ROLE_USUARIO no encontrado"));
        nuevoUsuario.setRoles(Set.of(rolUsuario));

        usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Usuario registrado exitosamente"));
    }

    // --- 3. ACTUALIZAR PERFIL EN SUPABASE ---
    @PutMapping("/perfil/{id}")
    public ResponseEntity<?> actualizarPerfil(@PathVariable String id, @RequestBody Map<String, Object> datos) {
        Optional<Usuario> userOpt = Optional.empty();

        // 1. Intentar buscar por ID numérico
        try {
            if (id != null && !id.equals("undefined") && !id.equals("0")) {
                userOpt = usuarioRepository.findById(Long.parseLong(id));
            }
        } catch (NumberFormatException ignored) {}

        // 2. Si no tenía ID en caché, buscar por usuario o email
        if (userOpt.isEmpty()) {
            String username = (String) datos.get("usuario");
            String email = (String) datos.get("email");
            userOpt = usuarioRepository.findByUsuarioOrEmail(username, email);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Usuario no encontrado. Cierra sesión y vuelve a ingresar."));
        }

        Usuario usuario = userOpt.get();
        usuario.setNombre((String) datos.get("nombre"));
        usuario.setApellido((String) datos.get("apellido"));
        usuario.setCelular((String) datos.get("celular"));
        usuario.setEmail((String) datos.get("email"));
        usuario.setUsuario((String) datos.get("usuario"));

        String nuevaPassword = (String) datos.get("password");
        if (nuevaPassword != null && !nuevaPassword.trim().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        }

        usuarioRepository.save(usuario);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("id", usuario.getId());
        respuesta.put("usuario", usuario.getUsuario() != null ? usuario.getUsuario() : "");
        respuesta.put("nombre", usuario.getNombre() != null ? usuario.getNombre() : "");
        respuesta.put("apellido", usuario.getApellido() != null ? usuario.getApellido() : "");
        respuesta.put("email", usuario.getEmail() != null ? usuario.getEmail() : "");
        respuesta.put("celular", usuario.getCelular() != null ? usuario.getCelular() : "");

        return ResponseEntity.ok(respuesta);
    }
}