import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recommendation } from '../models/recommendation.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = 'http://localhost:8082/api/recommendations';  // ✅ Fix the API URL

  constructor(private http: HttpClient) {}

  getAllRecommendations(): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${this.apiUrl}/all`);  // ✅ Ensure '/all' is used correctly
  }

  addRecommendation(recommendation: Recommendation): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${this.apiUrl}/add`, recommendation);
  }

  updateRecommendation(id: number, recommendation: Recommendation): Observable<Recommendation> {
    return this.http.put<Recommendation>(`${this.apiUrl}/update/${id}`, recommendation);
  }

  deleteRecommendation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
