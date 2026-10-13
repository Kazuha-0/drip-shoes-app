import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private storageKey = 'drip_shoes_products';

  constructor() {
    // Inicializar con datos de prueba si está vacío
    if (!localStorage.getItem(this.storageKey)) {
      const initialProducts = [
        { id: 1, name: 'Nike Air Force 1', price: 120, stock: 15 },
        { id: 2, name: 'Adidas Forum Low', price: 100, stock: 8 }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(initialProducts));
    }
  }

  // --- LOGIN MOCK ---
  login(user: string, pass: string): boolean {
    if (user === 'admin' && pass === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('isAdmin');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  // --- CRUD DE PRODUCTOS ---
  getProducts() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  addProduct(product: any) {
    const products = this.getProducts();
    product.id = new Date().getTime(); // Generar ID único simulado
    products.push(product);
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  updateProduct(updatedProduct: any) {
    let products = this.getProducts();
    const index = products.findIndex((p: any) => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      localStorage.setItem(this.storageKey, JSON.stringify(products));
    }
  }

  deleteProduct(id: number) {
    let products = this.getProducts();
    products = products.filter((p: any) => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }
}