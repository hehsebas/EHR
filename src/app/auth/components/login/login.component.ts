import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-5">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-10 max-w-max max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-primary dark:text-primary-light mb-2">{{ 'home.title' | translate }}</h1>
          </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mb-6">
          <div class="mb-5">
            <label for="email" class="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
              {{ 'auth.email' | translate }}
            </label>
            <input
              id="email"
              type="text"
              formControlName="email"
              placeholder="usuario@romed.com"
              class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              [class.border-red-500]="isFieldInvalid('email')"
            />
            <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('email')">
              {{ getFieldError('email') }}
            </span>
          </div>
          <div class="mb-5">
            <label for="password" class="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
              {{ 'auth.password' | translate }}
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              [class.border-red-500]="isFieldInvalid('password')"
            />
            <span class="text-red-500 text-xs mt-1 block" *ngIf="isFieldInvalid('password')">
              {{ getFieldError('password') }}
            </span>
          </div>
          <div class="flex justify-center">
            <button
              type="submit"
              class="max-w-max py-2 px-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg text-base transition-opacity mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              [disabled]="loginForm.invalid || loading">
              <span *ngIf="!loading">{{ 'auth.loginButton' | translate }}</span>
              <span *ngIf="loading">{{ 'common.loading' | translate }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.redirectToDashboard();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe({
      next: () => {
        this.redirectToDashboard();
      },
                  error: (error) => {
                    this.errorMessage = error.message || this.translationService.translate('auth.invalidCredentials');
                    this.loading = false;
                  }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.hasError('required')) {
      return this.translationService.translate('form.required');
    }
    if (field?.hasError('email')) {
      return this.translationService.translate('form.invalidEmail');
    }
    if (field?.hasError('minlength')) {
      return this.translationService.translate('form.minLength', { min: '6' });
    }
    return '';
  }

  private redirectToDashboard(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const roleRoutes: Record<UserRole, string> = {
      [UserRole.DOCTOR]: '/doctor/dashboard',
      [UserRole.PATIENT]: '/paciente/dashboard',
      [UserRole.ADMIN]: '/admin/dashboard'
    };

    this.router.navigate([roleRoutes[user.role] || '/']);
  }
}
