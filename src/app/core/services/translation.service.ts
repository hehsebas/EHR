import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'es' | 'en';

export interface Translations {
  [key: string]: string | Translations;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage$ = new BehaviorSubject<Language>('es');
  private translations: { [lang: string]: Translations } = {};

  constructor() {
    this.loadTranslations();
    this.loadSavedLanguage();
  }

  private loadSavedLanguage(): void {
    const saved = localStorage.getItem('meditrack_language') as Language;
    if (saved && (saved === 'es' || saved === 'en')) {
      this.currentLanguage$.next(saved);
    }
  }

  private loadTranslations(): void {
    // Español
    this.translations['es'] = {
      // General
      'common.save': 'Guardar',
      'common.cancel': 'Cancelar',
      'common.delete': 'Eliminar',
      'common.edit': 'Editar',
      'common.view': 'Ver',
      'common.back': 'Volver',
      'common.search': 'Buscar',
      'common.loading': 'Cargando...',
      'common.close': 'Cerrar',
      'common.yes': 'Sí',
      'common.no': 'No',
      'common.confirm': 'Confirmar',
      
      // Navigation
      'nav.dashboard': 'Inicio',
      'nav.patients': 'Pacientes',
      'nav.calendar': 'Calendario',
      'nav.history': 'Mi Historia',
      'nav.medications': 'Medicamentos',
      'nav.appointments': 'Mis Citas',
      'nav.users': 'Usuarios',
      'nav.logout': 'Salir',
      'nav.language': 'Idioma',
      
      // Auth
      'auth.login': 'Iniciar Sesión',
      'auth.email': 'Email o Usuario',
      'auth.password': 'Contraseña',
      'auth.loginButton': 'Iniciar Sesión',
      'auth.testUsers': 'Usuarios de prueba',
      'auth.invalidCredentials': 'Credenciales inválidas',
      
      // Doctor
      'doctor.dashboard': 'Inicio',
      'doctor.activePatients': 'Pacientes Activos',
      'doctor.todayAppointments': 'Citas de Hoy',
      'doctor.monthlyProcedures': 'Procedimientos del Mes',
      'doctor.attendanceRate': 'Tasa de Asistencia',
      'doctor.upcomingAppointments': 'Próximas Citas',
      'doctor.patientManagement': 'Gestión de Pacientes',
      'doctor.newPatient': 'Nuevo Paciente',
      'doctor.patientDetail': 'Detalle del Paciente',
      'doctor.editPatient': 'Editar Paciente',
      'doctor.calendar': 'Calendario de Citas',
      'doctor.newAppointment': 'Nueva Cita',
      'doctor.editAppointment': 'Editar Cita',
      'doctor.patient': 'Paciente',
      'doctor.date': 'Fecha',
      'doctor.time': 'Hora',
      'doctor.reason': 'Motivo',
      'doctor.status': 'Estado',
      'doctor.actions': 'Acciones',
      'doctor.name': 'Nombre',
      'doctor.document': 'Documento',
      'doctor.age': 'Edad',
      'doctor.assignedDoctor': 'Médico Asignado',
      'doctor.searchPlaceholder': 'Buscar por nombre o documento...',
      'doctor.weeklyView': 'Vista Semanal',
      'doctor.appointmentList': 'Lista de Citas',
      'doctor.noAppointments': 'No hay citas programadas',
      'doctor.basicData': 'Datos Básicos',
      'doctor.clinicalHistory': 'Historia Clínica',
      'doctor.consultationDate': 'Fecha de Consulta',
      'doctor.consultationReason': 'Motivo de Consulta',
      'doctor.diagnosis': 'Diagnóstico',
      'doctor.evolution': 'Evolución',
      'doctor.procedures': 'Procedimientos',
      'doctor.examResults': 'Resultados de Exámenes',
      'doctor.treatmentPlan': 'Plan de Tratamiento',
      'doctor.medications': 'Medicamentos',
      'doctor.recommendations': 'Recomendaciones',
      'doctor.noHistory': 'No hay historia clínica registrada para este paciente.',
      
      // Patient
      'patient.dashboard': 'Mi Inicio',
      'patient.welcome': 'Que bueno verte de nuevo, ',
      'patient.nextAppointment': 'Próxima Cita',
      'patient.lastConsultation': 'Última Consulta',
      'patient.treatmentAdherence': 'Cumplimiento Tratamiento',
      'patient.clinicalHistory': 'Mi Historia Clínica',
      'patient.medications': 'Mis Medicamentos',
      'patient.appointments': 'Mis Citas',
      'patient.quickAccess': 'Accesos Rápidos',
      'patient.dateTime': 'Fecha y Hora',
      'patient.doctor': 'Médico',
      'patient.noAppointments': 'No tienes citas programadas.',
      'patient.noMedications': 'No hay medicamentos asignados actualmente.',
      'patient.noHistory': 'No hay historia clínica registrada aún.',
      'patient.currentMedications': 'Medicamentos Actuales',
      'patient.dosage': 'Dosis',
      'patient.frequency': 'Frecuencia',
      'patient.duration': 'Duración',
      'patient.schedules': 'Horarios',
      'patient.adherence': 'adherencia',
      'patient.cancelAppointment': 'Cancelar Cita',
      'patient.requestCancellation': 'Solicitud de cancelación enviada.',
      'patient.createAppointment': 'Crear Nueva Cita',
      'patient.editAppointment': 'Editar Cita',
      'patient.selectDoctor': 'Seleccionar Especialista',
      'patient.noAvailableSlots': 'No hay horarios disponibles para esta fecha. Por favor, seleccione otra fecha.',
      'patient.timeSlotNotAvailable': 'Este horario ya no está disponible. Por favor, seleccione otro horario.',
      'patient.appointmentReasonPlaceholder': 'Describa el motivo de su consulta...',
      
      // Admin
      'admin.dashboard': 'Inicio',
      'admin.totalPatients': 'Total Pacientes',
      'admin.totalDoctors': 'Total Doctores',
      'admin.monthlyConsultations': 'Consultas del Mes',
      'admin.userManagement': 'Gestión de Usuarios',
      'admin.newUser': 'Nuevo Usuario',
      'admin.editUser': 'Editar Usuario',
      'admin.patientsByDoctor': 'Pacientes Atendidos por Doctor',
      'admin.monthlyRevenue': 'Ingresos Mensuales',
      'admin.specialtiesDistribution': 'Distribución de Especialidades',
      'admin.doctorMetrics': 'Métricas por Doctor',
      'admin.doctor': 'Doctor',
      'admin.patientsAttended': 'Pacientes Atendidos',
      'admin.averagePerDay': 'Promedio/Día',
      'admin.cancellationRate': 'Tasa Cancelación',
      'admin.productivity': 'Productividad',
      'admin.powerBiIntegration': 'Integración Power BI - Ejemplo',
      'admin.allRoles': 'Todos los roles',
      'admin.searchPlaceholder': 'Buscar por nombre o email...',
      
      // Forms
      'form.name': 'Nombre Completo',
      'form.document': 'Documento de Identidad',
      'form.age': 'Edad',
      'form.email': 'Email',
      'form.phone': 'Teléfono',
      'form.status': 'Estado',
      'form.active': 'Activo',
      'form.inactive': 'Inactivo',
      'form.role': 'Rol',
      'form.patient': 'Paciente',
      'form.date': 'Fecha',
      'form.time': 'Hora',
      'form.reason': 'Motivo de Consulta',
      'form.required': 'Este campo es requerido',
      'form.invalidEmail': 'Email inválido',
      'form.minLength': 'Mínimo {min} caracteres',
      'form.selectPatient': 'Seleccionar paciente',
      'form.selectReason': 'Seleccionar motivo de consulta',
      'form.activeUser': 'Usuario Activo',
      'form.save': 'Guardar',
      'form.create': 'Crear',
      'form.update': 'Actualizar',
      'form.saving': 'Guardando...',
      'form.createPatient': 'Crear Paciente',
      'form.updatePatient': 'Actualizar Paciente',
      'form.createAppointment': 'Crear Cita',
      'form.updateAppointment': 'Actualizar Cita',
      
      // Status
      'status.pending': 'Pendiente',
      'status.confirmed': 'Confirmada',
      'status.cancelled': 'Cancelada',
      'status.completed': 'Completada',
      
      // Roles
      'role.doctor': 'Médico',
      'role.patient': 'Paciente',
      'role.admin': 'Administrador',
      
      // Messages
      'message.confirmDelete': '¿Estás seguro de eliminar?',
      'message.saveSuccess': 'Guardado exitosamente',
      'message.deleteSuccess': 'Eliminado exitosamente',
      'message.error': 'Error al procesar la solicitud',
      'message.noData': 'No se encontraron datos',
      'message.noAppointments': 'No hay citas programadas',
      'message.noPatients': 'No se encontraron pacientes',
      'message.noUsers': 'No se encontraron usuarios',
      'message.confirmDeletePatient': '¿Estás seguro de eliminar a {name}?',
      'message.confirmDeleteAppointment': '¿Estás seguro de eliminar esta cita?',
      'message.confirmDeleteUser': '¿Estás seguro de eliminar a {name}?',
      'message.errorDelete': 'Error al eliminar',
      'message.errorSave': 'Error al guardar',
      'message.errorUpdate': 'Error al actualizar',
      'message.errorCreate': 'Error al crear',
      'message.errorLoad': 'Error al cargar',
      
      // Home
      'home.title': 'Romed',
      'home.subtitle': 'Clinical History',
      'home.description': 'Gestiona historias clínicas de forma eficiente, accede a análisis en tiempo real y mejora la calidad de atención médica con tecnología de vanguardia.',
      'home.login': 'Iniciar Sesión',
      'home.learnMore': 'Conocer Más',
      'home.features': 'Características Principales',
      'home.feature1.title': 'Historia Clínica Digital',
      'home.feature1.desc': 'Gestiona y accede a historias clínicas completas de forma segura y organizada.',
      'home.feature2.title': 'Analítica Avanzada',
      'home.feature2.desc': 'Visualiza métricas y tendencias con integración Power BI para toma de decisiones informadas.',
      'home.feature3.title': 'Seguridad y Privacidad',
      'home.feature3.desc': 'Protección de datos con autenticación robusta y control de acceso por roles.',
      'home.feature4.title': 'Gestión de Citas',
      'home.feature4.desc': 'Calendario integrado para programar y gestionar citas médicas eficientemente.',
      'home.feature5.title': 'Control de Tratamientos',
      'home.feature5.desc': 'Seguimiento de medicamentos y planes de tratamiento con indicadores de adherencia.',
      'home.feature6.title': 'Acceso Multiplataforma',
      'home.feature6.desc': 'Interfaz responsive accesible desde cualquier dispositivo, en cualquier momento.',
      'home.cta.title': '¿Listo para comenzar?',
      'home.cta.description': 'Únete a las clínicas que ya están mejorando su gestión con MediTrack'
    };

    // Inglés
    this.translations['en'] = {
      // General
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.back': 'Back',
      'common.search': 'Search',
      'common.loading': 'Loading...',
      'common.close': 'Close',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.confirm': 'Confirm',
      
      // Navigation
      'nav.dashboard': 'Home',
      'nav.patients': 'Patients',
      'nav.calendar': 'Calendar',
      'nav.history': 'My History',
      'nav.medications': 'Medications',
      'nav.appointments': 'My Appointments',
      'nav.users': 'Users',
      'nav.logout': 'Logout',
      'nav.language': 'Language',
      
      // Auth
      'auth.login': 'Login',
      'auth.email': 'Email or Username',
      'auth.password': 'Password',
      'auth.loginButton': 'Login',
      'auth.testUsers': 'Test Users',
      'auth.invalidCredentials': 'Invalid credentials',
      
      // Doctor
      'doctor.dashboard': 'Home',
      'doctor.activePatients': 'Active Patients',
      'doctor.todayAppointments': "Today's Appointments",
      'doctor.monthlyProcedures': 'Monthly Procedures',
      'doctor.attendanceRate': 'Attendance Rate',
      'doctor.upcomingAppointments': 'Upcoming Appointments',
      'doctor.patientManagement': 'Patient Management',
      'doctor.newPatient': 'New Patient',
      'doctor.patientDetail': 'Patient Detail',
      'doctor.editPatient': 'Edit Patient',
      'doctor.calendar': 'Appointment Calendar',
      'doctor.newAppointment': 'New Appointment',
      'doctor.editAppointment': 'Edit Appointment',
      'doctor.patient': 'Patient',
      'doctor.date': 'Date',
      'doctor.time': 'Time',
      'doctor.reason': 'Reason',
      'doctor.status': 'Status',
      'doctor.actions': 'Actions',
      'doctor.name': 'Name',
      'doctor.document': 'Document',
      'doctor.age': 'Age',
      'doctor.assignedDoctor': 'Assigned Doctor',
      'doctor.searchPlaceholder': 'Search by name or document...',
      'doctor.weeklyView': 'Weekly View',
      'doctor.appointmentList': 'Appointment List',
      'doctor.noAppointments': 'No appointments scheduled',
      'doctor.basicData': 'Basic Data',
      'doctor.clinicalHistory': 'Clinical History',
      'doctor.consultationDate': 'Consultation Date',
      'doctor.consultationReason': 'Consultation Reason',
      'doctor.diagnosis': 'Diagnosis',
      'doctor.evolution': 'Evolution',
      'doctor.procedures': 'Procedures',
      'doctor.examResults': 'Exam Results',
      'doctor.treatmentPlan': 'Treatment Plan',
      'doctor.medications': 'Medications',
      'doctor.recommendations': 'Recommendations',
      'doctor.noHistory': 'No clinical history registered for this patient.',
      
      // Patient
      'patient.dashboard': 'Home',
      'patient.welcome': 'Welcome, {name}',
      'patient.nextAppointment': 'Next Appointment',
      'patient.lastConsultation': 'Last Consultation',
      'patient.treatmentAdherence': 'Treatment Adherence',
      'patient.clinicalHistory': 'My Clinical History',
      'patient.medications': 'My Medications',
      'patient.appointments': 'My Appointments',
      'patient.quickAccess': 'Quick Access',
      'patient.dateTime': 'Date and Time',
      'patient.doctor': 'Doctor',
      'patient.noAppointments': 'You have no scheduled appointments.',
      'patient.noMedications': 'No medications currently assigned.',
      'patient.noHistory': 'No clinical history registered yet.',
      'patient.currentMedications': 'Current Medications',
      'patient.dosage': 'Dosage',
      'patient.frequency': 'Frequency',
      'patient.duration': 'Duration',
      'patient.schedules': 'Schedules',
      'patient.adherence': 'adherence',
      'patient.cancelAppointment': 'Cancel Appointment',
      'patient.requestCancellation': 'Cancellation request sent.',
      'patient.createAppointment': 'Create New Appointment',
      'patient.editAppointment': 'Edit Appointment',
      'patient.selectDoctor': 'Select Specialist',
      'patient.noAvailableSlots': 'No time slots available for this date. Please select another date.',
      'patient.timeSlotNotAvailable': 'This time slot is no longer available. Please select another time slot.',
      'patient.appointmentReasonPlaceholder': 'Describe the reason for your consultation...',
      
      // Admin
      'admin.dashboard': 'Home',
      'admin.totalPatients': 'Total Patients',
      'admin.totalDoctors': 'Total Doctors',
      'admin.monthlyConsultations': 'Monthly Consultations',
      'admin.monthlyRevenue': 'Monthly Revenue',
      'admin.userManagement': 'User Management',
      'admin.newUser': 'New User',
      'admin.editUser': 'Edit User',
      'admin.patientsByDoctor': 'Patients Attended by Doctor',
      'admin.specialtiesDistribution': 'Specialties Distribution',
      'admin.doctorMetrics': 'Metrics by Doctor',
      'admin.doctor': 'Doctor',
      'admin.patientsAttended': 'Patients Attended',
      'admin.averagePerDay': 'Average/Day',
      'admin.cancellationRate': 'Cancellation Rate',
      'admin.productivity': 'Productivity',
      'admin.powerBiIntegration': 'Power BI Integration - Example',
      'admin.allRoles': 'All roles',
      'admin.searchPlaceholder': 'Search by name or email...',
      
      // Forms
      'form.name': 'Full Name',
      'form.document': 'ID Document',
      'form.age': 'Age',
      'form.email': 'Email',
      'form.phone': 'Phone',
      'form.status': 'Status',
      'form.active': 'Active',
      'form.inactive': 'Inactive',
      'form.role': 'Role',
      'form.patient': 'Patient',
      'form.date': 'Date',
      'form.time': 'Time',
      'form.reason': 'Consultation Reason',
      'form.required': 'This field is required',
      'form.invalidEmail': 'Invalid email',
      'form.minLength': 'Minimum {min} characters',
      'form.selectPatient': 'Select patient',
      'form.selectReason': 'Select consultation reason',
      'form.activeUser': 'Active User',
      'form.save': 'Save',
      'form.create': 'Create',
      'form.update': 'Update',
      'form.saving': 'Saving...',
      'form.createPatient': 'Create Patient',
      'form.updatePatient': 'Update Patient',
      'form.createAppointment': 'Create Appointment',
      'form.updateAppointment': 'Update Appointment',
      
      // Status
      'status.pending': 'Pending',
      'status.confirmed': 'Confirmed',
      'status.cancelled': 'Cancelled',
      'status.completed': 'Completed',
      
      // Roles
      'doctor': 'Doctor',
      'paciente': 'Pacient',
      'admin': 'Administrator',
      
      // Messages
      'message.confirmDelete': 'Are you sure you want to delete?',
      'message.saveSuccess': 'Saved successfully',
      'message.deleteSuccess': 'Deleted successfully',
      'message.error': 'Error processing request',
      'message.noData': 'No data found',
      'message.noAppointments': 'No appointments scheduled',
      'message.noPatients': 'No patients found',
      'message.noUsers': 'No users found',
      'message.confirmDeletePatient': 'Are you sure you want to delete {name}?',
      'message.confirmDeleteAppointment': 'Are you sure you want to delete this appointment?',
      'message.confirmDeleteUser': 'Are you sure you want to delete {name}?',
      'message.errorDelete': 'Error deleting',
      'message.errorSave': 'Error saving',
      'message.errorUpdate': 'Error updating',
      'message.errorCreate': 'Error creating',
      'message.errorLoad': 'Error loading',
      
      // Home
      'home.title': 'Romed',
      'home.subtitle': 'Clinical History',
      'home.description': 'Manage clinical histories efficiently, access real-time analysis and improve medical care quality with cutting-edge technology.',
      'home.login': 'Login',
      'home.learnMore': 'Learn More',
      'home.features': 'Main Features',
      'home.feature1.title': 'Digital Clinical History',
      'home.feature1.desc': 'Manage and access complete clinical histories securely and organized.',
      'home.feature2.title': 'Advanced Analytics',
      'home.feature2.desc': 'Visualize metrics and trends with Power BI integration for informed decision making.',
      'home.feature3.title': 'Security and Privacy',
      'home.feature3.desc': 'Data protection with robust authentication and role-based access control.',
      'home.feature4.title': 'Appointment Management',
      'home.feature4.desc': 'Integrated calendar to schedule and manage medical appointments efficiently.',
      'home.feature5.title': 'Treatment Control',
      'home.feature5.desc': 'Track medications and treatment plans with adherence indicators.',
      'home.feature6.title': 'Multi-platform Access',
      'home.feature6.desc': 'Responsive interface accessible from any device, anytime.',
      'home.cta.title': 'Ready to get started?',
      'home.cta.description': 'Join the clinics that are already improving their management with MediTrack'
    };
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage$.value;
  }

  getCurrentLanguage$(): Observable<Language> {
    return this.currentLanguage$.asObservable();
  }

  setLanguage(lang: Language): void {
    this.currentLanguage$.next(lang);
    localStorage.setItem('meditrack_language', lang);
  }

  translate(key: string, params?: { [key: string]: string | number }): string {
    const lang = this.currentLanguage$.value;
    const translations = this.translations[lang];
    
    if (!translations) {
      console.warn(`Language ${lang} not found`);
      return key;
    }

    const translation = translations[key];
    
    if (!translation || typeof translation !== 'string') {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    if (params) {
      return this.interpolate(translation, params);
    }

    return translation;
  }

  private interpolate(template: string, params: { [key: string]: string | number }): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }
}

