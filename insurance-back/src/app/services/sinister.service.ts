import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sinister } from '../models/sinister.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SinisterService {
  // Use the API base URL defined in the environment
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllSinisters(): Observable<Sinister[]> {
    return this.http.get<Sinister[]>(`${this.apiUrl}/sinisters`);
  }

  createSinister(sinister: Sinister): Observable<Sinister> {
    return this.http.post<Sinister>(`${this.apiUrl}/addsinister`, sinister);
  }

  updateSinister(id: number, sinister: Sinister): Observable<Sinister> {
    return this.http.put<Sinister>(`${this.apiUrl}/sinisters/${id}`, sinister);
  }

  deleteSinister(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sinisters/${id}`);
  }
}