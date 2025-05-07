import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private apiUrl = environment.apiUrl;  

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

  getInsuranceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/insurances/${id}`);
  }

  getInsuranceImage(type: string): string {
    switch(type.toLowerCase()) {
      case 'car':
        return '/assets/images/insurance-covers/car-cover.jpg';
      case 'house':
      case 'home':
        return '/assets/images/insurance-covers/home-cover.jpg';
      case 'health':
        return '/assets/images/insurance-covers/health-cover.jpg';
      case 'journey':
      
        return '/assets/images/1.jpg'; // Changed this line to use 1.jpg
      case 'life':
        return '/assets/images/insurance-covers/life-cover.jpg';
      default:
        return '/assets/images/insurance-covers/default-cover.jpg';
    }
  }
}
