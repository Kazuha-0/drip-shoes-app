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
  username = '';
  password = '';
  errorMessage = '';

  constructor(private adminService: AdminService, private router: Router) {}

  onLogin() {
    if (this.adminService.login(this.username, this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Credenciales incorrectas';
    }
  }
}