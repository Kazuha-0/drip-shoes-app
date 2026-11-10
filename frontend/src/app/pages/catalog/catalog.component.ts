import { Component, OnInit, inject } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);

  productos: Product[] = [];
  
  // 1. Aquí guardaremos lo que el cliente agregue
  carrito: any[] = []; 

  ngOnInit() {
    this.cargarCatalogo();
  }

  cargarCatalogo() {
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.productos = data.filter((producto: any) => producto.visible !== false);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  // 2. Función para agregar al carrito
  agregarAlCarrito(producto: Product) {
    let itemExistente = this.carrito.find(item => item.producto.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad++; // Si ya está, suma 1
    } else {
      this.carrito.push({ producto: producto, cantidad: 1 }); // Si no, lo agrega
    }
    alert(`¡${producto.nombre} agregado al carrito!`);
  }

  // 3. Función para calcular el pago total
  calcularTotal() {
    return this.carrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  }

  // 4. Función para simular la compra e imprimir
  imprimirBoleta() {
    window.print(); // Abre la ventana de impresión del navegador
    this.carrito = []; // Vacía el carrito después de la "compra"
    alert('¡Compra simulada con éxito! Gracias por tu preferencia.');
  }
}