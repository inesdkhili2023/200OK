import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private apiUrl = 'http://localhost:8011/factures';  // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer la liste des factures
  getFactures(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
    // Télécharger le PDF d'une facture
    downloadFacturePdf(id: number): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
    }
}
