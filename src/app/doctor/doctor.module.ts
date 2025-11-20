import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorRoutingModule } from './doctor-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsListComponent } from './components/patients-list/patients-list.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { CalendarComponent } from './components/calendar/calendar.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    DoctorRoutingModule,
    DashboardComponent,
    PatientsListComponent,
    PatientDetailComponent,
    CalendarComponent
  ]
})
export class DoctorModule { }

