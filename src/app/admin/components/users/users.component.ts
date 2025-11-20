import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { User, UserRole } from '../../../core/models/user.model';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, TranslatePipe],
  template: `
    <div class="max-w-7xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-medium text-gray-900 dark:text-gray-100 m-0">{{ 'admin.userManagement' | translate }}</h1>
        <button 
          class="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white border-none rounded-lg cursor-pointer text-sm font-medium transition-opacity hover:opacity-90" 
          (click)="openAddUserModal()">
          <span class="material-icons text-base">add</span>
          {{ 'admin.newUser' | translate }}
        </button>
      </div>
      <app-card>
        <div class="flex gap-4">
          <select 
            [(ngModel)]="selectedRole" 
            (change)="filterUsers()" 
            class="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="">{{ 'admin.allRoles' | translate }}</option>
            <option value="doctor">{{ 'role.doctor' | translate }}</option>
            <option value="paciente">{{ 'role.patient' | translate }}</option>
            <option value="admin">{{ 'role.admin' | translate }}</option>
          </select>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="filterUsers()"
            [placeholder]="'admin.searchPlaceholder' | translate"
            class="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </app-card>
      <app-card [title]="'nav.users' | translate">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'form.name' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'form.email' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'form.role' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-white-900 dark:text-white-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'form.status' | translate }}</th>
                <th class="px-3 py-3 text-left font-medium text-gray-900 dark:text-gray-100 text-sm border-b-2 border-gray-200 dark:border-gray-700">{{ 'doctor.actions' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of filteredUsers" class="border-b border-gray-200 dark:border-gray-700">
                <td class="px-3 py-3 text-gray-700 dark:text-gray-300">{{ user.name }}</td>
                <td class="px-3 py-3 text-gray-600 dark:text-gray-400">{{ user.email }}</td>
                <td class="px-3 py-3">
                  <span 
                    class="px-3 py-1 rounded-full text-xs font-medium capitalize"
                    [ngClass]="{
                      'bg-blue-600 text-white': user.role === UserRole.DOCTOR,
                      'bg-green-500 text-white': user.role === UserRole.PATIENT,
                      'bg-purple-500 text-white': user.role === UserRole.ADMIN
                    }">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="px-3 py-3">
                  <span 
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    [ngClass]="{
                      'bg-green-500 text-white': user.active,
                      'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300': !user.active
                    }">
                    {{ user.active ? ('form.active' | translate) : ('form.inactive' | translate) }}
                  </span>
                </td>
                <td class="px-3 py-3">
                  <button 
                    class="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white border-none rounded cursor-pointer text-xs mr-2 transition-opacity hover:opacity-90" 
                    (click)="editUser(user)">
                    {{ 'common.edit' | translate }}
                  </button>
                  <button 
                    class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white border-none rounded cursor-pointer text-xs transition-opacity hover:opacity-90" 
                    (click)="deleteUser(user)">
                    {{ 'common.delete' | translate }}
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredUsers.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-600 dark:text-gray-400">{{ 'message.noUsers' | translate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
      <div 
        class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[1000]" 
        *ngIf="showModal" 
        (click)="closeModal()">
        <div 
          class="bg-white dark:bg-gray-800 rounded-lg w-[90%] max-w-lg max-h-[90vh] overflow-y-auto" 
          (click)="$event.stopPropagation()">
          <div class="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 class="m-0 text-xl text-gray-900 dark:text-gray-100">{{ editingUser ? ('admin.editUser' | translate) : ('admin.newUser' | translate) }}</h2>
            <button 
              class="bg-transparent border-none cursor-pointer text-gray-600 dark:text-gray-400 p-1 hover:opacity-80" 
              (click)="closeModal()">
              <span class="material-icons">{{ 'common.close' | translate }}</span>
            </button>
          </div>
          <div class="p-5">
            <form (ngSubmit)="saveUser()">
              <div class="mb-5">
                <label class="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">{{ 'form.name' | translate }}</label>
                <input 
                  type="text" 
                  [(ngModel)]="formUser.name" 
                  name="name" 
                  required 
                  class="w-full px-2.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div class="mb-5">
                <label class="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">{{ 'form.email' | translate }}</label>
                <input 
                  type="email" 
                  [(ngModel)]="formUser.email" 
                  name="email" 
                  required 
                  class="w-full px-2.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div class="mb-5">
                <label class="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">{{ 'form.role' | translate }}</label>
                <select 
                  [(ngModel)]="formUser.role" 
                  name="role" 
                  required
                  class="w-full px-2.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="doctor">{{ 'role.doctor' | translate }}</option>
                  <option value="paciente">{{ 'role.patient' | translate }}</option>
                  <option value="admin">{{ 'role.admin' | translate }}</option>
                </select>
              </div>
              <div class="mb-5">
                <label class="flex items-center text-gray-900 dark:text-gray-100 text-sm">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="formUser.active" 
                    name="active" 
                    class="mr-2"
                  />
                  {{ 'form.activeUser' | translate }}
                </label>
              </div>
              <div class="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  class="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-none rounded-lg cursor-pointer text-sm font-medium transition-opacity hover:opacity-90" 
                  (click)="closeModal()">
                  {{ 'common.cancel' | translate }}
                </button>
                <button 
                  type="submit" 
                  class="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white border-none rounded-lg cursor-pointer text-sm font-medium transition-opacity hover:opacity-90">
                  {{ 'form.save' | translate }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedRole = '';
  searchQuery = '';
  showModal = false;
  editingUser: User | null = null;
  formUser: Partial<User> = {};
  UserRole = UserRole;

  constructor(
    private usersService: UsersService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  filterUsers(): void {
    let filtered = [...this.users];

    if (this.selectedRole) {
      filtered = filtered.filter(u => u.role === this.selectedRole);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        u => u.name.toLowerCase().includes(query) ||
             u.email.toLowerCase().includes(query)
      );
    }

    this.filteredUsers = filtered;
  }

  openAddUserModal(): void {
    this.editingUser = null;
    this.formUser = {
      role: UserRole.PATIENT,
      active: true
    };
    this.showModal = true;
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.formUser = { ...user };
    this.showModal = true;
  }

  deleteUser(user: User): void {
    const message = this.translationService.translate('message.confirmDeleteUser', { name: user.name });
    if (confirm(message)) {
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: () => {
          alert(this.translationService.translate('message.errorDelete'));
        }
      });
    }
  }

  saveUser(): void {
    if (this.editingUser) {
      this.usersService.updateUser(this.editingUser.id, this.formUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: () => {
          alert(this.translationService.translate('message.errorUpdate'));
        }
      });
    } else {
      this.usersService.createUser(this.formUser as Omit<User, 'id'>).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: () => {
          alert(this.translationService.translate('message.errorCreate'));
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
    this.formUser = {};
  }

  getRoleLabel(role: UserRole): string {
    return this.translationService.translate(`role.${role.toLowerCase()}`);
  }
}
