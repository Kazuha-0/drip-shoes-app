import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink], // Esto "enciende" los botones routerLink del HTML
  templateUrl: './navbar.component.html'
})
export class NavbarComponent { }