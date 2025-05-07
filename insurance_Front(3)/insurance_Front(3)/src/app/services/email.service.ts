import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8085/api/examen';  // Updated to match backend path

  constructor(private http: HttpClient) { }

  sendEmail(to: string, subject: string, body: string): Observable<any> {
    const params = new HttpParams()
      .set('to', to)
      .set('subject', subject)
      .set('body', body);

    return this.http.post<any>(
      `${this.apiUrl}/sendEmail`, 
      null,
      { params }
    ).pipe(
      map(response => {
        // If the response is successful but doesn't have a specific format
        return response || 'Email sent successfully!';
      })
    );
  }
}
