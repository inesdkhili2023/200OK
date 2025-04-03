import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SanteFormService {

  private apiUrl = 'http://localhost:8011/devis'; // Remplacez par l'URL correcte du backend

  constructor(private http: HttpClient) { }

  // Envoi des données du formulaire au backend
  envoyerFormulaire(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, payload);
  }
}
