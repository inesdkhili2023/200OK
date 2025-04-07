import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Agency } from '../models/agency.model';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private apiUrl = "http://localhost:9090";

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Auth token:', token ? token.substring(0, 20) + '...' : 'No token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  public saveAgency(agency: Agency): Observable<Agency> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    // Clean up the agency data - Omit idAgency for new entities
    const cleanAgency = {
      // Only include idAgency if it's a valid ID (not 0, not null)
      ...(agency.idAgency && agency.idAgency > 0 ? { idAgency: agency.idAgency } : {}),
      latitude: typeof agency.latitude === 'string' ? parseFloat(agency.latitude) : agency.latitude,
      longitude: typeof agency.longitude === 'string' ? parseFloat(agency.longitude) : agency.longitude,
      agencyName: agency.agencyName,
      location: agency.location,
      telephone: agency.telephone,
      email: agency.email,
      openingHour: agency.openingHour,
      closingHour: agency.closingHour
    };
    
    console.log('Sending data:', JSON.stringify(cleanAgency));
    
    return this.http.post<Agency>(`${this.apiUrl}/admin/save/Agency`, cleanAgency, { headers })
      .pipe(
        catchError(error => {
          console.error('Error saving agency:', error);
          return throwError(() => error);
        })
      );
  }

  public getAgencys(): Observable<Agency[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Agency[]>(`${this.apiUrl}/allRole/get/Agency`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error getting agencies:', error);
          return throwError(() => error);
        })
      );
  }

  public deleteAgency(agencyId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/allRole/delete/Agency/${agencyId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error deleting agency:', error);
          return throwError(() => error);
        })
      );
  }

  public getAgency(agencyId: number): Observable<Agency> {
    const headers = this.getAuthHeaders();
    return this.http.get<Agency>(`${this.apiUrl}/allRole/get/Agency/${agencyId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error getting agency:', error);
          return throwError(() => error);
        })
      );
  }

  public updateAgency(agency: Agency): Observable<Agency> {
    const headers = this.getAuthHeaders();
    
    // Clean up the agency data to avoid serialization issues
    const cleanAgency = {
      idAgency: agency.idAgency,
      latitude: typeof agency.latitude === 'string' ? parseFloat(agency.latitude) : agency.latitude,
      longitude: typeof agency.longitude === 'string' ? parseFloat(agency.longitude) : agency.longitude,
      agencyName: agency.agencyName,
      location: agency.location,
      telephone: agency.telephone,
      email: agency.email,
      openingHour: agency.openingHour,
      closingHour: agency.closingHour
    };
    
    console.log('Sending update data:', JSON.stringify(cleanAgency));
    
    return this.http.put<Agency>(`${this.apiUrl}/allRole/update/Agency`, cleanAgency, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating agency:', error);
          return throwError(() => error);
        })
      );
  }
}