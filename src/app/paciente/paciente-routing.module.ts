import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { UserRole } from '../core/models/user.model';
import { PacienteDashboardComponent } from './components/dashboard/dashboard.component';
import { HistoriaComponent } from './components/historia/historia.component';
import { MedicamentosComponent } from './components/medicamentos/medicamentos.component';
import { CitasComponent } from './components/citas/citas.component';
import { CrearCitaComponent } from './components/citas/crear-cita.component';
import { EditarCitaComponent } from './components/citas/editar-cita.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PacienteDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.PATIENT }
  },
  {
    path: 'historia',
    component: HistoriaComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.PATIENT }
  },
  {
    path: 'medicamentos',
    component: MedicamentosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.PATIENT }
  },
  {
    path: 'citas',
    component: CitasComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.PATIENT }
  },
  {
    path: 'citas/crear',
    component: CrearCitaComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.PATIENT }
  },
  {
    path: 'citas/editar/:id',
    component: EditarCitaComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.PATIENT }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }

