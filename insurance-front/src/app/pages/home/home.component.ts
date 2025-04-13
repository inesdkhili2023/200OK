import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../../services/insurance.service';  // adjust path if needed
import { RecommendationService } from '../../services/recommendation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentImageIndex = 0;
  images = [
    {
      src: '/assets/images/slider-img.jpg',
      title: 'Health Insurance',
      category: 'Healthcare',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit fringilla ligula, nec congue leo pharetra in.'
    },
    {
      src: '/assets/images/slider-img1.jpg',
      title: 'Life Insurance',
      category: 'Lifecare',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit fringilla ligula, nec congue leo pharetra in.'
    },
    {
      src: '/assets/images/slider-img2.jpg',
      title: 'Travel Insurance',
      category: 'Healthcare',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris hendrerit fringilla ligula, nec congue leo pharetra in.'
    }
  ];

  insurances: any[] = [];
  
  // Recommendation modal properties
  showRecommendationModal = false;
  submittingRecommendation = false;
  recommendationSuccess = false;
  recommendationError = false;
  errorMessage = '';
  
  newRecommendation = {
    description: '',
    userPreferences: '',
    dateCreation: new Date(),
    status: 'Pending'
  };
  
  constructor(
    private insuranceService: InsuranceService,
    private recommendationService: RecommendationService
  ) { }

  ngOnInit(): void {
    this.fetchInsurances();
  }

  fetchInsurances() {
    this.insuranceService.getAllInsurances().subscribe(data => {
      this.insurances = data;
    });
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }
  
  // Recommendation modal methods
  openRecommendationModal(): void {
    this.showRecommendationModal = true;
    this.resetFormState();
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }
  
  closeRecommendationModal(): void {
    this.showRecommendationModal = false;
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    this.resetRecommendationForm();
  }
  
  resetFormState(): void {
    this.recommendationSuccess = false;
    this.recommendationError = false;
    this.errorMessage = '';
    this.submittingRecommendation = false;
  }
  
  resetRecommendationForm(): void {
    this.newRecommendation = {
      description: '',
      userPreferences: '',
      dateCreation: new Date(),
      status: 'Pending'
    };
    this.resetFormState();
  }
  
  submitRecommendation(): void {
    if (this.newRecommendation.description && this.newRecommendation.userPreferences) {
      this.submittingRecommendation = true;
      this.recommendationService.addRecommendation(this.newRecommendation).subscribe(
        () => {
          this.submittingRecommendation = false;
          this.recommendationSuccess = true;
          
          // Close modal automatically after 3 seconds on success
          setTimeout(() => {
            if (this.recommendationSuccess) {
              this.closeRecommendationModal();
            }
          }, 3000);
        },
        (error) => {
          this.submittingRecommendation = false;
          this.recommendationError = true;
          this.errorMessage = error.status === 0 
            ? 'Network error. Please check your connection.' 
            : 'An error occurred while submitting your recommendation.';
          console.error('Error submitting recommendation:', error);
        }
      );
    }
  }
}