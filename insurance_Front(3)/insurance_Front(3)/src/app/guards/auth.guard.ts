// guards/public-only.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const role = localStorage.getItem('role');

    if (role === 'ADMIN') return this.router.parseUrl('/admin/dashboardAdmin');
    if (role === 'USER') return this.router.parseUrl('/user/dashboard');
    if (role === 'AGENT') return this.router.parseUrl('/agent/dashboardAgent');

    return true; // pas connecté → accès autorisé
  }
}
