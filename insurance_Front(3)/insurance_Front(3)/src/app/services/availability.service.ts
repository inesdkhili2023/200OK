import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = 'http://localhost:8081/availabilities'; 

  constructor(private http: HttpClient) {}

  getAvailabilities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }
  getAvailabilitiesByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/availabilities/filter?status=${status}`);
  }

  getAvailabilitiesByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?date=${date}`);
  }
  // Method to send availability data to the backend
  addAvailability(availability: { date: string, startTime: string, endTime: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, availability);
    
  }
  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }
  updateAvailability(availability: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${availability.id}`, availability);
  }

 
}
