export interface Patient {
  id: string;
  name: string;
  document: string;
  age: number;
  email: string;
  phone: string;
  status: 'activo' | 'inactivo';
  assignedDoctorId: string;
  assignedDoctorName: string;
  createdAt: Date;
}

export interface ClinicalHistory {
  id: string;
  patientId: string;
  consultationDate: Date;
  doctorId: string;
  doctorName: string;
  reason: string;
  diagnosis: string[];
  evolution: string;
  procedures: Procedure[];
  examResults: ExamResult[];
  treatmentPlan: TreatmentPlan;
}

export interface Procedure {
  id: string;
  name: string;
  description: string;
  date: Date;
}

export interface ExamResult {
  id: string;
  name: string;
  type: string;
  date: Date;
  result: string;
  fileUrl?: string;
}

export interface TreatmentPlan {
  medications: Medication[];
  recommendations: string[];
  followUpDate?: Date;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timeOfDay: string[];
  adherence?: number;
}

