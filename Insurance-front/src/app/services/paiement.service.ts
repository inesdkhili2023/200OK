import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paiement {
  id?: number;
  numContrat: string;
  montant: number;
  rib: string;
  numtel: string;
  mail: string;
  confirmationMail: string;
  stripePaymentId?: string;
  contrat?: { numContrat: string };
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
