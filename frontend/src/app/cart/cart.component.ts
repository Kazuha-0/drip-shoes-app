import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// AQUÍ ESTABA EL ERROR: Cambiamos '../../' por '../' para que encuentre la carpeta correcta
import { CartService } from '../services/cart.service'; 

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cartService = inject(CartService);

  // Cálculos financieros
  get subtotal() {
    return this.cartService.getTotal() / 1.18;
  }

  get igv() {
    return this.cartService.getTotal() - this.subtotal;
  }

  // Controles dinámicos
  aumentar(id: number) {
    this.cartService.increaseQuantity(id);
  }

  disminuir(id: number, cantidadActual: number) {
    if (cantidadActual > 1) {
      this.cartService.decreaseQuantity(id);
    } else {
      this.eliminar(id); 
    }
  }

  eliminar(id: number) {
    this.cartService.removeItem(id);
  }

  imprimirBoleta() {
    window.print();
  }
}