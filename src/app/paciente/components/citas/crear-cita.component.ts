import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { Appointment } from '../../../core/models/appointment.model';
import { MEDICAL_SPECIALTIES } from '../../../core/constants/specialties.constants';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, FloatLabelType } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-crear-cita',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CardComponent, 
    TranslatePipe, 
    MatDatepickerModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="max-w-4xl mx-auto p-4">
      <div class="mb-6">
        <button
          (click)="goBack()"
          class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 transition-colors">
          <span class="material-icons text-xl">arrow_back</span>
          <span>{{ 'common.back' | translate }}</span>
        </button>
        <h1 class="text-3xl font-medium text-gray-900 dark:text-gray-100">{{ 'patient.editAppointment' | translate }}</h1>
      </div>

      <app-card>
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Selección de Especialista -->
                <mat-form-field appearance="outline" [floatLabel]="floatLabel()" [hideRequiredMarker]="hideRequired()" class="w-full">
                  <mat-label>{{ 'patient.selectDoctor' | translate }}</mat-label>
                  <mat-select
                    [(ngModel)]="selectedDoctorId"
                    (ngModelChange)="onDoctorChange()"
                    name="doctor"
                    required>
                    <mat-option *ngFor="let doctor of doctors" [value]="doctor.id">
                      {{ doctor.name }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="!selectedDoctorId && submitted">
                    {{ 'form.required' | translate }}
                  </mat-error>
                </mat-form-field>
                <!-- Calendario para seleccionar fecha -->
                <mat-form-field appearance="outline" [floatLabel]="floatLabel()" [hideRequiredMarker]="hideRequired()" (click)="picker.open()" class="w-full">
                <mat-label>{{ 'form.date' | translate }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  [(ngModel)]="selectedDate"
                  (ngModelChange)="onDateChange()"
                  [min]="minDate"
                  name="date"
                  required>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="!selectedDate && submitted">
                    {{ 'form.required' | translate }}
                  </mat-error>
                </mat-form-field>
                <!-- Motivo de la consulta -->
                <mat-form-field appearance="outline" [floatLabel]="floatLabel()" [hideRequiredMarker]="hideRequired()" class="w-full">
                  <mat-label>{{ 'form.reason' | translate }}</mat-label>
                    <mat-select
                      [(ngModel)]="reason"
                      name="reason"
                      required>
                    <mat-option *ngFor="let specialty of specialties" [value]="specialty">
                      {{ specialty }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="!reason && submitted">
                    {{ 'form.required' | translate }}
                  </mat-error>
                </mat-form-field>
              </div>
              <!-- Selector de hora -->
              <div *ngIf="selectedDoctorId && selectedDate" class="mt-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ 'form.time' | translate }} <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-4 md:grid-cols-5 gap-2 mb-1">
              <button matButton="outlined"
              mat-stroked-button
              *ngFor="let slot of availableTimeSlots"
              type="button"
              (click)="selectedTime = slot"
              [color]="selectedTime === slot ? 'primary' : ''"
              [class.mat-primary]="selectedTime === slot"
              class="min-w-0">
              {{ slot }}
            </button>
            </div>
            <p *ngIf="!selectedTime && submitted" class="text-red-500 text-xs mt-1 mb-1">
            {{ 'form.required' | translate }}
            </p>
            <p *ngIf="availableTimeSlots.length === 0" class="text-orange-500 text-sm mt-1">
              {{ 'patient.noAvailableSlots' | translate }}
            </p>
          </div>


          <!-- Botones de acción -->
          <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              mat-button
              type="button"
              (click)="goBack()">
              {{ 'common.cancel' | translate }}
            </button>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="loading || !selectedDoctorId || !selectedDate || !selectedTime || !reason">
              <mat-icon *ngIf="loading" class="animate-spin">refresh</mat-icon>
              <span *ngIf="!loading">{{ 'form.createAppointment' | translate }}</span>
              <span *ngIf="loading">{{ 'form.saving' | translate }}</span>
            </button>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: [`
    
  `]
})
export class CrearCitaComponent implements OnInit {
  doctors: User[] = [];
  selectedDoctorId: string | null = null;
  selectedDate: string | null = null;
  selectedTime: string = '';
  reason: string | null = null;
  availableTimeSlots: string[] = [];
  loading = false;
  submitted = false;
  minDate: string = '';
  specialties = MEDICAL_SPECIALTIES;

  constructor(
    private appointmentsService: AppointmentsService,
    private usersService: UsersService,
    private authService: AuthService,
    private translationService: TranslationService,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.usersService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
    });
  }

  onDoctorChange(): void {
    this.selectedTime = '';
    if (this.selectedDoctorId && this.selectedDate) {
      this.loadAvailableTimeSlots();
    }
  }

  onDateChange(): void {
    this.selectedTime = '';
    if (this.selectedDoctorId && this.selectedDate) {
      this.loadAvailableTimeSlots();
    }
  }

  loadAvailableTimeSlots(): void {
    if (!this.selectedDoctorId || !this.selectedDate) return;
    
    const date = new Date(this.selectedDate);
    this.appointmentsService.getAvailableTimeSlots(this.selectedDoctorId, date).subscribe(slots => {
      this.availableTimeSlots = slots;
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.selectedDoctorId || !this.selectedDate || !this.selectedTime || !this.reason) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert(this.translationService.translate('message.error'));
      return;
    }

    const selectedDoctor = this.doctors.find(d => d.id === this.selectedDoctorId);
    if (!selectedDoctor) {
      alert(this.translationService.translate('message.error'));
      return;
    }

    const date = new Date(this.selectedDate);
    this.appointmentsService.isTimeSlotAvailable(this.selectedDoctorId, date, this.selectedTime).subscribe(isAvailable => {
      if (!isAvailable) {
        alert(this.translationService.translate('patient.timeSlotNotAvailable'));
        this.loadAvailableTimeSlots();
        return;
      }

      this.loading = true;

      const newAppointment: Omit<Appointment, 'id'> = {
        patientId: currentUser.id,
        patientName: currentUser.name,
        doctorId: this.selectedDoctorId!,
        doctorName: selectedDoctor.name,
        date: date,
        time: this.selectedTime,
        status: 'pendiente',
        reason: this.reason!
      };

      this.appointmentsService.createAppointment(newAppointment).subscribe({
        next: () => {
          alert(this.translationService.translate('message.saveSuccess'));
          this.router.navigate(['/paciente/citas']);
        },
        error: () => {
          alert(this.translationService.translate('message.errorCreate'));
          this.loading = false;
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/paciente/citas']);
  }

  floatLabel(): FloatLabelType {
    return 'auto';
  }

  hideRequired(): boolean {
    return false;
  }
}

