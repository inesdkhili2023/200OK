import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment  from 'moment';
import { Recommendation } from '../../models/recommendation.model'; // Your Recommendation interface
import { RecommendationService } from '../../services/recommendation.service'; // Your RecommendationService

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  recommendationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private recommendationService: RecommendationService
  ) {
    // Build the reactive form with required fields.
    this.recommendationForm = this.fb.group({
      description: ['', Validators.required],
      userPreferences: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Initialization if needed.
  }

  submitRecommendation(): void {
    if (this.recommendationForm.invalid) {
      this.recommendationForm.markAllAsTouched();
      alert('Please fill in both the recommendation and your preferences.');
      return;
    }

    const formValue = this.recommendationForm.value;
    // Build the payload without an ID.
    const payload: Recommendation = {
      // Do not include idRec for a new record.
      description: formValue.description,
      userPreferences: formValue.userPreferences,
      dateCreation: moment().toDate(), // Sends a Date object as expected
      status: 'Pending'
    };

    // IMPORTANT: Ensure your RecommendationService.addRecommendation uses the proper URL.
    this.recommendationService.addRecommendation(payload).subscribe(
      (response) => {
        alert('Thank you for your recommendation!');
        this.recommendationForm.reset();
      },
      (error) => {
        console.error('Error submitting recommendation:', error);
        alert('There was an error submitting your recommendation. Please try again later.');
      }
    );
  }
}
