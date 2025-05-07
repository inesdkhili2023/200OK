import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobOfferService {
  private baseUrl = 'http://localhost:8081/joboffers'; // URL du backend

  constructor(private http: HttpClient) {}

  addJobOffer(jobOffer: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, jobOffer);
  }

  getJobOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAll`);
  }

  updateJobOffer(jobOffer: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${jobOffer.jobOfferId}`, jobOffer);
  }

  deleteJobOffer(jobOfferId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${jobOfferId}`);
  }
    // Récupérer une offre d'emploi par ID
    getJobById(jobOfferId: any): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/${jobOfferId}`);
    }
}
