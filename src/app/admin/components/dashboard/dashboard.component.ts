import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { PowerBiEmbedComponent } from '../../../shared/components/power-bi-embed/power-bi-embed.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { MetricsService } from '../../../core/services/metrics.service';
import { DashboardMetrics, DoctorMetrics, ChartData } from '../../../core/models/metrics.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, PowerBiEmbedComponent, TranslatePipe],
  template: `
    <div class="max-w-7xl">
      <h1 class="text-3xl font-medium mb-6 text-gray-900 dark:text-gray-100">{{ 'admin.dashboard' | translate }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <app-card>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <span class="material-icons text-3xl">people</span>
            </div>
            <div class="flex-1">
              <div class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{{ metrics.totalPatients }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'admin.totalPatients' | translate }}</div>
            </div>
          </div>
        </app-card>
        <app-card>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-green-500 flex items-center justify-center text-white">
              <span class="material-icons text-3xl">local_hospital</span>
            </div>
            <div class="flex-1">
              <div class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{{ metrics.totalDoctors }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'admin.totalDoctors' | translate }}</div>
            </div>
          </div>
        </app-card>
        <app-card>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-orange-500 flex items-center justify-center text-white">
              <span class="material-icons text-3xl">event</span>
            </div>
            <div class="flex-1">
              <div class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{{ metrics.monthlyConsultations }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'admin.monthlyConsultations' | translate }}</div>
            </div>
          </div>
        </app-card>
        <app-card>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-purple-500 flex items-center justify-center text-white">
              <span class="material-icons text-3xl">attach_money</span>
            </div>
            <div class="flex-1">
              <div class="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{{ formatCurrency(metrics.monthlyRevenue) }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ 'admin.monthlyRevenue' | translate }}</div>
            </div>
          </div>
        </app-card>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <app-card [title]="'admin.patientsByDoctor' | translate">
          <div class="py-4">
            <div class="flex flex-col gap-4">
              <div *ngFor="let item of patientsByDoctorData" class="flex flex-col gap-2">
                <div class="text-xs text-gray-600 dark:text-gray-400 font-medium">{{ item.label }}</div>
                <div class="relative h-8 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                  <div class="h-full bg-primary dark:bg-primary-light transition-all duration-300" [style.width.%]="item.percentage"></div>
                  <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-900 dark:text-gray-100">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </app-card>
        <app-card [title]="'admin.monthlyRevenue' | translate">
          <div class="py-4">
            <div class="h-48 relative border-b-2 border-gray-200 dark:border-gray-700">
              <div class="relative h-full">
                <div 
                  *ngFor="let item of revenueData; let i = index" 
                  class="absolute transform -translate-x-1/2 text-center"
                  [style.left.%]="(i / (revenueData.length - 1)) * 100">
                  <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ formatCurrency(item.value) }}</div>
                  <div class="w-2 h-2 rounded-full bg-primary dark:bg-primary-light mx-auto mb-1"></div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </app-card>
        <app-card [title]="'admin.specialtiesDistribution' | translate">
          <div class="py-4">
            <div class="flex flex-col gap-3">
              <div *ngFor="let item of specialtiesData" class="flex items-center gap-3">
                <div class="w-6 h-6 rounded" [style.background-color]="item.color"></div>
                <div class="flex-1 flex justify-between items-center">
                  <div class="text-sm text-gray-900 dark:text-gray-100">{{ item.label }}</div>
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.value }}%</div>
                </div>
              </div>
            </div>
          </div>
        </app-card>
      </div>
      <app-card [title]="'admin.doctorMetrics' | translate">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'admin.doctor' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'admin.patientsAttended' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'admin.averagePerDay' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'admin.cancellationRate' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'admin.productivity' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let doctor of doctorMetrics" class="border-b border-gray-200 dark:border-gray-700">
                <td class="px-3 py-3 text-gray-700 dark:text-gray-300">{{ doctor.doctorName }}</td>
                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ doctor.patientsAttended }}</td>
                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ doctor.averagePatientsPerDay }}</td>
                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ doctor.cancellationRate }}%</td>
                <td class="px-3 py-3">
                  <div class="relative h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex items-center">
                    <div class="absolute left-0 top-0 h-full bg-green-500 transition-all duration-300" [style.width.%]="doctor.productivity"></div>
                    <span class="relative z-10 text-xs font-medium text-gray-900 dark:text-gray-100 px-2">{{ doctor.productivity }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
      <app-card [title]="'admin.powerBiIntegration' | translate">
        <app-power-bi-embed
          reportId="sample-report-123"
          [filters]="['Fecha: Últimos 6 meses', 'Tipo: Consultas']">
        </app-power-bi-embed>
      </app-card>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  metrics: DashboardMetrics = {
    totalPatients: 0,
    totalDoctors: 0,
    monthlyConsultations: 0,
    monthlyRevenue: 0,
    attendanceRate: 0
  };
  doctorMetrics: DoctorMetrics[] = [];
  patientsByDoctorData: { label: string; value: number; percentage: number }[] = [];
  revenueData: { label: string; value: number }[] = [];
  specialtiesData: { label: string; value: number; color: string }[] = [];

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.loadMetrics();
    this.loadDoctorMetrics();
    this.loadChartsData();
  }

  loadMetrics(): void {
    this.metricsService.getDashboardMetrics().subscribe(metrics => {
      this.metrics = metrics;
    });
  }

  loadDoctorMetrics(): void {
    this.metricsService.getDoctorMetrics().subscribe(doctors => {
      this.doctorMetrics = doctors;
    });
  }

  loadChartsData(): void {
    this.metricsService.getPatientsByDoctorChart().subscribe(data => {
      const max = Math.max(...data.datasets[0].data);
      this.patientsByDoctorData = data.labels.map((label, i) => ({
        label,
        value: data.datasets[0].data[i],
        percentage: (data.datasets[0].data[i] / max) * 100
      }));
    });

    this.metricsService.getMonthlyRevenueChart().subscribe(data => {
      this.revenueData = data.labels.map((label, i) => ({
        label,
        value: data.datasets[0].data[i]
      }));
    });

    this.metricsService.getSpecialtiesDistributionChart().subscribe(data => {
      const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
      this.specialtiesData = data.labels.map((label, i) => ({
        label,
        value: Math.round((data.datasets[0].data[i] / total) * 100),
        color: (data.datasets[0].backgroundColor as string[])[i]
      }));
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }
}
