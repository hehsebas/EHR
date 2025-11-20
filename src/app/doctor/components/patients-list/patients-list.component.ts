import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { PatientsService } from '../../../core/services/patients.service';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CardComponent, TranslatePipe],
  template: `
    <div class="max-w-7xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-gray-100">{{ 'doctor.patientManagement' | translate }}</h1>
        <button 
          class="flex items-center gap-2 px-6 py-3 bg-primary-DEFAULT hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-colors" 
          [routerLink]="['/doctor/pacientes/nuevo']">
          <span class="material-icons text-base">add</span>
          {{ 'doctor.newPatient' | translate }}
        </button>
      </div>
      <app-card>
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            [placeholder]="'doctor.searchPlaceholder' | translate"
            class="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          />
          <span class="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">search</span>
        </div>
      </app-card>
      <app-card [title]="'nav.patients' | translate">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.name' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.document' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.age' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.status' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.assignedDoctor' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.actions' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let patient of filteredPatients" class="border-b border-gray-200 dark:border-gray-700">
                <td class="px-3 py-3 text-gray-700 dark:text-gray-300">{{ patient.name }}</td>
                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ patient.document }}</td>
                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ patient.age }} {{ 'form.age' | translate }}</td>
                <td class="px-3 py-3">
                  <span 
                    class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                    [ngClass]="{
                      'bg-green-500 text-white': patient.status === 'activo',
                      'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300': patient.status !== 'activo'
                    }">
                    {{ getStatusTranslation(patient.status) }}
                  </span>
                </td>
                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ patient.assignedDoctorName }}</td>
                <td class="px-3 py-3">
                  <div class="flex gap-2">
                    <button
                      class="px-3 py-1.5 bg-primary-DEFAULT hover:bg-primary-dark text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-90"
                      [routerLink]="['/doctor/pacientes', patient.id]">
                      {{ 'common.view' | translate }}
                    </button>
                    <button
                      class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-90"
                      [routerLink]="['/doctor/pacientes', patient.id, 'editar']">
                      {{ 'common.edit' | translate }}
                    </button>
                    <button
                      class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-90"
                      (click)="deletePatient(patient)">
                      {{ 'common.delete' | translate }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredPatients.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-600 dark:text-gray-400">
                  {{ 'message.noPatients' | translate }}
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
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchQuery = '';

  constructor(
    private patientsService: PatientsService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientsService.getPatients().subscribe(patients => {
      this.patients = patients;
      this.filteredPatients = patients;
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredPatients = this.patients;
      return;
    }

    this.patientsService.searchPatients(this.searchQuery).subscribe(patients => {
      this.filteredPatients = patients;
    });
  }

  deletePatient(patient: Patient): void {
    const message = this.translationService.translate('message.confirmDeletePatient', { name: patient.name });
    if (confirm(message)) {
      this.patientsService.deletePatient(patient.id).subscribe({
        next: () => {
          this.loadPatients();
        },
        error: () => {
          alert(this.translationService.translate('message.errorDelete'));
        }
      });
    }
  }

  getStatusTranslation(status: string): string {
    return status === 'activo' 
      ? this.translationService.translate('form.active')
      : this.translationService.translate('form.inactive');
  }
}
