import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard  {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    if (user && user.role === 'admin') {
      return true;
    } else {
      this.router.navigate(['/home']); // ou vers une autre page
      return false;
    }
  }
}
