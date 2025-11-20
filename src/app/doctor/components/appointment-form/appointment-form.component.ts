import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { PatientsService } from '../../../core/services/patients.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { Patient } from '../../../core/models/patient.model';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardComponent, TranslatePipe],
  template: `
    <div class="p-6">
      <div class="flex items-center mb-6">
        <button 
          class="flex items-center gap-2 text-primary-DEFAULT hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-DEFAULT transition-colors" 
          (click)="goBack()">
          <span class="material-icons text-lg">arrow_back</span>
          <span>{{ 'common.back' | translate }}</span>
        </button>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-gray-100 ml-4">
          {{ isEditMode ? ('doctor.editAppointment' | translate) : ('doctor.newAppointment' | translate) }}
        </h1>
      </div>

      <app-card>
        <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="patientId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'form.patient' | translate }} *
              </label>
              <select
                id="patientId"
                formControlName="patientId"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                [class.border-red-500]="isFieldInvalid('patientId')"
              >
                <option value="">{{ 'form.selectPatient' | translate }}</option>
                <option *ngFor="let patient of patients" [value]="patient.id">
                  {{ patient.name }} - {{ patient.document }}
                </option>
              </select>
              <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('patientId')">
                {{ getFieldError('patientId') }}
              </span>
            </div>

            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'form.date' | translate }} *
              </label>
              <input
                id="date"
                type="date"
                formControlName="date"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                [class.border-red-500]="isFieldInvalid('date')"
              />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('date')">
                {{ getFieldError('date') }}
              </span>
            </div>

            <div>
              <label for="time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'form.time' | translate }} *
              </label>
              <input
                id="time"
                type="time"
                formControlName="time"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                [class.border-red-500]="isFieldInvalid('time')"
              />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('time')">
                {{ getFieldError('time') }}
              </span>
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'form.status' | translate }} *
              </label>
              <select
                id="status"
                formControlName="status"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="pendiente">{{ 'status.pending' | translate }}</option>
                <option value="confirmada">{{ 'status.confirmed' | translate }}</option>
                <option value="cancelada">{{ 'status.cancelled' | translate }}</option>
                <option value="completada">{{ 'status.completed' | translate }}</option>
              </select>
            </div>

            <div class="md:col-span-2">
              <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'form.reason' | translate }} *
              </label>
              <textarea
                id="reason"
                formControlName="reason"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                [class.border-red-500]="isFieldInvalid('reason')"
              ></textarea>
              <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('reason')">
                {{ getFieldError('reason') }}
              </span>
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              class="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              (click)="goBack()">
              {{ 'common.cancel' | translate }}
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              [disabled]="appointmentForm.invalid || loading">
              <span *ngIf="!loading">{{ isEditMode ? ('form.updateAppointment' | translate) : ('form.createAppointment' | translate) }}</span>
              <span *ngIf="loading">{{ 'form.saving' | translate }}</span>
            </button>
          </div>

          <div class="text-red-500 text-sm text-center" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: []
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  appointmentId: string | null = null;
  loading = false;
  errorMessage = '';
  patients: Patient[] = [];

  constructor(
    private fb: FormBuilder,
    private appointmentsService: AppointmentsService,
    private patientsService: PatientsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translationService: TranslationService
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      status: ['pendiente', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.appointmentId = this.route.snapshot.paramMap.get('id');
    if (this.appointmentId) {
      this.isEditMode = true;
      this.loadAppointment();
    }
  }

  loadAppointment(): void {
    if (!this.appointmentId) return;
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.appointmentsService.getAppointmentsByDoctor(currentUser.id).subscribe({
      next: (appointments) => {
        const appointment = appointments.find(a => a.id === this.appointmentId);
        if (appointment) {
          const dateStr = new Date(appointment.date).toISOString().split('T')[0];
          this.appointmentForm.patchValue({
            patientId: appointment.patientId,
            date: dateStr,
            time: appointment.time,
            status: appointment.status,
            reason: appointment.reason
          });
        }
      },
      error: () => {
        this.errorMessage = this.translationService.translate('message.errorLoad');
      }
    });
  }

  loadPatients(): void {
    this.patientsService.getPatients().subscribe(patients => {
      this.patients = patients.filter(p => p.status === 'activo');
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const currentUser = this.authService.getCurrentUser();
    const formValue = this.appointmentForm.value;
    const selectedPatient = this.patients.find(p => p.id === formValue.patientId);

    const appointmentData = {
      patientId: formValue.patientId,
      patientName: selectedPatient?.name || '',
      doctorId: currentUser?.id || '1',
      doctorName: currentUser?.name || 'Dr. Sin asignar',
      date: new Date(formValue.date),
      time: formValue.time,
      status: formValue.status,
      reason: formValue.reason
    };

    if (this.isEditMode && this.appointmentId) {
      this.appointmentsService.updateAppointment(this.appointmentId, appointmentData).subscribe({
        next: () => {
          this.router.navigate(['/doctor/calendario']);
        },
        error: (error) => {
          this.errorMessage = error.message || this.translationService.translate('message.errorUpdate');
          this.loading = false;
        }
      });
    } else {
      this.appointmentsService.createAppointment(appointmentData).subscribe({
        next: () => {
          this.router.navigate(['/doctor/calendario']);
        },
        error: (error) => {
          this.errorMessage = error.message || this.translationService.translate('message.errorCreate');
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/doctor/calendario']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.appointmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.appointmentForm.get(fieldName);
    if (field?.hasError('required')) {
      return this.translationService.translate('form.required');
    }
    if (field?.hasError('minlength')) {
      return this.translationService.translate('form.minLength', { min: '5' });
    }
    return '';
  }
}
