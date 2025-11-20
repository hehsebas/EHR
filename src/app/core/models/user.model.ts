export enum UserRole {
  DOCTOR = 'doctor',
  PATIENT = 'paciente',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

