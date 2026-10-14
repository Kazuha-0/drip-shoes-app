import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private authUrl = 'http://localhost:8080/api/auth';
  private storageKey = 'drip_shoes_products';

  constructor() {}

  // --- LOGIN ---
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('roles', JSON.stringify(response.roles));
        localStorage.setItem('isAdmin', response.roles.includes('ROLE_ADMIN') ? 'true' : 'false');
        localStorage.setItem('currentUser', JSON.stringify({
          id: response.id,
          usuario: response.usuario,
          nombre: response.nombre,
          apellido: response.apellido,
          email: response.email,
          celular: response.celular,
          roles: response.roles
        }));
      })
    );
  }

  // --- REGISTRO ---
  register(datosUsuario: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/register`, datosUsuario);
  }

  // --- ACTUALIZAR PERFIL ---
  actualizarPerfil(id: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.authUrl}/perfil/${id}`, datos).pipe(
      tap(updatedUser => {
        const actual = this.getCurrentUser();
        localStorage.setItem('currentUser', JSON.stringify({
          ...actual,
          ...updatedUser
        }));
      })
    );
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('roles');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  // --- CRUD DE PRODUCTOS EXISTENTE ---
  getProducts() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  addProduct(product: any) {
    const products = this.getProducts();
    product.id = new Date().getTime();
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