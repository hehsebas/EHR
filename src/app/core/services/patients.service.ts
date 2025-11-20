import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Patient, ClinicalHistory } from '../models/patient.model';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private readonly STORAGE_KEY = 'patients';
  private readonly HISTORIES_KEY = 'clinical_histories';

  private defaultPatients: Patient[] = [
    {
      id: '1',
      name: 'María González',
      document: '12345678',
      age: 35,
      email: 'maria@example.com',
      phone: '+57 300 123 4567',
      status: 'activo',
      assignedDoctorId: '1',
      assignedDoctorName: 'Dr. Juan Pérez',
      createdAt: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      document: '87654321',
      age: 42,
      email: 'carlos@example.com',
      phone: '+57 300 987 6543',
      status: 'activo',
      assignedDoctorId: '1',
      assignedDoctorName: 'Dr. Juan Pérez',
      createdAt: new Date('2023-02-20')
    },
    {
      id: '3',
      name: 'Ana Martínez',
      document: '11223344',
      age: 28,
      email: 'ana@example.com',
      phone: '+57 300 555 1234',
      status: 'activo',
      assignedDoctorId: '1',
      assignedDoctorName: 'Dr. Juan Pérez',
      createdAt: new Date('2023-03-10')
    }
  ];

  private defaultHistories: ClinicalHistory[] = [
    {
      id: '1',
      patientId: '1',
      consultationDate: new Date('2024-01-15'),
      doctorId: '1',
      doctorName: 'Dr. Juan Pérez',
      reason: 'Control de rutina',
      diagnosis: ['Hipertensión arterial controlada'],
      evolution: 'Paciente en buen estado general. Presión arterial dentro de parámetros normales.',
      procedures: [
        {
          id: '1',
          name: 'Medición de presión arterial',
          description: 'PA: 120/80 mmHg',
          date: new Date('2024-01-15')
        }
      ],
      examResults: [
        {
          id: '1',
          name: 'Hemograma completo',
          type: 'Laboratorio',
          date: new Date('2024-01-15'),
          result: 'Valores dentro de parámetros normales'
        }
      ],
      treatmentPlan: {
        medications: [
          {
            id: '1',
            name: 'Losartán 50mg',
            dosage: '50mg',
            frequency: 'Una vez al día',
            duration: '30 días',
            timeOfDay: ['08:00']
          }
        ],
        recommendations: ['Dieta baja en sodio', 'Ejercicio moderado 3 veces por semana'],
        followUpDate: new Date('2024-02-15')
      }
    }
  ];

  constructor(
    private storage: StorageService,
    private authService: AuthService
  ) {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    if (!this.storage.getItem<Patient[]>(this.STORAGE_KEY)) {
      this.storage.setItem(this.STORAGE_KEY, this.defaultPatients);
    }
    if (!this.storage.getItem<ClinicalHistory[]>(this.HISTORIES_KEY)) {
      this.storage.setItem(this.HISTORIES_KEY, this.defaultHistories);
    }
  }

  private getPatientsFromStorage(): Patient[] {
    const patients = this.storage.getItem<Patient[]>(this.STORAGE_KEY);
    return patients || [];
  }

  private savePatients(patients: Patient[]): void {
    this.storage.setItem(this.STORAGE_KEY, patients);
  }

  private getHistoriesFromStorage(): ClinicalHistory[] {
    const histories = this.storage.getItem<ClinicalHistory[]>(this.HISTORIES_KEY);
    return histories || [];
  }

  private saveHistories(histories: ClinicalHistory[]): void {
    this.storage.setItem(this.HISTORIES_KEY, histories);
  }

  getPatients(): Observable<Patient[]> {
    const patients = this.getPatientsFromStorage();
    return of(patients).pipe(delay(300));
  }

  getPatientById(id: string): Observable<Patient | undefined> {
    const patients = this.getPatientsFromStorage();
    const patient = patients.find(p => p.id === id);
    return of(patient).pipe(delay(200));
  }

  createPatient(patientData: Omit<Patient, 'id' | 'createdAt'>): Observable<Patient> {
    const patients = this.getPatientsFromStorage();
    const currentUser = this.authService.getCurrentUser();
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date(),
      assignedDoctorId: patientData.assignedDoctorId || currentUser?.id || '1',
      assignedDoctorName: patientData.assignedDoctorName || currentUser?.name || 'Dr. Sin asignar'
    };
    patients.push(newPatient);
    this.savePatients(patients);
    return of(newPatient).pipe(delay(400));
  }

  updatePatient(id: string, patientData: Partial<Patient>): Observable<Patient> {
    const patients = this.getPatientsFromStorage();
    const index = patients.findIndex(p => p.id === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...patientData };
      this.savePatients(patients);
      return of(patients[index]).pipe(delay(400));
    }
    throw new Error('Paciente no encontrado');
  }

  deletePatient(id: string): Observable<boolean> {
    const patients = this.getPatientsFromStorage();
    const filtered = patients.filter(p => p.id !== id);
    this.savePatients(filtered);
    return of(true).pipe(delay(300));
  }

  getClinicalHistoryByPatientId(patientId: string): Observable<ClinicalHistory[]> {
    const histories = this.getHistoriesFromStorage();
    const filtered = histories.filter(h => h.patientId === patientId);
    return of(filtered).pipe(delay(300));
  }

  createClinicalHistory(history: Omit<ClinicalHistory, 'id'>): Observable<ClinicalHistory> {
    const histories = this.getHistoriesFromStorage();
    const newHistory: ClinicalHistory = {
      ...history,
      id: Date.now().toString()
    };
    histories.push(newHistory);
    this.saveHistories(histories);
    return of(newHistory).pipe(delay(400));
  }

  searchPatients(query: string): Observable<Patient[]> {
    const patients = this.getPatientsFromStorage();
    const lowerQuery = query.toLowerCase();
    const filtered = patients.filter(
      p => p.name.toLowerCase().includes(lowerQuery) ||
           p.document.includes(query)
    );
    return of(filtered).pipe(delay(200));
  }
}
