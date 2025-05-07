import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Définition de l'interface Ecolia (ajustez les champs selon votre modèle)
export interface Ecolia {
  id: number;
  typeAssuranceId: any;
  details: { [key: string]: string };
  montant: number;
}

@Injectable({
  providedIn: 'root'
})
export class DevisService {

  private apiUrl = 'http://localhost:8011/devis'; // Remplacez par l'URL correcte de votre backend

  constructor(private http: HttpClient) { }

  // Créer un devis
  createDevis(typeAssuranceId: number, details: any): Observable<any> {
    const payload = { typeAssuranceId, details };
    return this.http.post<Ecolia>(`${this.apiUrl}/create`, payload);
  }

  // Valider et payer un devis
  validerEtPayerDevis(devisId: number, montant: number): Observable<string> {
    const payload = { devisId, montant };
    return this.http.post<string>(`${this.apiUrl}/valider-et-payer`, payload);
  }

  // Obtenir un devis par son ID
  getDevisById(id: number): Observable<Ecolia> {
    return this.http.get<Ecolia>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un devis
  updateDevis(id: number, newDetails: { [key: string]: string }): Observable<Ecolia> {
    return this.http.put<Ecolia>(`${this.apiUrl}/update/${id}`, newDetails);
  }

  // Supprimer un devis
  deleteDevis(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${id}`);
  }
}
