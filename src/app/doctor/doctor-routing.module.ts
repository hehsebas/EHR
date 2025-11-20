import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { UserRole } from '../core/models/user.model';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsListComponent } from './components/patients-list/patients-list.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.DOCTOR }
  },
  {
    path: 'pacientes',
    component: PatientsListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.DOCTOR }
  },
  {
    path: 'pacientes/nuevo',
    component: PatientFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.DOCTOR }
  },
  {
    path: 'pacientes/:id',
    component: PatientDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.DOCTOR }
  },
  {
    path: 'pacientes/:id/editar',
    component: PatientFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.DOCTOR }
  },
  {
    path: 'calendario',
    component: CalendarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.DOCTOR }
  },
  {
    path: 'calendario/nueva',
    component: AppointmentFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.DOCTOR }
  },
  {
    path: 'calendario/:id/editar',
    component: AppointmentFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.DOCTOR }
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
export class DoctorRoutingModule { }

