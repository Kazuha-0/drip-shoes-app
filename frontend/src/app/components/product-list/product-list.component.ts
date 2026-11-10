import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  // @Input: Recibe la lista de zapatillas desde el componente Padre (Dashboard)
  @Input() productos: Product[] = [];

  // @Output: Emite eventos hacia el componente Padre cuando se hace clic en los botones
  @Output() editar = new EventEmitter<Product>();
  @Output() borrar = new EventEmitter<any>();
  @Output() cambiarEstado = new EventEmitter<Product>();
}