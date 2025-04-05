import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Claim } from '../models/claim.model';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private http: HttpClient) { }

  private apiUrl = "http://localhost:9090";

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      throw new Error('Authentication token is missing, please login again');
    }
    
    console.log('Using token for authentication:', token);
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  public saveClaim(userId: number, claim: Claim): Observable<Claim> {
    const headers = this.getAuthHeaders();
    return this.http.post<Claim>(
      `${this.apiUrl}/allRole/save/Claim/${userId}`, 
      claim, 
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error saving claim:', error);
        return throwError(() => error);
      })
    );
  }
  
  public getClaims(): Observable<Claim[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Claim[]>(`${this.apiUrl}/allRole/get/Claim`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error getting claims:', error);
          return throwError(() => error);
        })
      );
  }
  
  public deleteClaim(claimId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/allRole/delete/Claim/${claimId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting claim:', error);
          return throwError(() => error);
        })
      );
  }
  
  public getClaim(claimId: number): Observable<Claim> {
    const headers = this.getAuthHeaders();
    return this.http.get<Claim>(`${this.apiUrl}/allRole/get/Claim/${claimId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error getting claim details:', error);
          return throwError(() => error);
        })
      );
  }
  
  public updateClaim(claim: Claim): Observable<Claim> {
    const headers = this.getAuthHeaders();
    return this.http.put<Claim>(`${this.apiUrl}/allRole/update/Claim`, claim, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating claim:', error);
          return throwError(() => error);
        })
      );
  }
}