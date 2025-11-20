import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { PatientsService } from '../../../core/services/patients.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, TranslatePipe],
  template: `
    <div class="max-w-7xl">
      <h1 class="text-3xl font-medium mb-6 text-gray-900 dark:text-gray-100">{{ 'doctor.dashboard' | translate }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <app-card>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <span class="material-icons text-3xl">people</span>
            </div>
            <div class="flex-1">
              <div class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{{ activePatients }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'doctor.activePatients' | translate }}</div>
            </div>
          </div>
        </app-card>
        <app-card>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-green-500 flex items-center justify-center text-white">
              <span class="material-icons text-3xl">event</span>
            </div>
            <div class="flex-1">
              <div class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{{ todayAppointments.length }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'doctor.todayAppointments' | translate }}</div>
            </div>
          </div>
        </app-card>
        <app-card>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-orange-500 flex items-center justify-center text-white">
              <span class="material-icons text-3xl">medical_services</span>
            </div>
            <div class="flex-1">
              <div class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{{ monthlyProcedures }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'doctor.monthlyProcedures' | translate }}</div>
            </div>
          </div>
        </app-card>
        <app-card>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-purple-500 flex items-center justify-center text-white">
              <span class="material-icons text-3xl">trending_up</span>
            </div>
            <div class="flex-1">
              <div class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{{ attendanceRate }}%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'doctor.attendanceRate' | translate }}</div>
            </div>
          </div>
        </app-card>
      </div>
      <app-card [title]="'doctor.upcomingAppointments' | translate">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.patient' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.date' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.time' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.reason' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.status' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.actions' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let appointment of upcomingAppointments" class="border-b border-gray-200 dark:border-gray-700">
                <td class="px-3 py-3 text-gray-700 dark:text-gray-300">{{ appointment.patientName }}</td>
                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ appointment.date | date:'shortDate' }}</td>
                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ appointment.time }}</td>
                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ appointment.reason }}</td>
                <td class="px-3 py-3">
                  <span 
                    class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                    [ngClass]="{
                      'bg-green-500 text-white': appointment.status === 'confirmada',
                      'bg-orange-500 text-white': appointment.status === 'pendiente',
                      'bg-red-500 text-white': appointment.status === 'cancelada',
                      'bg-gray-500 text-white': appointment.status === 'completada'
                    }">
                    {{ getStatusTranslation(appointment.status) }}
                  </span>
                </td>
                <td class="px-3 py-3">
                  <button 
                    class="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-90" 
                    [routerLink]="['/doctor/pacientes', appointment.patientId]">
                    {{ 'common.view' | translate }}
                  </button>
                </td>
              </tr>
              <tr *ngIf="upcomingAppointments.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-600 dark:text-gray-400">{{ 'doctor.noAppointments' | translate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  activePatients = 0;
  todayAppointments: Appointment[] = [];
  monthlyProcedures = 28;
  attendanceRate = 87.5;
  upcomingAppointments: Appointment[] = [];

  constructor(
    private appointmentsService: AppointmentsService,
    private patientsService: PatientsService,
    private authService: AuthService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.patientsService.getPatients().subscribe(patients => {
      this.activePatients = patients.filter(p => p.status === 'activo').length;
    });

    this.appointmentsService.getTodayAppointments(currentUser.id).subscribe(appointments => {
      this.todayAppointments = appointments;
    });

    this.appointmentsService.getAppointmentsByDoctor(currentUser.id).subscribe(appointments => {
      this.upcomingAppointments = appointments
        .filter(a => new Date(a.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 10);
    });
  }

  getStatusTranslation(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pendiente': 'status.pending',
      'confirmada': 'status.confirmed',
      'cancelada': 'status.cancelled',
      'completada': 'status.completed'
    };
    return this.translationService.translate(statusMap[status] || status);
  }
}
