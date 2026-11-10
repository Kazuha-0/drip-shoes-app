import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // 1. Tienen que estar importados aquí

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // 2. Y Tienen que estar declarados aquí adentro
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // (o .scss dependiendo de tu proyecto)
})
export class AppComponent {
  title = 'drip-shoes';
}