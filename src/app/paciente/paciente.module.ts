import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteRoutingModule } from './paciente-routing.module';
import { PacienteDashboardComponent } from './components/dashboard/dashboard.component';
import { HistoriaComponent } from './components/historia/historia.component';
import { MedicamentosComponent } from './components/medicamentos/medicamentos.component';
import { CitasComponent } from './components/citas/citas.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    PacienteDashboardComponent,
    HistoriaComponent,
    MedicamentosComponent,
    CitasComponent
  ]
})
export class PacienteModule { }

