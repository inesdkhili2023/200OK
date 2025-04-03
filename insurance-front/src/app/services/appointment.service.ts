import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
private baseUrl = 'http://localhost:8081/appointments';

constructor(private http: HttpClient) {}
createAppointment(appointment: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/create`, appointment).pipe(
    tap(response => {
      console.log('Response from backend:', response);
    })
  );
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
updateAppointmentStatus(id: number, newStatus: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}/status`, newStatus, { responseType: 'text' });
}

}
