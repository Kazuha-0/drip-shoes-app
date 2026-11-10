import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { CategoryDetailComponent } from './pages/category-detail/category-detail.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

// 1. IMPORTACIÓN DEL CARRITO (Asegúrate de que la ruta coincida con donde está tu carpeta cart)
import { CartComponent } from './cart/cart.component'; 

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categoria/:tipo', component: CategoryDetailComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: AdminLoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'dashboard', component: DashboardComponent },
  
  // 2. AQUÍ ESTÁ LA NUEVA RUTA (Debe ir obligatoriamente ANTES de la regla '**')
  { path: 'carrito', component: CartComponent },
  
  { path: '**', redirectTo: '', pathMatch: 'full' },
];