import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { Product } from '../../services/product.service';

// 1. AGREGADO: Importamos tu servicio de carrito global
import { CartService } from '../../services/cart.service';

interface CategoryInfo {
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './category-detail.component.html'
})
export class CategoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  
  // 2. AGREGADO: Inyectamos el servicio global para poder usarlo
  private cartService = inject(CartService);

  categoria: string = '';
  productos: Product[] = [];

  infoCategorias: Record<string, CategoryInfo> = {
    caballeros: {
      titulo: 'Calzado para Caballeros',
      descripcion: 'Descubre nuestra exclusiva colección masculina. Desde calzado formal en cuero genuino hasta sneakers urbanos de última tendencia, diseñados para acompañarte con estilo en cada ocasión.'
    },
    damas: {
      titulo: 'Calzado para Damas',
      descripcion: 'Explora lo último en elegancia y confort femenino. Diseños vanguardistas pensados para adaptarse a tu ritmo diario sin sacrificar sofisticación ni comodidad.'
    },
    infantil: {
      titulo: 'Calzado Infantil',
      descripcion: 'Durabilidad, flexibilidad y soporte para los pequeños aventureros del hogar. Modelos anatómicos y resistentes creados para acompañar su crecimiento y energía.'
    }
  };

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const param = params.get('tipo') || 'caballeros';
      this.categoria = param.toLowerCase();
      this.cargarProductos(param);
    });
  }

  cargarProductos(tipo: string) {
    this.http.get<Product[]>(`http://localhost:8080/api/productos?categoria=${tipo}`).subscribe({
      // AQUÍ ESTÁ EL FILTRO: Solo guardamos los productos que NO tengan visible en false
      next: (data) => this.productos = data.filter((producto: any) => producto.visible !== false),
      error: (err) => console.error('Error al filtrar productos:', err)
    });
  }
  
  carrito: any[] = []; 

  agregarAlCarrito(producto: any) {
    // 3. AGREGADO: Enviamos el producto a la memoria global para que la boleta lo pueda recibir
    this.cartService.addToCart(producto);

    // Mantuve tu lógica local exactamente igual por si la necesitas para otra cosa
    let itemExistente = this.carrito.find(item => item.producto.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.carrito.push({ producto: producto, cantidad: 1 });
    }
    
    alert(`¡${producto.nombre} agregado al carrito! Da clic en el ícono superior para ver tu compra.`);
  }
}