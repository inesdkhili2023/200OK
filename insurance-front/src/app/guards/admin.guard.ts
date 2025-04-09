import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private usersService: UsersService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if the user is authenticated and is an admin
    const isAuthenticated = this.usersService.isAuthenticated();
    const isAdmin = this.usersService.isAdmin();
    
    if (isAuthenticated && isAdmin) {
      return true;
    }
    
    // Redirect to login page if not authenticated or not an admin
    this.router.navigate(['/login']);
    return false;
  }
} 