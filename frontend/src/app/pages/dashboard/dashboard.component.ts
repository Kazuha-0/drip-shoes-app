import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // === ¡IMPORTANTE! Reemplaza esto con tus datos reales de Supabase ===
  private supabaseUrl = 'https://qnzbrdnujtfysngmtlqf.supabase.co'; 
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuemJyZG51anRmeXNuZ210bHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3ODgxODQsImV4cCI6MjEwNDM2NDE4NH0.vB1-fY3KXctqVb8uGTN0v1gnYNBQfAUZCAN7i7ezffE'; // <--- ¡PEGA TU CLAVE AQUÍ!
  private supabase: SupabaseClient;

  isLoggedIn = false;
  loginUser = ''; 
  loginPass = '';
  loginError = '';

  products: any[] = [];
  currentProduct: any = { id: null, marca: '', nombre: '', precio: 0, categoria: '', descripcion: '', imagen: '', visible: true };
  isEditing = false;
  totalProducts = 0;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

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

  async loadProducts() {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      alert('Error al cargar productos: ' + error.message);
      return;
    }

    if (data) {
      this.products = data;
      this.totalProducts = this.products.length;
    }
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

  async saveProduct() {
    if (!this.currentProduct.nombre || !this.currentProduct.categoria) {
      alert('Por favor, llena al menos el nombre y la categoría.');
      return;
    }

    let resultError = null;

    if (this.isEditing) {
      const { error } = await this.supabase
        .from('productos')
        .update({ 
          marca: this.currentProduct.marca,
          nombre: this.currentProduct.nombre, 
          precio: this.currentProduct.precio, 
          categoria: this.currentProduct.categoria,
          descripcion: this.currentProduct.descripcion,
          imagen: this.currentProduct.imagen,
          visible: this.currentProduct.visible
        })
        .eq('id', this.currentProduct.id);
      resultError = error;
    } else {
      const { error } = await this.supabase
        .from('productos')
        .insert([{ 
          marca: this.currentProduct.marca,
          nombre: this.currentProduct.nombre, 
          precio: this.currentProduct.precio, 
          categoria: this.currentProduct.categoria,
          descripcion: this.currentProduct.descripcion,
          imagen: this.currentProduct.imagen,
          visible: true
        }]);
      resultError = error;
    }
    
    if (resultError) {
      alert('HUBO UN ERROR EN LA BASE DE DATOS:\n' + resultError.message);
      console.error(resultError);
    } else {
      alert('¡Zapatilla guardada con éxito en Supabase!');
      this.resetForm();
      await this.loadProducts();
    }
  }

  editProduct(product: any) {
    this.currentProduct = { ...product };
    this.isEditing = true;
  }

  async deleteProduct(id: number) {
    if (confirm('¿Eliminar zapatilla de Supabase?')) {
      const { error } = await this.supabase.from('productos').delete().eq('id', id);
      if (error) {
        alert('Error al eliminar: ' + error.message);
      } else {
        await this.loadProducts();
      }
    }
  }

  // Lógica para Ocultar / Mostrar
  async toggleVisibility(producto: any) {
    const nuevoEstado = producto.visible === false ? true : false; 

    const { error } = await this.supabase
      .from('productos')
      .update({ visible: nuevoEstado })
      .eq('id', producto.id);

    if (error) {
      alert('Error al cambiar la visibilidad: ' + error.message);
    } else {
      await this.loadProducts(); 
    }
  }

  resetForm() {
    this.currentProduct = { id: null, marca: '', nombre: '', precio: 0, categoria: '', descripcion: '', imagen: '', visible: true };
    this.isEditing = false;
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }
}