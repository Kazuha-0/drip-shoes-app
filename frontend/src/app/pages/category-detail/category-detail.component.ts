import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // <-- 1. Importar CommonModule
import { Product } from '../../services/product.service';

interface CategoryInfo {
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule], // <-- 2. Añadirlo a la lista de imports
  templateUrl: './category-detail.component.html'
})
export class CategoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

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
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al filtrar productos:', err)
    });
  }
}