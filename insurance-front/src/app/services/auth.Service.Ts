// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _agent: any = null;

  set agent(agent: any) {
    this._agent = agent;
    localStorage.setItem('agent', JSON.stringify(agent));
  }

  get agent() {
    if (!this._agent) {
      const stored = localStorage.getItem('agent');
      if (stored) {
        this._agent = JSON.parse(stored);
      }
    }
    return this._agent;
  }

  isLoggedIn(): boolean {
    return !!this.agent;
  }

  logout(): void {
    this._agent = null;
    localStorage.removeItem('agent');
  }
}
