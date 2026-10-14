import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  isRegisterMode = false; // Controla si se muestra Sign in o Register

  // Variables para Login
  username = '';
  password = '';
  rememberMe = true;

  // Variables para Registro (columnas de la tabla 'usuarios' en Supabase)
  regData = {
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    usuario: '',
    password: ''
  };

  errorMessage = '';
  successMessage = '';

  constructor(private adminService: AdminService, private router: Router) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {
    this.errorMessage = '';
    this.successMessage = '';

    this.adminService.login(this.username, this.password).subscribe({
      next: (res) => {
        // Si es ROLE_ADMIN va al dashboard; si es ROLE_USUARIO va al inicio del catálogo
        if (res.roles && res.roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.mensaje || 'Credenciales incorrectas';
      }
    });
  }

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    this.adminService.register(this.regData).subscribe({
      next: () => {
        this.successMessage = '¡Cuenta creada con éxito! Ahora puedes iniciar sesión.';
        this.isRegisterMode = false;
        this.username = this.regData.usuario || this.regData.email;
        this.password = '';
        this.regData = { nombre: '', apellido: '', celular: '', email: '', usuario: '', password: '' };
      },
      error: (err) => {
        this.errorMessage = err.error?.mensaje || 'Error al registrar el usuario';
      }
    });
  }
}