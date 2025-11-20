import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { PatientsService } from '../../../core/services/patients.service';
import { Patient, ClinicalHistory } from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, TranslatePipe],
  template: `
    <div class="max-w-5xl">
      <div class="mb-6 flex items-center gap-4">
        <button 
          class="flex items-center gap-2 bg-transparent border-none text-primary dark:text-primary-light cursor-pointer text-sm p-2 hover:opacity-80 transition-opacity" 
          routerLink="/doctor/pacientes">
          <span class="material-icons">arrow_back</span>
          {{ 'common.back' | translate }}
        </button>
        <h1 class="text-3xl font-medium text-gray-900 dark:text-gray-100 m-0">{{ 'doctor.patientDetail' | translate }}</h1>
      </div>

      <app-card *ngIf="patient" [title]="'doctor.basicData' | translate">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">{{ 'doctor.name' | translate }}:</span>
            <span class="text-base text-gray-900 dark:text-gray-100">{{ patient.name }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">{{ 'doctor.document' | translate }}:</span>
            <span class="text-base text-gray-900 dark:text-gray-100">{{ patient.document }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">{{ 'doctor.age' | translate }}:</span>
            <span class="text-base text-gray-900 dark:text-gray-100">{{ patient.age }} {{ 'form.age' | translate }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">{{ 'form.email' | translate }}:</span>
            <span class="text-base text-gray-900 dark:text-gray-100">{{ patient.email }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">{{ 'form.phone' | translate }}:</span>
            <span class="text-base text-gray-900 dark:text-gray-100">{{ patient.phone }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">{{ 'doctor.status' | translate }}:</span>
            <span>
              <span 
                class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                [ngClass]="{
                  'bg-green-500 text-white': patient.status === 'activo',
                  'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300': patient.status !== 'activo'
                }">
                {{ getStatusTranslation(patient.status) }}
              </span>
            </span>
          </div>
        </div>
      </app-card>

      <app-card [title]="'doctor.clinicalHistory' | translate">
        <div *ngIf="clinicalHistories.length > 0; else noHistory" class="mt-4">
          <div class="relative pl-8">
            <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
            <div class="relative space-y-8" *ngFor="let history of clinicalHistories; let last = last">
              <div class="relative">
                <div class="absolute -left-10 top-0 w-4 h-4 rounded-full bg-primary dark:bg-primary-light border-4 border-white dark:border-gray-800 z-10"></div>
                <div class="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                  <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 m-0">{{ history.consultationDate | date:'longDate' }}</h3>
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ history.doctorName }}</span>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <h4 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">{{ 'doctor.consultationReason' | translate }}</h4>
                      <p class="text-gray-600 dark:text-gray-400 leading-relaxed m-0">{{ history.reason }}</p>
                    </div>
                    <div>
                      <h4 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">{{ 'doctor.diagnosis' | translate }}</h4>
                      <ul class="m-2 pl-5 list-disc">
                        <li *ngFor="let diagnosis of history.diagnosis" class="text-gray-600 dark:text-gray-400 leading-relaxed mb-1">{{ diagnosis }}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">{{ 'doctor.evolution' | translate }}</h4>
                      <p class="text-gray-600 dark:text-gray-400 leading-relaxed m-0">{{ history.evolution }}</p>
                    </div>
                    <div *ngIf="history.procedures.length > 0">
                      <h4 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">{{ 'doctor.procedures' | translate }}</h4>
                      <ul class="m-2 pl-5 list-disc">
                        <li *ngFor="let procedure of history.procedures" class="text-gray-600 dark:text-gray-400 leading-relaxed mb-1">
                          <strong class="text-gray-900 dark:text-gray-100">{{ procedure.name }}</strong> - {{ procedure.description }}
                        </li>
                      </ul>
                    </div>
                    <div *ngIf="history.examResults.length > 0">
                      <h4 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">{{ 'doctor.examResults' | translate }}</h4>
                      <ul class="m-2 pl-5 list-disc">
                        <li *ngFor="let exam of history.examResults" class="text-gray-600 dark:text-gray-400 leading-relaxed mb-1">
                          <strong class="text-gray-900 dark:text-gray-100">{{ exam.name }}</strong> ({{ exam.type }}) - {{ exam.result }}
                        </li>
                      </ul>
                    </div>
                    <div *ngIf="history.treatmentPlan">
                      <h4 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">{{ 'doctor.treatmentPlan' | translate }}</h4>
                      <div *ngIf="history.treatmentPlan.medications.length > 0" class="mb-3">
                        <h5 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 mt-3">{{ 'doctor.medications' | translate }}</h5>
                        <ul class="m-2 pl-5 list-disc">
                          <li *ngFor="let med of history.treatmentPlan.medications" class="text-gray-600 dark:text-gray-400 leading-relaxed mb-1">
                            <strong class="text-gray-900 dark:text-gray-100">{{ med.name }}</strong> - {{ med.dosage }}, {{ med.frequency }}, {{ med.duration }}
                          </li>
                        </ul>
                      </div>
                      <div *ngIf="history.treatmentPlan.recommendations.length > 0">
                        <h5 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 mt-3">{{ 'doctor.recommendations' | translate }}</h5>
                        <ul class="m-2 pl-5 list-disc">
                          <li *ngFor="let rec of history.treatmentPlan.recommendations" class="text-gray-600 dark:text-gray-400 leading-relaxed mb-1">{{ rec }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ng-template #noHistory>
          <div class="text-center py-12 text-gray-600 dark:text-gray-400">
            {{ 'doctor.noHistory' | translate }}
          </div>
        </ng-template>
      </app-card>
    </div>
  `,
  styles: []
})
export class PatientDetailComponent implements OnInit {
  patient: Patient | undefined;
  clinicalHistories: ClinicalHistory[] = [];

  constructor(
    private route: ActivatedRoute,
    private patientsService: PatientsService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('id');
    if (patientId) {
      this.loadPatient(patientId);
      this.loadClinicalHistory(patientId);
    }
  }

  loadPatient(id: string): void {
    this.patientsService.getPatientById(id).subscribe(patient => {
      this.patient = patient;
    });
  }

  loadClinicalHistory(patientId: string): void {
    this.patientsService.getClinicalHistoryByPatientId(patientId).subscribe(histories => {
      this.clinicalHistories = histories.sort((a, b) =>
        new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
      );
    });
  }

  getStatusTranslation(status: string): string {
    return status === 'activo' 
      ? this.translationService.translate('form.active')
      : this.translationService.translate('form.inactive');
  }
}
