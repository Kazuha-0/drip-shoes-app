import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Product {
  id?: number;
  nombre: string;
  marca: string;
  precio: number;
  descripcion?: string;
  categoria?: string;
  imagen?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/productos';

  getProductos() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  crearProducto(producto: Product) {
    return this.http.post<Product>(this.apiUrl, producto);
  }
}