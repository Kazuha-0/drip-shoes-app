import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/productos';

  isLoggedIn = false;
  loginUser = ''; 
  loginPass = '';
  loginError = '';

  products: Product[] = [];
  currentProduct: Product = { id: 0, marca: '', nombre: '', precio: 0, categoria: '', descripcion: '', imagen: '', visible: true };
  isEditing = false;
  totalProducts = 0;

  // Variable para capturar lo que el usuario escribe en el buscador
  terminoBusqueda: string = '';

  ngOnInit() {
    if (localStorage.getItem('adminLogueado') === 'true') {
      this.isLoggedIn = true;
      this.loadProducts();
    }
  }

  onLogin() {
    if (this.loginUser === 'admin123' && this.loginPass === 'admin159') {
      this.isLoggedIn = true;
      localStorage.setItem('adminLogueado', 'true');
      this.loginError = '';
      this.loadProducts();
    } else {
      this.loginError = 'Usuario o contraseña incorrectos';
    }
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('adminLogueado');
    this.loginUser = '';
    this.loginPass = '';
  }

  loadProducts() {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.products = data;
        this.totalProducts = this.products.length;
      },
      error: (err) => alert('Error al cargar productos: ' + err.message)
    });
  }

  // ¡AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA!
  buscarProducto() {
    if (!this.terminoBusqueda.trim()) {
      this.loadProducts(); // Si el buscador está vacío, recarga toda la lista
      return;
    }
    this.http.get<Product[]>(`${this.apiUrl}/buscar?termino=${this.terminoBusqueda}`).subscribe({
      next: (data) => {
        this.products = data;
        this.totalProducts = this.products.length;
      },
      error: (err) => alert('Error en la búsqueda: ' + err.message)
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentProduct.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProduct() {
    if (!this.currentProduct.nombre || !this.currentProduct.categoria) {
      alert('Por favor, llena al menos el nombre y la categoría.');
      return;
    }

    if (this.isEditing) {
      this.http.put<Product>(`${this.apiUrl}/${this.currentProduct.id}`, this.currentProduct).subscribe({
        next: () => {
          alert('¡Zapatilla actualizada con éxito!');
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => alert('Error al actualizar: ' + err.message)
      });
    } else {
      this.http.post<Product>(this.apiUrl, this.currentProduct).subscribe({
        next: () => {
          alert('¡Zapatilla guardada con éxito!');
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => alert('Error al guardar: ' + err.message)
      });
    }
  }

  editProduct(product: Product) {
    this.currentProduct = { ...product };
    this.isEditing = true;
  }

  deleteProduct(id: any) {
    if (confirm('¿Eliminar zapatilla?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert('Error al eliminar: ' + err.message)
      });
    }
  }

  toggleVisibility(producto: Product) {
    this.http.put<Product>(`${this.apiUrl}/${producto.id}/toggle`, {}).subscribe({
      next: () => this.loadProducts(),
      error: (err) => alert('Error al cambiar la visibilidad: ' + err.message)
    });
  }

  resetForm() {
    this.currentProduct = { id: 0, marca: '', nombre: '', precio: 0, categoria: '', descripcion: '', imagen: '', visible: true };
    this.isEditing = false;
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }
}