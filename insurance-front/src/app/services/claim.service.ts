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
    
    // Clean the claim object for submission
    const cleanClaim = {
      description: claim.description,
      claimType: claim.claimType,
      claimStatus: claim.claimStatus,
      dateCreation: claim.dateCreation || new Date().toISOString()
      // Don't send claimId or user, backend will handle those
    };
    
    console.log('Sending claim data:', JSON.stringify(cleanClaim));
    
    return this.http.post<Claim>(
      `${this.apiUrl}/allRole/save/Claim/${userId}`, 
      cleanClaim, 
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
  
  public deleteClaim(claimId: number | null): Observable<any> {
    if (!claimId) {
      return throwError(() => new Error('Invalid claim ID'));
    }
    
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/allRole/delete/Claim/${claimId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting claim:', error);
          return throwError(() => error);
        })
      );
  }
  
  public getClaim(claimId: number | null): Observable<Claim> {
    if (!claimId) {
      return throwError(() => new Error('Invalid claim ID'));
    }
    
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
    
    // Clean up the claim object to avoid sending user authorities
    // which causes JSON serialization issues with Spring Security
    const cleanClaim = {
      claimId: claim.claimId,
      description: claim.description,
      dateCreation: claim.dateCreation,
      claimStatus: claim.claimStatus,
      claimType: claim.claimType,
      // If we need to include user reference, only send the ID
      userId: claim.user?.iduser
    };
    
    console.log('Sending update data:', JSON.stringify(cleanClaim));
    
    return this.http.put<Claim>(`${this.apiUrl}/allRole/update/Claim`, cleanClaim, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating claim:', error);
          return throwError(() => error);
        })
      );
  }
}