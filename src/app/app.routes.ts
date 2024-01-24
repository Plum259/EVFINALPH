import { Routes } from '@angular/router';
import { PublicacionFormComponent } from './publicacion-form/publicacion-form.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'publicacion-form',
    component:PublicacionFormComponent
  }
];
