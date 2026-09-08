import { Component, OnInit, inject } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit {
  
  // 1. Inyección del servicio de conexión con Spring Boot
  private productService = inject(ProductService);
  
  // 2. Arreglo vacío que la cuadrícula HTML llenará con las fotos y datos
  productos: Product[] = [];

  // 3. Método del ciclo de vida de Angular que se ejecuta apenas carga la página
  ngOnInit() {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    // Llama al método GET del servicio y se suscribe a la respuesta de Spring Boot
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.productos = data; // Guarda los datos de Supabase en la variable local
      },
      error: (err) => {
        console.error('Error al cargar el catálogo:', err);
      }
    });
  }
}