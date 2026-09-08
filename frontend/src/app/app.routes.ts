import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { CategoryDetailComponent } from './pages/category-detail/category-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categoria/:tipo', component: CategoryDetailComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];