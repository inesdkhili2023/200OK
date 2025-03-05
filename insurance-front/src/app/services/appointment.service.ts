import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
private baseUrl = 'http://localhost:8081/appointments';

constructor(private http: HttpClient) {}
createAppointment(appointment: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/create`, appointment);
}

getAppointments(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/getAll`);
}

updateAppointment(appointment: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/${appointment.id}`, appointment);
}

deleteAppointment(id: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}`);
}
}
