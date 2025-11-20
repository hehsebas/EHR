import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardMetrics, DoctorMetrics, ChartData } from '../models/metrics.model';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  getDashboardMetrics(): Observable<DashboardMetrics> {
    const metrics: DashboardMetrics = {
      totalPatients: 156,
      totalDoctors: 12,
      monthlyConsultations: 342,
      monthlyRevenue: 12500000,
      attendanceRate: 87.5
    };
    return of(metrics).pipe(delay(600));
  }

  getDoctorMetrics(): Observable<DoctorMetrics[]> {
    const metrics: DoctorMetrics[] = [
      {
        doctorId: '1',
        doctorName: 'Dr. Juan Pérez',
        patientsAttended: 45,
        averagePatientsPerDay: 8,
        cancellationRate: 5.2,
        productivity: 92.5
      },
      {
        doctorId: '2',
        doctorName: 'Dr. Ana López',
        patientsAttended: 38,
        averagePatientsPerDay: 7,
        cancellationRate: 8.1,
        productivity: 85.3
      }
    ];
    return of(metrics).pipe(delay(500));
  }

  getPatientsByDoctorChart(): Observable<ChartData> {
    const data: ChartData = {
      labels: ['Dr. Juan Pérez', 'Dr. Ana López', 'Dr. Carlos Ruiz', 'Dr. María García'],
      datasets: [{
        label: 'Pacientes Atendidos',
        data: [45, 38, 32, 28],
        backgroundColor: ['#1976d2', '#42a5f5', '#64b5f6', '#90caf9']
      }]
    };
    return of(data).pipe(delay(400));
  }

  getMonthlyRevenueChart(): Observable<ChartData> {
    const data: ChartData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [{
        label: 'Ingresos (COP)',
        data: [9500000, 11000000, 10500000, 12000000, 11500000, 12500000],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)'
      }]
    };
    return of(data).pipe(delay(400));
  }

  getSpecialtiesDistributionChart(): Observable<ChartData> {
    const data: ChartData = {
      labels: ['Medicina General', 'Cardiología', 'Pediatría', 'Dermatología', 'Otras'],
      datasets: [{
        label: 'Distribución',
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          '#1976d2',
          '#42a5f5',
          '#64b5f6',
          '#90caf9',
          '#bbdefb'
        ]
      }]
    };
    return of(data).pipe(delay(400));
  }
}

