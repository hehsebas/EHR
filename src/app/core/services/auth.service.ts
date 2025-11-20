import { Injectable } from '@angular/core';
import { Observable, from, throwError, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
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
    const client = this.supabase.getClient();
    
    return from(
      client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })
    ).pipe(
      switchMap((authResponse) => {
        if (authResponse.error) {
          return throwError(() => new Error(authResponse.error.message || 'Credenciales inválidas'));
        }

        if (!authResponse.data.user) {
          return throwError(() => new Error('No se pudo obtener la información del usuario'));
        }

        const userEmail = authResponse.data.user.email;
        const session = authResponse.data.session;

        if (!session) {
          return throwError(() => new Error('No se pudo crear la sesión'));
        }

        if (!userEmail) {
          return throwError(() => new Error('No se pudo obtener el email del usuario'));
        }

        // Obtener los datos del usuario de la tabla users usando el email
        // ya que el ID de Supabase Auth puede no coincidir con el ID de la tabla
        return from(
          client
            .from(this.TABLE_NAME)
            .select('*')
            .eq('email', userEmail)
            .eq('active', true)
            .single()
        ).pipe(
          switchMap((userResponse) => {
            if (userResponse.error) {
              console.error('Error al buscar usuario en tabla users:', userResponse.error);
              client.auth.signOut().catch(error => {
                console.error('Error al cerrar sesión:', error);
              });
              return throwError(() => new Error(userResponse.error.message || 'Usuario no encontrado o inactivo'));
            }

            if (!userResponse.data) {
              client.auth.signOut().catch(error => {
                console.error('Error al cerrar sesión:', error);
              });
              return throwError(() => new Error('Usuario no encontrado o inactivo'));
            }

            const user = this.mapToUser(userResponse.data);
            const token = session.access_token;
            const authResult: AuthResponse = { token, user };
            
            this.currentUser = user;
            this.token = token;
            this.saveToStorage();
            
            return of(authResult);
          })
        );
      }),
      catchError(error => {
        console.error('Error during login:', error);
        const errorMessage = error.message || 'Credenciales inválidas';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem(this.STORAGE_KEY);
    this.supabase.getClient().auth.signOut().catch(error => {
      console.error('Error al cerrar sesión en Supabase:', error);
    });
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

