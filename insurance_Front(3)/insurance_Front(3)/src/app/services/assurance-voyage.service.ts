import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssuranceVoyageService {
  private apiUrl = 'http://localhost:8011/devis'; // Remplace par l'URL de ton backend

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer les données au backend
  submitAssuranceData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }
}
