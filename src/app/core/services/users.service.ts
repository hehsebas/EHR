import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly TABLE_NAME = 'users';

  constructor(private supabase: SupabaseService) {}

  getUsers(): Observable<User[]> {
    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(this.mapToUser);
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  getDoctors(): Observable<User[]> {
    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .select('*')
        .eq('role', UserRole.DOCTOR)
        .eq('active', true)
        .order('name', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return (response.data || []).map(this.mapToUser);
      }),
      catchError(error => {
        console.error('Error fetching doctors:', error);
        return throwError(() => error);
      })
    );
  }

  getUserById(id: string): Observable<User | undefined> {
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
        return this.mapToUser(response.data);
      }),
      catchError(error => {
        console.error('Error fetching user by id:', error);
        return throwError(() => error);
      })
    );
  }

  createUser(userData: Omit<User, 'id'>): Observable<User> {
    const userDbData = this.mapToSupabase(userData);

    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .insert(userDbData)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToUser(response.data);
      }),
      catchError(error => {
        console.error('Error creating user:', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    const updateData = this.mapToSupabase(userData as User);
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
        return this.mapToUser(response.data);
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: string): Observable<boolean> {
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
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role as UserRole,
      avatar: data.avatar,
      active: data.active
    };
  }

  private mapToSupabase(user: Partial<User>): any {
    const data: any = {};
    
    if (user.email !== undefined) data.email = user.email;
    if (user.name !== undefined) data.name = user.name;
    if (user.role !== undefined) data.role = user.role;
    if (user.avatar !== undefined) data.avatar = user.avatar;
    if (user.active !== undefined) data.active = user.active;

    return data;
  }
}

