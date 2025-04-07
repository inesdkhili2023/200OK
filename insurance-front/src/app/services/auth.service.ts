import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) { }

  // Other methods...

  // Get the current user's role from JWT token
  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const decodedToken: any = jwt_decode.jwtDecode(token);
      console.log('Decoded token:', decodedToken);
      return decodedToken.role || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if the current user is an admin
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }
}