import { Component, OnInit, inject } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);
  productos: Product[] = [];
  nuevoZapato: Product = { nombre: '', marca: '', precio: 0 };

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar datos:', err)
    });
  }

  agregarZapato() {
    this.productService.crearProducto(this.nuevoZapato).subscribe(() => {
      this.cargarProductos();
      this.nuevoZapato = { nombre: '', marca: '', precio: 0 };
    });
  }
}