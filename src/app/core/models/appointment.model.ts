export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
  status: 'confirmada' | 'cancelada' | 'completada' | 'pendiente';
  reason: string;
  notes?: string;
}

