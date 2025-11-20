import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    AdminDashboardComponent,
    UsersComponent
  ]
})
export class AdminModule { }

