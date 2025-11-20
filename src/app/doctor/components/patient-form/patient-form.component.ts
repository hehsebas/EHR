import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientsService } from '../../../core/services/patients.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { Patient } from '../../../core/models/patient.model';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, TranslatePipe],
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
          {{ isEditMode ? ('doctor.editPatient' | translate) : ('doctor.newPatient' | translate) }}
        </h1>
      </div>

      <app-card>
        <form [formGroup]="patientForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'form.name' | translate }} *
              </label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                [class.border-red-500]="isFieldInvalid('name')"
              />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('name')">
                {{ getFieldError('name') }}
              </span>
            </div>

            <div>
              <label for="document" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'form.document' | translate }} *
              </label>
              <input
                id="document"
                type="text"
                formControlName="document"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                [class.border-red-500]="isFieldInvalid('document')"
              />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('document')">
                {{ getFieldError('document') }}
              </span>
            </div>

            <div>
              <label for="age" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'form.age' | translate }} *
              </label>
              <input
                id="age"
                type="number"
                formControlName="age"
                min="1"
                max="120"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                [class.border-red-500]="isFieldInvalid('age')"
              />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('age')">
                {{ getFieldError('age') }}
              </span>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'form.email' | translate }} *
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                [class.border-red-500]="isFieldInvalid('email')"
              />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('email')">
                {{ getFieldError('email') }}
              </span>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ 'form.phone' | translate }} *
              </label>
              <input
                id="phone"
                type="text"
                formControlName="phone"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                [class.border-red-500]="isFieldInvalid('phone')"
              />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('phone')">
                {{ getFieldError('phone') }}
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
                <option value="activo">{{ 'form.active' | translate }}</option>
                <option value="inactivo">{{ 'form.inactive' | translate }}</option>
              </select>
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
              [disabled]="patientForm.invalid || loading">
              <span *ngIf="!loading">{{ isEditMode ? ('form.updatePatient' | translate) : ('form.createPatient' | translate) }}</span>
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
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  isEditMode = false;
  patientId: string | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private patientsService: PatientsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translationService: TranslationService
  ) {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      document: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      status: ['activo', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId) {
      this.isEditMode = true;
      this.loadPatient();
    }
  }

  loadPatient(): void {
    if (!this.patientId) return;
    this.patientsService.getPatientById(this.patientId).subscribe({
      next: (patient) => {
        if (patient) {
          this.patientForm.patchValue({
            name: patient.name,
            document: patient.document,
            age: patient.age,
            email: patient.email,
            phone: patient.phone,
            status: patient.status
          });
        }
      },
      error: () => {
        this.errorMessage = this.translationService.translate('message.errorLoad');
      }
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const currentUser = this.authService.getCurrentUser();
    const formValue = this.patientForm.value;

    if (this.isEditMode && this.patientId) {
      this.patientsService.updatePatient(this.patientId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/doctor/pacientes']);
        },
        error: (error) => {
          this.errorMessage = error.message || this.translationService.translate('message.errorUpdate');
          this.loading = false;
        }
      });
    } else {
      this.patientsService.createPatient({
        ...formValue,
        assignedDoctorId: currentUser?.id || '1',
        assignedDoctorName: currentUser?.name || 'Dr. Sin asignar'
      }).subscribe({
        next: () => {
          this.router.navigate(['/doctor/pacientes']);
        },
        error: (error) => {
          this.errorMessage = error.message || this.translationService.translate('message.errorCreate');
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/doctor/pacientes']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.patientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.patientForm.get(fieldName);
    if (field?.hasError('required')) {
      return this.translationService.translate('form.required');
    }
    if (field?.hasError('email')) {
      return this.translationService.translate('form.invalidEmail');
    }
    if (field?.hasError('minlength')) {
      return this.translationService.translate('form.minLength', { min: '3' });
    }
    if (field?.hasError('min')) {
      return 'Valor mínimo: 1';
    }
    if (field?.hasError('max')) {
      return 'Valor máximo: 120';
    }
    return '';
  }
}
