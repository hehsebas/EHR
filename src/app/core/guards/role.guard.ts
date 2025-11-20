import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'] as UserRole;
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (user.role === requiredRole) {
      return true;
    }

    const roleRoutes: Record<UserRole, string> = {
      [UserRole.DOCTOR]: '/doctor/dashboard',
      [UserRole.PATIENT]: '/paciente/dashboard',
      [UserRole.ADMIN]: '/admin/dashboard'
    };

    this.router.navigate([roleRoutes[user.role] || '/']);
    return false;
  }
}

