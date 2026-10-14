import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="perfil-wrapper">
      <div class="perfil-card">
        <h2 class="title">Mi Perfil</h2>
        <p class="subtitle">Actualiza tu información personal registrada</p>

        <form (ngSubmit)="guardarCambios()">
          <div class="row-2">
            <div class="input-box">
              <label>Nombre</label>
              <input type="text" name="nombre" [(ngModel)]="userData.nombre" required>
            </div>
            <div class="input-box">
              <label>Apellido</label>
              <input type="text" name="apellido" [(ngModel)]="userData.apellido" required>
            </div>
          </div>

          <div class="input-box">
            <label>Nombre de Usuario</label>
            <input type="text" name="usuario" [(ngModel)]="userData.usuario" required>
          </div>

          <div class="input-box">
            <label>Correo Electrónico</label>
            <input type="email" name="email" [(ngModel)]="userData.email" required>
          </div>

          <div class="input-box">
            <label>Celular</label>
            <input type="text" name="celular" [(ngModel)]="userData.celular" required>
          </div>

          <div class="input-box">
            <label>Nueva Contraseña (déjalo en blanco para mantener la actual)</label>
            <input type="password" name="password" [(ngModel)]="userData.password" placeholder="••••••••">
          </div>

          <p class="msg-ok" *ngIf="mensajeExito">{{ mensajeExito }}</p>
          <p class="msg-err" *ngIf="mensajeError">{{ mensajeError }}</p>

          <button type="submit" class="btn-save">Guardar Cambios</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .perfil-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 80px);
      padding: 2rem;
      background: linear-gradient(135deg, #0033cc 0%, #2580ff 50%, #70b5ff 100%);
      font-family: 'Segoe UI', Roboto, sans-serif;
    }
    .perfil-card {
      background: #fff;
      padding: 2.5rem;
      border-radius: 24px;
      box-shadow: 0 20px 45px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 480px;
    }
    .title { color: #1e88e5; font-size: 2rem; margin: 0 0 0.3rem 0; }
    .subtitle { color: #99a3ad; font-size: 0.92rem; margin-bottom: 1.8rem; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .input-box { margin-bottom: 1rem; }
    .input-box label { display: block; font-size: 0.82rem; color: #666; margin-bottom: 5px; padding-left: 10px; }
    .input-box input {
      width: 100%;
      padding: 0.75rem 1.1rem;
      border: 1.5px solid #dcdfe6;
      border-radius: 50px;
      font-size: 0.95rem;
      outline: none;
      box-sizing: border-box;
    }
    .input-box input:focus { border-color: #1e88e5; }
    .btn-save {
      width: 100%;
      padding: 0.95rem;
      border: none;
      border-radius: 50px;
      background: linear-gradient(90deg, #157efb 0%, #2089ff 100%);
      color: #fff;
      font-size: 1.05rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 0.5rem;
      box-shadow: 0 8px 20px rgba(21, 126, 251, 0.35);
    }
    .msg-ok { color: #2e7d32; text-align: center; font-size: 0.9rem; }
    .msg-err { color: #e53935; text-align: center; font-size: 0.9rem; }
  `]
})
export class PerfilComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  userData = {
    id: 0,
    nombre: '',
    apellido: '',
    usuario: '',
    email: '',
    celular: '',
    password: ''
  };

  mensajeExito = '';
  mensajeError = '';

  ngOnInit() {
    const current = this.adminService.getCurrentUser();
    if (!current) {
      this.router.navigate(['/login']);
      return;
    }
    this.userData = { ...current, password: '' };
  }

  guardarCambios() {
    this.mensajeExito = '';
    this.mensajeError = '';
    this.adminService.actualizarPerfil(this.userData.id, this.userData).subscribe({
      next: () => {
        this.mensajeExito = '¡Tus datos se actualizaron correctamente en la base de datos!';
        this.userData.password = '';
      },
      error: () => {
        this.mensajeError = 'Ocurrió un error al actualizar tu perfil.';
      }
    });
  }
}