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
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  public saveAgency(agency: Agency): Observable<Agency> {
    const headers = this.getAuthHeaders();
    return this.http.post<Agency>(`${this.apiUrl}/allRole/save/Agency`, agency, { headers })
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
    return this.http.put<Agency>(`${this.apiUrl}/allRole/update/Agency`, agency, { headers })
      .pipe(
        catchError(error => {
          console.error('Error updating agency:', error);
          return throwError(() => error);
        })
      );
  }
}