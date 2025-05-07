import { Component, OnInit } from '@angular/core';
import { RatingService, Rating } from 'src/app/services/rating.service';
import { ClaimService } from 'src/app/services/claim.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Claim } from 'src/app/models/claim.model';

interface RatingViewModel {
  id?: number;
  claimId: number;
  rating: number;
  feedback?: string;
  createdAt?: string;
  userName?: string;
  userEmail?: string;
  claimDescription?: string;
}

@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.css']
})
export class RatingListComponent implements OnInit {
  ratings: RatingViewModel[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  averageRating: number = 0;
  Math = Math;

  constructor(
    private ratingService: RatingService,
    private claimService: ClaimService
  ) { }

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // For now, we're getting ratings from localStorage
    const ratingsFromStorage = JSON.parse(localStorage.getItem('claimRatings') || '[]');
    
    if (ratingsFromStorage.length === 0) {
      this.isLoading = false;
      return;
    }

    // Create an array of observables to get claim details for each rating
    const ratingObservables: Observable<RatingViewModel>[] = ratingsFromStorage.map((rating: Rating) => {
      return this.claimService.getClaim(rating.claimId).pipe(
        map(claim => {
          return {
            ...rating,
            userName: claim.user ? `${claim.user.name} ${claim.user.lastname}` : 'Unknown',
            userEmail: claim.user ? claim.user.email : 'Unknown',
            claimDescription: claim.description
          } as RatingViewModel;
        }),
        catchError(error => {
          console.error(`Error fetching claim ${rating.claimId}:`, error);
          return of({
            ...rating,
            userName: 'Unknown',
            userEmail: 'Unknown',
            claimDescription: 'Not available'
          } as RatingViewModel);
        })
      );
    });

    // Execute all requests in parallel
    forkJoin(ratingObservables).subscribe({
      next: (results) => {
        this.ratings = results;
        this.calculateAverageRating();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading ratings:', error);
        this.errorMessage = 'Failed to load ratings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  calculateAverageRating(): void {
    if (this.ratings.length === 0) {
      this.averageRating = 0;
      return;
    }
    
    const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }

  getRatingStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }
}