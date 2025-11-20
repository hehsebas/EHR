export interface DashboardMetrics {
  totalPatients: number;
  totalDoctors: number;
  monthlyConsultations: number;
  monthlyRevenue: number;
  attendanceRate: number;
}

export interface DoctorMetrics {
  doctorId: string;
  doctorName: string;
  patientsAttended: number;
  averagePatientsPerDay: number;
  cancellationRate: number;
  productivity: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }[];
}

