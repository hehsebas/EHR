import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment } from '../../../core/models/appointment.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-paciente-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, TranslatePipe],
  template: `
    <div class="max-w-7xl">
      <h1 class="text-3xl font-medium mb-6 text-gray-900 dark:text-gray-100">{{ 'patient.dashboard' | translate }}</h1>
      <p class="text-md text-gray-600 dark:text-gray-100 mb-6 "> {{ 'patient.welcome' | translate }} {{ currentUser?.name }}.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <a routerLink="/paciente/citas">
          <app-card [clickable]="true">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <span class="material-icons text-3xl">event</span>
              </div>
              <div class="flex-1">
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1" *ngIf="nextAppointment; else noAppointment">
                  {{ nextAppointment.date | date:'shortDate' }}
                </div>
                <ng-template #noAppointment>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">-</div>
                </ng-template>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'patient.nextAppointment' | translate }}</div>
              </div>
            </div>
          </app-card>
        </a>
        <app-card>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-green-500 flex items-center justify-center text-white">
              <span class="material-icons text-3xl">history</span>
            </div>
            <div class="flex-1">
              <div class="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1" *ngIf="lastConsultation; else noConsultation">
                {{ lastConsultation.date | date:'shortDate' }}
              </div>
              <ng-template #noConsultation>
                <div class="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">-</div>
              </ng-template>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'patient.lastConsultation' | translate }}</div>
            </div>
          </div>
        </app-card>
        <app-card>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-orange-500 flex items-center justify-center text-white">
              <span class="material-icons text-3xl">medication</span>
            </div>
            <div class="flex-1">
              <div class="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{{ treatmentAdherence }}%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'patient.treatmentAdherence' | translate }}</div>
            </div>
          </div>
        </app-card>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-card [title]="'patient.nextAppointment' | translate" *ngIf="nextAppointment">
          <div class="flex flex-col gap-4">
            <div class="flex items-start gap-3">
              <span class="material-icons text-primary dark:text-primary-light mt-1">event</span>
              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">{{ 'patient.dateTime' | translate }}</div>
                <div class="text-sm text-gray-900 dark:text-gray-100">
                  {{ nextAppointment.date | date:'longDate' }} a las {{ nextAppointment.time }}
                </div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="material-icons text-primary dark:text-primary-light mt-1">person</span>
              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">{{ 'patient.doctor' | translate }}</div>
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ nextAppointment.doctorName }}</div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <span class="material-icons text-primary dark:text-primary-light mt-1">description</span>
              <div>
                <div class="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">{{ 'form.reason' | translate }}</div>
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ nextAppointment.reason }}</div>
              </div>
            </div>
            <div>
              <span 
                class="px-3 py-1.5 rounded-full text-xs font-medium capitalize inline-block text-gray-100 dark:text-gray-100"
                [ngClass]="{
                  'bg-green-500 text-white': nextAppointment.status === 'confirmada',
                  'bg-orange-500 text-white': nextAppointment.status === 'pendiente',
                  'bg-red-500 text-white': nextAppointment.status === 'cancelada',
                  'bg-gray-500 text-white': nextAppointment.status === 'completada'
                }">
                {{ getStatusTranslation(nextAppointment.status) }}
              </span>
            </div>
          </div>
        </app-card>
        <app-card [title]="'patient.quickAccess' | translate">
          <div class="flex flex-col gap-3">
            <a routerLink="/paciente/citas/crear">
                <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg no-underline text-gray-900 dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-primary hover:border-2 duration-300">
                  <span class="material-icons text-primary dark:text-primary-light">event</span>
                  <span>{{ 'patient.createAppointment' | translate }}</span>
                </div>
            </a>
            <a 
              routerLink="/paciente/historia" 
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg no-underline text-gray-900 dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-primary hover:border-2 duration-300">
              <span class="material-icons text-primary dark:text-primary-light">history</span>
              <span>{{ 'patient.clinicalHistory' | translate }}</span>
            </a>
            <a 
              routerLink="/paciente/medicamentos" 
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg no-underline text-gray-900 dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-primary hover:border-2 duration-300">
              <span class="material-icons text-primary dark:text-primary-light">medication</span>
              <span>{{ 'patient.medications' | translate }}</span>
            </a>
            <a 
              routerLink="/paciente/citas" 
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg no-underline text-gray-900 dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-primary hover:border-2 duration-300">
              <span class="material-icons text-primary dark:text-primary-light">event</span>
              <span>{{ 'patient.appointments' | translate }}</span>
            </a>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class PacienteDashboardComponent implements OnInit {
  currentUser: User | null = null;
  nextAppointment: Appointment | undefined;
  lastConsultation: Appointment | undefined;
  treatmentAdherence = 85;

  constructor(
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    this.currentUser = currentUser;
    this.appointmentsService.getAppointmentsByPatient(currentUser.id).subscribe(appointments => {
      const future = appointments
        .filter(a => new Date(a.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.nextAppointment = future[0];

      const past = appointments
        .filter(a => new Date(a.date) < new Date())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.lastConsultation = past[0];
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
