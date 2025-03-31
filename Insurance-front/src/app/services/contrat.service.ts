import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private apiUrl = 'http://localhost:8011/api/contrats'; // Mets l'URL de ton backend

  constructor(private http: HttpClient) {}

  // Récupérer la liste des contrats
  getContrats(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Télécharger un contrat en PDF
  getContratPdf(id: number): Observable<Blob> {
    const url = `${this.apiUrl}/${id}/pdf`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
