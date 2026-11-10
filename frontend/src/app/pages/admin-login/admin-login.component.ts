import { Component, OnInit } from '@angular/core'; // 1. Importa OnInit
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
export class AdminLoginComponent implements OnInit { // 2. Implementa OnInit
  isRegisterMode = false;

  username = '';
  password = '';
  rememberMe = true;

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

  // 3. Agrega esto: Si ya hay sesión activa, redirige al dashboard de inmediato
  ngOnInit() {
    if (this.adminService.isLoggedIn() && this.adminService.isAdmin()) {
      this.router.navigate(['/dashboard']);
    }
  }

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