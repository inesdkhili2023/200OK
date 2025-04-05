import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  // Use a relative URL so that proxy can forward to the Spring Boot backend
  private apiUrl = '/api/examen';

  constructor(private http: HttpClient) { }

  getAllInsurances(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/insurances`);
  }

  createInsurance(insurance: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insurances`, insurance);
  }

  updateInsurance(id: number, insurance: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/insurances/${id}`, insurance);
  }

  deleteInsurance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/insurances/${id}`);
  }

  
}
