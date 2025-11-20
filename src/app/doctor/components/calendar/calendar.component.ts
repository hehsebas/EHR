import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, TranslatePipe],
  template: `
    <div class="max-w-7xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-gray-100">{{ 'doctor.calendar' | translate }}</h1>
        <button 
          class="flex items-center gap-2 px-6 py-3 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-colors" 
          [routerLink]="['/doctor/calendario/nueva']">
          <span class="material-icons text-base">add</span>
          {{ 'doctor.newAppointment' | translate }}
        </button>
      </div>
      <div class="flex flex-col gap-6">
        <app-card [title]="'doctor.weeklyView' | translate">
          <div class="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto">
            <div *ngFor="let day of weekDays" class="min-w-[150px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div class="bg-primary dark:bg-primary-light text-white p-3 text-center">
                <div class="font-medium text-sm">{{ day.name }}</div>
                <div class="text-xs opacity-90">{{ day.date | date:'d/M' }}</div>
              </div>
              <div class="p-2 min-h-[200px]">
                <div
                  class="bg-gray-50 dark:bg-gray-800 border-l-4 p-2 mb-2 rounded text-xs"
                  *ngFor="let appointment of getAppointmentsForDay(day.date)"
                  [ngClass]="{
                    'border-green-500': appointment.status === 'confirmada',
                    'border-orange-500': appointment.status === 'pendiente',
                    'border-red-500': appointment.status === 'cancelada',
                    'border-primary': appointment.status === 'completada'
                  }">
                  <div class="font-medium text-gray-900 dark:text-gray-100 mb-1">{{ appointment.time }}</div>
                  <div class="text-gray-600 dark:text-gray-400 mb-0.5">{{ appointment.patientName }}</div>
                  <div class="text-gray-500 dark:text-gray-500 text-[10px]">{{ appointment.reason }}</div>
                </div>
                <div class="text-center text-gray-500 dark:text-gray-400 text-xs py-4" *ngIf="getAppointmentsForDay(day.date).length === 0">
                  {{ 'doctor.noAppointments' | translate }}
                </div>
              </div>
            </div>
          </div>
        </app-card>
        <app-card [title]="'doctor.appointmentList' | translate">
          <div class="flex flex-col gap-4">
            <div 
              *ngFor="let appointment of appointments" 
              class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 md:flex-row flex-col md:items-center items-start gap-3">
              <div class="flex-1 flex flex-col gap-2">
                <div class="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-sm">
                  <span class="material-icons text-lg text-gray-600 dark:text-gray-400">event</span>
                  {{ appointment.date | date:'short' }} - {{ appointment.time }}
                </div>
                <div class="flex items-center gap-2 text-gray-900 dark:text-gray-100 text-sm">
                  <span class="material-icons text-lg text-gray-600 dark:text-gray-400">person</span>
                  {{ appointment.patientName }}
                </div>
                <div class="text-gray-600 dark:text-gray-400 text-xs">
                  {{ appointment.reason }}
                </div>
              </div>
              <div class="flex items-center gap-3 md:flex-row flex-col md:items-center items-start">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap"
                  [ngClass]="{
                    'bg-green-500 text-white': appointment.status === 'confirmada',
                    'bg-orange-500 text-white': appointment.status === 'pendiente',
                    'bg-red-500 text-white': appointment.status === 'cancelada',
                    'bg-gray-500 text-white': appointment.status === 'completada'
                  }">
                  {{ getStatusTranslation(appointment.status) }}
                </span>
                <button 
                  class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-90 mr-2" 
                  [routerLink]="['/doctor/calendario', appointment.id, 'editar']"
                  *ngIf="appointment.status !== 'completada'">
                  {{ 'common.edit' | translate }}
                </button>
                <button 
                  class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-90" 
                  (click)="deleteAppointment(appointment)"
                  *ngIf="appointment.status !== 'completada'">
                  {{ 'common.delete' | translate }}
                </button>
                <button 
                  class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-90" 
                  (click)="updateAppointmentStatus(appointment, 'cancelada')" 
                  *ngIf="appointment.status === 'confirmada'">
                  {{ 'status.cancelled' | translate }}
                </button>
              </div>
            </div>
            <div class="text-center py-12 text-gray-600 dark:text-gray-400" *ngIf="appointments.length === 0">
              {{ 'doctor.noAppointments' | translate }}
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class CalendarComponent implements OnInit {
  appointments: Appointment[] = [];
  weekDays: { name: string; date: Date }[] = [];

  constructor(
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.initializeWeek();
    this.loadAppointments();
  }

  initializeWeek(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        name: dayNames[date.getDay()],
        date: date
      });
    }
  }

  loadAppointments(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.appointmentsService.getAppointmentsByDoctor(currentUser.id).subscribe(appointments => {
      this.appointments = appointments.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
  }

  getAppointmentsForDay(date: Date): Appointment[] {
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === date.toDateString();
    });
  }

  updateAppointmentStatus(appointment: Appointment, status: Appointment['status']): void {
    this.appointmentsService.updateAppointmentStatus(appointment.id, status).subscribe(() => {
      appointment.status = status;
      this.loadAppointments();
    });
  }

  deleteAppointment(appointment: Appointment): void {
    const message = this.translationService.translate('message.confirmDeleteAppointment');
    if (confirm(message)) {
      this.appointmentsService.deleteAppointment(appointment.id).subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: () => {
          alert(this.translationService.translate('message.errorDelete'));
        }
      });
    }
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
