import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

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
  return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
    // Log si besoin
    tap(() => console.log(`Rendez-vous avec l'ID ${id} supprimé`)),
    // Gérer les erreurs ici si nécessaire
    catchError((error) => {
      console.error(`Erreur lors de la suppression du rendez-vous ID ${id}:`, error);
      return throwError(() => error); // Rejette l'erreur vers le composant
    })
  );
}

updateAppointmentStatus(id: number, newStatus: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}/status`, newStatus, { responseType: 'text' });
}

}
