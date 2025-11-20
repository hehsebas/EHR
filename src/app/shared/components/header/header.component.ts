import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService, Language } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 h-16 flex items-center shadow-sm">
      <div class="w-full flex justify-between items-center">
        <div>
          <h1 class="text-2xl md:text-2xl font-medium text-primary dark:text-primary-light m-0">Romed</h1>
        </div>
        <div class="flex items-center gap-4">
          <!-- Language Selector -->
          <div class="relative">
            <select
              [value]="currentLanguage"
              (change)="onLanguageChange($event)"
              class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer appearance-none pr-8"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
            <span class="material-icons absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm pointer-events-none">language</span>
          </div>
          
          <button 
            class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300" 
            (click)="toggleTheme()" 
            [attr.aria-label]="translationService.translate('nav.language')">
            <span class="material-icons">{{ currentTheme === 'light' ? 'dark_mode' : 'light_mode' }}</span>
          </button>
          
          <div class="hidden md:flex flex-col items-end mr-2" *ngIf="currentUser">
            <span class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ currentUser.name }}</span>
            <span class="text-xs text-gray-600 dark:text-gray-400 capitalize">{{ getRoleLabel(currentUser.role) | translate }}</span>
          </div>
          
          <button 
            class="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white border-none px-4 py-2 rounded cursor-pointer text-sm transition-opacity" 
            (click)="logout()" 
            *ngIf="currentUser">
            <span class="material-icons text-base">logout</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  currentTheme: 'light' | 'dark' = 'light';
  currentLanguage: Language = 'es';

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.currentTheme = this.themeService.getCurrentTheme();
    this.currentLanguage = this.translationService.getCurrentLanguage();
    
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    this.translationService.getCurrentLanguage$().subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const lang = target.value as Language;
    this.translationService.setLanguage(lang);
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }

  getRoleLabel(role: string): string {
    return this.translationService.translate(`${role.toLowerCase()}`);
  }
}
