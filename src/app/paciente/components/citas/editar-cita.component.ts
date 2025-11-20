import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { Appointment } from '../../../core/models/appointment.model';
import { MEDICAL_SPECIALTIES } from '../../../core/constants/specialties.constants';

@Component({
  selector: 'app-editar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, TranslatePipe],
  template: `
    <div class="max-w-4xl">
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
        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Selección de Especialista -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ 'patient.selectDoctor' | translate }} <span class="text-red-500">*</span>
            </label>
            <select
              [(ngModel)]="selectedDoctorId"
              (ngModelChange)="onDoctorChange()"
              name="doctor"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="">{{ 'patient.selectDoctor' | translate }}</option>
              <option *ngFor="let doctor of doctors" [value]="doctor.id">
                {{ doctor.name }}
              </option>
            </select>
            <p *ngIf="!selectedDoctorId && submitted" class="mt-1 text-sm text-red-500">
              {{ 'form.required' | translate }}
            </p>
          </div>

          <!-- Calendario para seleccionar fecha -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ 'form.date' | translate }} <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              [(ngModel)]="selectedDate"
              (ngModelChange)="onDateChange()"
              name="date"
              [min]="minDate"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent">
            <p *ngIf="!selectedDate && submitted" class="mt-1 text-sm text-red-500">
              {{ 'form.required' | translate }}
            </p>
          </div>

          <!-- Selector de hora -->
          <div *ngIf="selectedDoctorId && selectedDate">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ 'form.time' | translate }} <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-4 md:grid-cols-5 gap-3">
              <button
                *ngFor="let slot of availableTimeSlots"
                type="button"
                (click)="selectedTime = slot"
                [class.bg-primary]="selectedTime === slot"
                [class.text-white]="selectedTime === slot"
                [class.bg-gray-100]="selectedTime !== slot"
                [class.dark:bg-gray-700]="selectedTime !== slot"
                [class.dark:text-gray-100]="selectedTime !== slot"
                [class.text-gray-900]="selectedTime !== slot"
                class="px-4 py-2.5 rounded-lg font-medium transition-colors hover:opacity-90 border border-gray-300 dark:border-gray-600">
                {{ slot }}
              </button>
            </div>
            <p *ngIf="availableTimeSlots.length === 0" class="mt-2 text-sm text-orange-500">
              {{ 'patient.noAvailableSlots' | translate }}
            </p>
            <p *ngIf="!selectedTime && submitted" class="mt-1 text-sm text-red-500">
              {{ 'form.required' | translate }}
            </p>
          </div>

          <!-- Estado de la cita -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ 'form.status' | translate }} <span class="text-red-500">*</span>
            </label>
            <select
              [(ngModel)]="status"
              name="status"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="pendiente">{{ 'status.pending' | translate }}</option>
              <option value="confirmada">{{ 'status.confirmed' | translate }}</option>
              <option value="cancelada">{{ 'status.cancelled' | translate }}</option>
              <option value="completada">{{ 'status.completed' | translate }}</option>
            </select>
          </div>

          <!-- Motivo de la consulta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ 'form.reason' | translate }} <span class="text-red-500">*</span>
            </label>
            <select
              [(ngModel)]="reason"
              name="reason"
              required
              class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="">{{ 'form.selectReason' | translate }}</option>
              <option *ngFor="let specialty of specialties" [value]="specialty">
                {{ specialty }}
              </option>
            </select>
            <p *ngIf="!reason && submitted" class="mt-1 text-sm text-red-500">
              {{ 'form.required' | translate }}
            </p>
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              [disabled]="loading"
              class="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!loading">{{ 'form.updateAppointment' | translate }}</span>
              <span *ngIf="loading">{{ 'form.saving' | translate }}</span>
            </button>
            <button
              type="button"
              (click)="goBack()"
              class="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors">
              {{ 'common.cancel' | translate }}
            </button>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: []
})
export class EditarCitaComponent implements OnInit {
  doctors: User[] = [];
  selectedDoctorId: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  reason: string = '';
  status: Appointment['status'] = 'pendiente';
  availableTimeSlots: string[] = [];
  loading = false;
  submitted = false;
  minDate: string = '';
  appointmentId: string | null = null;
  originalAppointment: Appointment | null = null;
  specialties = MEDICAL_SPECIALTIES;

  constructor(
    private appointmentsService: AppointmentsService,
    private usersService: UsersService,
    private authService: AuthService,
    private translationService: TranslationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('id');
    if (!this.appointmentId) {
      this.router.navigate(['/paciente/citas']);
      return;
    }
    
    this.loadDoctors();
    this.loadAppointment();
  }

  loadDoctors(): void {
    this.usersService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
    });
  }

  loadAppointment(): void {
    if (!this.appointmentId) return;
    
    this.appointmentsService.getAppointmentById(this.appointmentId).subscribe(appointment => {
      if (!appointment) {
        alert(this.translationService.translate('message.errorLoad'));
        this.router.navigate(['/paciente/citas']);
        return;
      }

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser || appointment.patientId !== currentUser.id) {
        alert(this.translationService.translate('message.error'));
        this.router.navigate(['/paciente/citas']);
        return;
      }

      this.originalAppointment = appointment;
      this.selectedDoctorId = appointment.doctorId;
      this.selectedDate = new Date(appointment.date).toISOString().split('T')[0];
      this.selectedTime = appointment.time;
      this.reason = appointment.reason;
      this.status = appointment.status;

      if (this.selectedDoctorId && this.selectedDate) {
        this.loadAvailableTimeSlots();
      }
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
    this.appointmentsService.getAvailableTimeSlots(this.selectedDoctorId, date, this.appointmentId || undefined).subscribe(slots => {
      if (this.originalAppointment && this.selectedDoctorId === this.originalAppointment.doctorId) {
        const originalTime = this.originalAppointment.time;
        if (!slots.includes(originalTime)) {
          slots.push(originalTime);
          slots.sort();
        }
      }
      this.availableTimeSlots = slots;
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.selectedDoctorId || !this.selectedDate || !this.selectedTime || !this.reason.trim()) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !this.appointmentId) {
      alert(this.translationService.translate('message.error'));
      return;
    }

    const selectedDoctor = this.doctors.find(d => d.id === this.selectedDoctorId);
    if (!selectedDoctor) {
      alert(this.translationService.translate('message.error'));
      return;
    }

    const date = new Date(this.selectedDate);
    const changedDoctor = this.originalAppointment?.doctorId !== this.selectedDoctorId;
    const changedDate = this.originalAppointment && 
      new Date(this.originalAppointment.date).toISOString().split('T')[0] !== this.selectedDate;
    const changedTime = this.originalAppointment?.time !== this.selectedTime;

    if (changedDoctor || changedDate || changedTime) {
      this.appointmentsService.isTimeSlotAvailable(this.selectedDoctorId, date, this.selectedTime).subscribe(isAvailable => {
        if (!isAvailable) {
          alert(this.translationService.translate('patient.timeSlotNotAvailable'));
          this.loadAvailableTimeSlots();
          return;
        }
        this.updateAppointment(selectedDoctor, currentUser);
      });
    } else {
      this.updateAppointment(selectedDoctor, currentUser);
    }
  }

  private updateAppointment(selectedDoctor: User, currentUser: any): void {
    this.loading = true;

    const date = new Date(this.selectedDate);
    const appointmentData: Partial<Appointment> = {
      doctorId: this.selectedDoctorId,
      doctorName: selectedDoctor.name,
      date: date,
      time: this.selectedTime,
      status: this.status,
      reason: this.reason.trim()
    };

    this.appointmentsService.updateAppointment(this.appointmentId!, appointmentData).subscribe({
      next: () => {
        alert(this.translationService.translate('message.saveSuccess'));
        this.router.navigate(['/paciente/citas']);
      },
      error: () => {
        alert(this.translationService.translate('message.errorUpdate'));
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/paciente/citas']);
  }
}

