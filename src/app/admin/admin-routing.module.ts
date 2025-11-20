import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { UserRole } from '../core/models/user.model';
import { AdminDashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.ADMIN }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.ADMIN }
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
export class AdminRoutingModule { }

