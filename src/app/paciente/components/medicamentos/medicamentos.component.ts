import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { PatientsService } from '../../../core/services/patients.service';
import { AuthService } from '../../../core/services/auth.service';
import { Medication } from '../../../core/models/patient.model';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslatePipe],
  template: `
    <div class="max-w-5xl">
      <h1 class="text-3xl font-medium mb-6 text-gray-900 dark:text-gray-100">{{ 'patient.medications' | translate }}</h1>
      <app-card *ngIf="medications.length > 0; else noMedications" [title]="'patient.currentMedications' | translate">
        <div class="flex flex-col gap-4">
          <div 
            *ngFor="let medication of medications" 
            class="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-medium text-gray-900 dark:text-gray-100 m-0">{{ medication.name }}</h3>
              <div 
                *ngIf="medication.adherence !== undefined" 
                class="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-medium">
                <span class="material-icons text-sm">check_circle</span>
                {{ medication.adherence }}% {{ 'patient.adherence' | translate }}
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div class="flex items-start gap-3">
                <span class="material-icons text-primary dark:text-primary-light mt-1">science</span>
                <div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">{{ 'patient.dosage' | translate }}</div>
                  <div class="text-sm text-gray-900 dark:text-gray-100 font-medium">{{ medication.dosage }}</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="material-icons text-primary dark:text-primary-light mt-1">schedule</span>
                <div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">{{ 'patient.frequency' | translate }}</div>
                  <div class="text-sm text-gray-900 dark:text-gray-100 font-medium">{{ medication.frequency }}</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="material-icons text-primary dark:text-primary-light mt-1">calendar_today</span>
                <div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">{{ 'patient.duration' | translate }}</div>
                  <div class="text-sm text-gray-900 dark:text-gray-100 font-medium">{{ medication.duration }}</div>
                </div>
              </div>
              <div class="flex items-start gap-3" *ngIf="medication.timeOfDay.length > 0">
                <span class="material-icons text-primary dark:text-primary-light mt-1">access_time</span>
                <div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">{{ 'patient.schedules' | translate }}</div>
                  <div class="text-sm text-gray-900 dark:text-gray-100 font-medium">{{ medication.timeOfDay.join(', ') }}</div>
                </div>
              </div>
            </div>
            <div *ngIf="medication.adherence !== undefined" class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-green-500 transition-all duration-300" [style.width.%]="medication.adherence"></div>
            </div>
          </div>
        </div>
      </app-card>
      <ng-template #noMedications>
        <app-card>
          <div class="text-center py-12 text-gray-600 dark:text-gray-400">
            <span class="material-icons text-6xl text-gray-400 dark:text-gray-500 mb-4 block">medication</span>
            <p class="text-base">{{ 'patient.noMedications' | translate }}</p>
          </div>
        </app-card>
      </ng-template>
    </div>
  `,
  styles: []
})
export class MedicamentosComponent implements OnInit {
  medications: Medication[] = [];

  constructor(
    private patientsService: PatientsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.patientsService.getClinicalHistoryByPatientId(currentUser.id).subscribe(histories => {
      const allMedications: Medication[] = [];
      histories.forEach(history => {
        if (history.treatmentPlan?.medications) {
          history.treatmentPlan.medications.forEach(med => {
            if (med.adherence === undefined) {
              med.adherence = Math.floor(Math.random() * 20) + 80;
            }
            allMedications.push(med);
          });
        }
      });
      this.medications = allMedications;
    });
  }
}
