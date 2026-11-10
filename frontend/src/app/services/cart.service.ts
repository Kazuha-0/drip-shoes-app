import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: any[] = [];

  addToCart(producto: any) {
    let itemExistente = this.items.find(item => item.producto.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.items.push({ producto: producto, cantidad: 1 });
    }
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  }

  clearCart() {
    this.items = [];
  }

  // --- LAS 3 FUNCIONES NUEVAS QUE EL COMPILADOR ESTÁ BUSCANDO ---
  
  increaseQuantity(productoId: number) {
    const item = this.items.find(i => i.producto.id === productoId);
    if (item) item.cantidad++;
  }

  decreaseQuantity(productoId: number) {
    const item = this.items.find(i => i.producto.id === productoId);
    if (item && item.cantidad > 1) {
      item.cantidad--;
    }
  }

  removeItem(productoId: number) {
    this.items = this.items.filter(item => item.producto.id !== productoId);
  }
}