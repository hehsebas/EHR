import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { PatientsService } from '../../../core/services/patients.service';
import { AuthService } from '../../../core/services/auth.service';
import { ClinicalHistory } from '../../../core/models/patient.model';

@Component({
  selector: 'app-historia',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslatePipe],
  template: `
    <div class="max-w-5xl">
      <h1 class="text-3xl font-medium mb-6 text-gray-900 dark:text-gray-100">{{ 'patient.clinicalHistory' | translate }}</h1>
      <app-card *ngIf="clinicalHistories.length > 0; else noHistory">
        <div class="mt-4">
          <div class="relative pl-8">
            <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
            <div class="relative space-y-8" *ngFor="let history of clinicalHistories">
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
                    <div *ngIf="history.examResults.length > 0">
                      <h4 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">{{ 'doctor.examResults' | translate }}</h4>
                      <ul class="m-2 pl-5 list-disc">
                        <li *ngFor="let exam of history.examResults" class="text-gray-600 dark:text-gray-400 leading-relaxed mb-1">
                          <strong class="text-gray-900 dark:text-gray-100">{{ exam.name }}</strong> ({{ exam.type }}) - {{ exam.result }}
                        </li>
                      </ul>
                    </div>
                    <div *ngIf="history.treatmentPlan">
                      <h4 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">{{ 'doctor.recommendations' | translate }}</h4>
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
      </app-card>
      <ng-template #noHistory>
        <app-card>
          <div class="text-center py-12 text-gray-600 dark:text-gray-400">
            <span class="material-icons text-6xl text-gray-400 dark:text-gray-500 mb-4 block">history</span>
            <p class="text-base">{{ 'patient.noHistory' | translate }}</p>
          </div>
        </app-card>
      </ng-template>
    </div>
  `,
  styles: []
})
export class HistoriaComponent implements OnInit {
  clinicalHistories: ClinicalHistory[] = [];

  constructor(
    private patientsService: PatientsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.patientsService.getClinicalHistoryByPatientId(currentUser.id).subscribe(histories => {
      this.clinicalHistories = histories.sort((a, b) =>
        new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
      );
    });
  }
}
