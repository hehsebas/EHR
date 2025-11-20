import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, TranslatePipe],
  template: `
    <div class="max-w-5xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-medium text-gray-900 dark:text-gray-100">{{ 'patient.appointments' | translate }}</h1>
        <a
          routerLink="/paciente/citas/crear"
          class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-opacity hover:opacity-90">
          <span class="material-icons text-lg">add</span>
          <span>{{ 'patient.createAppointment' | translate }}</span>
        </a>
      </div>
      <app-card [title]="'patient.appointments' | translate">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">
                  {{ 'form.date' | translate }} / {{ 'form.time' | translate }}
                </th>
                <th class="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">
                  {{ 'patient.doctor' | translate }}
                </th>
                <th class="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">
                  {{ 'form.reason' | translate }}
                </th>
                <th class="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">
                  {{ 'form.status' | translate }}
                </th>
                <th class="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">
                  {{ 'doctor.actions' | translate }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let appointment of appointments" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  <div class="text-sm font-medium">{{ appointment.date | date:'shortDate' }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">{{ appointment.time }}</div>
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  <div class="text-sm">{{ appointment.doctorName }}</div>
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  <div class="text-sm max-w-xs truncate" [title]="appointment.reason">{{ appointment.reason }}</div>
                </td>
                <td class="px-4 py-3">
                  <span 
                    class="px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap inline-block text-gray-100"
                    [ngClass]="{
                      'bg-green-500 text-white': appointment.status === 'confirmada',
                      'bg-orange-500 text-white': appointment.status === 'pendiente',
                      'bg-red-500 text-white': appointment.status === 'cancelada',
                      'bg-gray-500 text-white': appointment.status === 'completada'
                    }">
                    {{ getStatusTranslation(appointment.status) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <button
                      *ngIf="appointment.status !== 'completada'"
                      [routerLink]="['/paciente/citas/editar', appointment.id]"
                      class="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-90 flex items-center gap-1">
                      <span class="material-icons text-sm">edit</span>
                      <span>{{ 'common.edit' | translate }}</span>
                    </button>
                    <button
                      class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-90 flex items-center gap-1"
                      (click)="requestCancellation(appointment)"
                      *ngIf="appointment.status !== 'cancelada' && appointment.status !== 'completada' && isFutureAppointment(appointment)">
                      <span class="material-icons text-sm">cancel</span>
                      <span>{{ 'patient.cancelAppointment' | translate }}</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="appointments.length === 0">
                <td colspan="5" class="text-center py-12 text-gray-600 dark:text-gray-400">
                  <span class="material-icons text-6xl text-gray-400 dark:text-gray-500 mb-4 block">event_busy</span>
                  <p class="text-base">{{ 'patient.noAppointments' | translate }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
    </div>
  `,
  styles: []
})
export class CitasComponent implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  private routerSubscription?: Subscription;

  constructor(
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    private translationService: TranslationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url === '/paciente/citas') {
          this.loadAppointments();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadAppointments(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.appointmentsService.getAppointmentsByPatient(currentUser.id).subscribe(appointments => {
      this.appointments = appointments.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
  }

  isFutureAppointment(appointment: Appointment): boolean {
    try {
      let appointmentDate: Date;
      if (appointment.date instanceof Date) {
        appointmentDate = new Date(appointment.date);
      } else if (typeof appointment.date === 'string') {
        appointmentDate = new Date(appointment.date);
      } else {
        appointmentDate = new Date(appointment.date);
      }

      if (isNaN(appointmentDate.getTime())) {
        console.warn('Invalid appointment date:', appointment.date, appointment);
        return false;
      }
      
      const timeParts = appointment.time.split(':');
      if (timeParts.length !== 2) {
        console.warn('Invalid appointment time format:', appointment.time, appointment);
        return false;
      }
      
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        console.warn('Invalid hours or minutes:', appointment.time, appointment);
        return false;
      }
      
      const fullDate = new Date(appointmentDate);
      fullDate.setHours(hours, minutes, 0, 0);
      
      const now = new Date();
      now.setSeconds(0, 0);
      
      const isFuture = fullDate.getTime() > now.getTime();
      
      console.log('Checking appointment:', {
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        fullDate: fullDate.toLocaleString('es-ES'),
        now: now.toLocaleString('es-ES'),
        isFuture: isFuture,
        status: appointment.status
      });
      
      return isFuture;
    } catch (error) {
      console.error('Error checking future appointment:', error, appointment);
      return false;
    }
  }

  requestCancellation(appointment: Appointment): void {
    const message = this.translationService.translate('message.confirmDeleteAppointment');
    if (confirm(message)) {
      this.appointmentsService.updateAppointmentStatus(appointment.id, 'cancelada').subscribe(() => {
        this.loadAppointments();
        alert(this.translationService.translate('patient.requestCancellation'));
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
