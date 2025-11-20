import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, UserRole, LoginCredentials, AuthResponse } from '../models/user.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TABLE_NAME = 'users';
  private readonly STORAGE_KEY = 'meditrack_auth';
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor(private supabase: SupabaseService) {
    this.loadFromStorage();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .select('*')
        .eq('email', credentials.email)
        .eq('active', true)
        .single()
    ).pipe(
      map(response => {
        if (response.error) {
          throw new Error('Credenciales inválidas');
        }
        
        const user = this.mapToUser(response.data);
        
        // TODO: Implementar autenticación real con Supabase Auth
        // Por ahora, la validación de contraseña debe hacerse en el backend
        // o usando Supabase Auth. Esta es una implementación temporal.
        if (!credentials.password || credentials.password.length < 6) {
          throw new Error('Credenciales inválidas');
        }

        const token = `supabase_jwt_token_${user.id}_${Date.now()}`;
        const authResponse: AuthResponse = { token, user };
        
        this.currentUser = user;
        this.token = token;
        this.saveToStorage();
        
        return authResponse;
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return throwError(() => new Error('Credenciales inválidas'));
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.token;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  private saveToStorage(): void {
    if (this.currentUser && this.token) {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({ user: this.currentUser, token: this.token })
      );
    }
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const { user, token } = JSON.parse(stored);
        this.currentUser = user;
        this.token = token;
      } catch (e) {
        this.logout();
      }
    }
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
}

