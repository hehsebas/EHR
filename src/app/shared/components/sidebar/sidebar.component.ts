import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { User, UserRole } from '../../../core/models/user.model';
import { filter, Subscription } from 'rxjs';

interface MenuItem {
  labelKey: string;
  route: string;
  icon: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  template: `
    <aside 
      class="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 relative h-full transition-width duration-300 ease-in-out"
      [class.w-20]="collapsed"
      [class.w-64]="!collapsed">
      <nav class="flex-1 py-4 overflow-y-auto">
        <ul class="list-none p-0 m-0">
          <li *ngFor="let item of menuItems" class="my-1">
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-primary text-white dark:bg-primary-dark"
              [routerLinkActiveOptions]="{exact: false}"
              class="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 no-underline transition-colors gap-4 hover:bg-gray-100 dark:hover:bg-gray-700"
              [class.justify-center]="collapsed"
              [class.px-3]="collapsed"
              [title]="item.labelKey | translate">
              <span class="material-icons text-2xl w-6">{{ item.icon }}</span>
              <span class="text-sm font-medium" [class.hidden]="collapsed" [class.md:block]="!collapsed">{{ item.labelKey | translate }}</span>
            </a>
          </li>
        </ul>
      </nav>
      <button 
        class="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 rounded-full border border-white-900 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer flex items-center justify-center shadow-md z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        (click)="toggleCollapse()" 
        [attr.aria-label]="'Colapsar menú'">
        <span class="material-icons text-base text-dark-500 dark:text-white">{{ collapsed ? 'chevron_right' : 'chevron_left' }}</span>
      </button>
    </aside>
  `,
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {
  collapsed = false;
  menuItems: MenuItem[] = [];
  currentUser: User | null = null;
  private languageSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.updateMenuItems();

    this.languageSubscription = this.translationService.getCurrentLanguage$().subscribe(() => {
      this.updateMenuItems();
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth <= 768) {
          this.collapsed = true;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  private updateMenuItems(): void {
    if (!this.currentUser) return;

    const role = this.currentUser.role;

    const allMenuItems: MenuItem[] = [
      {
        labelKey: 'nav.dashboard',
        route: '/doctor/dashboard',
        icon: 'home',
        roles: [UserRole.DOCTOR]
      },
      {
        labelKey: 'nav.patients',
        route: '/doctor/pacientes',
        icon: 'people',
        roles: [UserRole.DOCTOR]
      },
      {
        labelKey: 'nav.calendar',
        route: '/doctor/calendario',
        icon: 'calendar_today',
        roles: [UserRole.DOCTOR]
      },
      {
        labelKey: 'nav.dashboard',
        route: '/paciente/dashboard',
        icon: 'home',
        roles: [UserRole.PATIENT]
      },
      {
        labelKey: 'nav.history',
        route: '/paciente/historia',
        icon: 'history',
        roles: [UserRole.PATIENT]
      },
      {
        labelKey: 'nav.medications',
        route: '/paciente/medicamentos',
        icon: 'medication',
        roles: [UserRole.PATIENT]
      },
      {
        labelKey: 'nav.appointments',
        route: '/paciente/citas',
        icon: 'event',
        roles: [UserRole.PATIENT]
      },
      {
        labelKey: 'nav.dashboard',
        route: '/admin/dashboard',
        icon: 'dashboard',
        roles: [UserRole.ADMIN]
      },
      {
        labelKey: 'nav.users',
        route: '/admin/users',
        icon: 'admin_panel_settings',
        roles: [UserRole.ADMIN]
      }
    ];

    this.menuItems = allMenuItems.filter(item => item.roles.includes(role));
  }
}
