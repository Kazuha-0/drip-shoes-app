import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main style="min-height: 80vh;">
      <router-outlet></router-outlet> <!-- Aquí carga Inicio o Catálogo -->
    </main>
    <app-footer></app-footer>
  `
})
export class AppComponent {}