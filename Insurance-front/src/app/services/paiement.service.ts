import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paiement {
  id?: number;
  numContrat: number;
  montant: number;
  numtel: number;
  mail: string;
  confirmationMail: string;
  datePaiement?: string;
  contrat: { numContrat: number };
  rib: string; 
}
@Injectable({
  providedIn: 'root'
})
export class PaiementService {
   apiUrl = 'http://localhost:8011/paiements'; 

  constructor(private http: HttpClient) {}

 
  createPaiement(paiement: Paiement): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/create`, paiement);
  }
  createPaymentIntent(amount: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/create-payment-intent?amount=${amount}`, {}, { responseType: 'text' });
  }

  
  getAllPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/all`);
  }

  
  getPaiementById(id: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/${id}`);
  }


  updatePaiement(id: number, paiement: Paiement): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}/update/${id}`, paiement);
  }

 
  deletePaiement(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${id}`);
  }
}
