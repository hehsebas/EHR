import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'doctor',
    loadChildren: () => import('./doctor/doctor.module').then(m => m.DoctorModule),
    canActivate: [AuthGuard],
    component: LayoutComponent
  },
  {
    path: 'paciente',
    loadChildren: () => import('./paciente/paciente.module').then(m => m.PacienteModule),
    canActivate: [AuthGuard],
    component: LayoutComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    component: LayoutComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

