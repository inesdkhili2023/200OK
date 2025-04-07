import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Rating {
  id?: number;
  claimId: number;
  rating: number;
  feedback?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = "http://localhost:9090";

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Save a new rating
  saveRating(rating: Rating): Observable<Rating> {
    const headers = this.getAuthHeaders();
    
    // For now, we'll just track ratings locally
    // In a real implementation, this would send to backend
    console.log('Saving rating:', rating);
    
    // Store rating in localStorage temporarily
    const existingRatings = JSON.parse(localStorage.getItem('claimRatings') || '[]');
    const newRating = {
      ...rating,
      id: new Date().getTime(),  // Generate a temporary ID
      createdAt: new Date().toISOString()
    };
    
    existingRatings.push(newRating);
    localStorage.setItem('claimRatings', JSON.stringify(existingRatings));
    
    return new Observable<Rating>(observer => {
      observer.next(newRating);
      observer.complete();
    });
    
    // Uncomment when backend API is ready
    // return this.http.post<Rating>(${this.apiUrl}/user/save/rating, rating, { headers })
    //   .pipe(
    //     catchError(error => {
    //       console.error('Error saving rating:', error);
    //       return throwError(() => error);
    //     })
    //   );
  }

  // Get ratings for a specific claim
  getRatingByClaimId(claimId: number): Observable<Rating | null> {
    const headers = this.getAuthHeaders();
    
    // For now, we'll just retrieve ratings locally
    // In a real implementation, this would fetch from backend
    const existingRatings = JSON.parse(localStorage.getItem('claimRatings') || '[]');
    const rating = existingRatings.find((r: Rating) => r.claimId === claimId) || null;
    
    return new Observable<Rating | null>(observer => {
      observer.next(rating);
      observer.complete();
    });
    
    // Uncomment when backend API is ready
    // return this.http.get<Rating>(${this.apiUrl}/user/get/rating/${claimId}, { headers })
    //   .pipe(
    //     catchError(error => {
    //       console.error('Error getting rating:', error);
    //       return throwError(() => error);
    //     })
    //   );
  }
}