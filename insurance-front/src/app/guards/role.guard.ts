import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // 'ADMIN', 'USER', 'AGENT'
    const url = state.url;

    // Cas 1: utilisateur non connecté
    if (!token || !role) {
      // Autoriser uniquement les pages publiques (qui ne commencent pas par /admin, /user ou /agent)
      if (
        url.startsWith('/admin') ||
        url.startsWith('/user') ||
        url.startsWith('/agent')
      ) {
        return this.router.parseUrl('/login');
      }
      return true; // autoriser accès aux pages publiques
    }

    // Cas 2 : utilisateur connecté
    if (role === 'ADMIN') {
      if (url.startsWith('/admin')) return true;
      return this.router.parseUrl('/admin/dashboardAdmin');
    }

    if (role === 'USER') {
      if (url.startsWith('/user')) return true;
      return this.router.parseUrl('/user/dashboard');
    }

    if (role === 'AGENT') {
      if (url.startsWith('/agent')) return true;
      return this.router.parseUrl('/agent/dashboardAgent');
    }

    // Si role inconnu
    return this.router.parseUrl('/login');
  }
}
