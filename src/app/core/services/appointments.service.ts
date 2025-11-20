import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Appointment } from '../models/appointment.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private readonly TABLE_NAME = 'appointments';

  constructor(private supabase: SupabaseService) {}
  getAppointmentsByDoctor(doctorId: string): Observable<Appointment[]> {
    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .select('*')
        .eq('doctor_id', doctorId)
        .order('date', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(this.mapToAppointment);
      }),
      catchError(error => {
        console.error('Error fetching appointments by doctor:', error);
        return throwError(() => error);
      })
    );
  }

  getAppointmentsByPatient(patientId: string): Observable<Appointment[]> {
    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(this.mapToAppointment);
      }),
      catchError(error => {
        console.error('Error fetching appointments by patient:', error);
        return throwError(() => error);
      })
    );
  }

  getAppointmentById(id: string): Observable<Appointment | undefined> {
    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(response => {
        if (response.error) {
          if (response.error.code === 'PGRST116') {
            return undefined; // No encontrado
          }
          throw response.error;
        }
        return this.mapToAppointment(response.data);
      }),
      catchError(error => {
        console.error('Error fetching appointment by id:', error);
        return throwError(() => error);
      })
    );
  }

  getTodayAppointments(doctorId: string): Observable<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .select('*')
        .eq('doctor_id', doctorId)
        .gte('date', today.toISOString())
        .lt('date', tomorrow.toISOString())
        .order('time', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(this.mapToAppointment);
      }),
      catchError(error => {
        console.error('Error fetching today appointments:', error);
        return throwError(() => error);
      })
    );
  }

  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    const appointmentData = this.mapToSupabase(appointment);

    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .insert(appointmentData)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToAppointment(response.data);
      }),
      catchError(error => {
        console.error('Error creating appointment:', error);
        return throwError(() => error);
      })
    );
  }

  updateAppointment(id: string, appointmentData: Partial<Appointment>): Observable<Appointment> {
    const updateData = this.mapToSupabase(appointmentData as Appointment);
    delete (updateData as any).id;
    delete (updateData as any).created_at;

    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToAppointment(response.data);
      }),
      catchError(error => {
        console.error('Error updating appointment:', error);
        return throwError(() => error);
      })
    );
  }

  updateAppointmentStatus(id: string, status: Appointment['status']): Observable<Appointment> {
    return this.updateAppointment(id, { status } as Partial<Appointment>);
  }

  deleteAppointment(id: string): Observable<boolean> {
    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return true;
      }),
      catchError(error => {
        console.error('Error deleting appointment:', error);
        return throwError(() => error);
      })
    );
  }

  isTimeSlotAvailable(doctorId: string, date: Date, time: string, excludeAppointmentId?: string): Observable<boolean> {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let query = this.supabase.getClient()
      .from(this.TABLE_NAME)
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('time', time)
      .gte('date', selectedDate.toISOString())
      .lt('date', nextDay.toISOString())
      .neq('status', 'cancelada');

    if (excludeAppointmentId) {
      query = query.neq('id', excludeAppointmentId);
    }

    return from(query).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).length === 0;
      }),
      catchError(error => {
        console.error('Error checking time slot availability:', error);
        return throwError(() => error);
      })
    );
  }

  getAvailableTimeSlots(doctorId: string, date: Date, excludeAppointmentId?: string): Observable<string[]> {
    const allSlots = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30'
    ];

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let query = this.supabase.getClient()
      .from(this.TABLE_NAME)
      .select('time')
      .eq('doctor_id', doctorId)
      .gte('date', selectedDate.toISOString())
      .lt('date', nextDay.toISOString())
      .neq('status', 'cancelada');

    if (excludeAppointmentId) {
      query = query.neq('id', excludeAppointmentId);
    }

    return from(query).pipe(
      map(response => {
        if (response.error) throw response.error;
        const bookedSlots = (response.data || []).map((item: any) => item.time);
        return allSlots.filter(slot => !bookedSlots.includes(slot));
      }),
      catchError(error => {
        console.error('Error fetching available time slots:', error);
        return throwError(() => error);
      })
    );
  }

  private mapToAppointment(data: any): Appointment {
    let appointmentDate: Date;
    if (data.date) {
      if (typeof data.date === 'string') {
        const dateStr = data.date.split('T')[0];
        const [year, month, day] = dateStr.split('-').map(Number);
        appointmentDate = new Date(year, month - 1, day);
      } else if (data.date instanceof Date) {
        appointmentDate = new Date(data.date);
      } else {
        appointmentDate = new Date(data.date);
      }
    } else {
      appointmentDate = new Date();
    }

    return {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name,
      doctorId: data.doctor_id,
      doctorName: data.doctor_name,
      date: appointmentDate,
      time: data.time,
      status: data.status,
      reason: data.reason,
      notes: data.notes
    };
  }

  private mapToSupabase(appointment: Partial<Appointment>): any {
    const data: any = {};
    
    if (appointment.patientId !== undefined) data.patient_id = appointment.patientId;
    if (appointment.patientName !== undefined) data.patient_name = appointment.patientName;
    if (appointment.doctorId !== undefined) data.doctor_id = appointment.doctorId;
    if (appointment.doctorName !== undefined) data.doctor_name = appointment.doctorName;
    if (appointment.date !== undefined) {
      const date = appointment.date instanceof Date ? appointment.date : new Date(appointment.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      data.date = `${year}-${month}-${day}`;
    }
    if (appointment.time !== undefined) data.time = appointment.time;
    if (appointment.status !== undefined) data.status = appointment.status;
    if (appointment.reason !== undefined) data.reason = appointment.reason;
    if (appointment.notes !== undefined) data.notes = appointment.notes;

    return data;
  }
}
