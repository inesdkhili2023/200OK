import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CapitalisationService {
  private apiUrl = 'http://localhost:8011/devis';
  constructor(private http: HttpClient) { }

  sendCapitalisationData(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, payload);
  }

}
