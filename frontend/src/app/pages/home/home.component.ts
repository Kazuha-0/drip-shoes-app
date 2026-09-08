import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule], // <-- 2. Añádelo a los imports
  templateUrl: './home.component.html',
  styles: [`

    .carousel-container {
      position: relative;
      width: 100%;
      height: calc(100vh - 80px); /* Ocupa el 100% de la pantalla menos el Navbar */
      min-height: 500px;
      overflow: hidden;
      background-color: #000;
    }
    .carousel-slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: 0;
      transition: opacity 1.5s ease-in-out;
    }
    .carousel-slide.active {
      opacity: 1;
    }
    .carousel-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      text-align: center;
      z-index: 10;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  productos: Product[] = [];

  // Lógica del Carrusel
  slides: string[] = [
    'assets/img_inicio/slide1.jpg',
    'assets/img_inicio/slide2.jpg',
    'assets/img_inicio/slide3.jpg',
    'assets/img_inicio/slide4.jpg'
  ];
  currentSlide = 0;
  slideInterval: any;

  ngOnInit() {
    this.productService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar BD:', err)
    });

    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 4000);
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}