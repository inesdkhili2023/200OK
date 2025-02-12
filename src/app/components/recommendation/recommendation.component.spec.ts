import { Component } from '@angular/core';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent {
  preferences = {
    ageGroup: '',
    coverage: '',
    riskLevel: ''
  };

  recommendations: string[] = [];

  getRecommendations() {
    // Basic logic for recommendations
    this.recommendations = [];

    if (this.preferences.ageGroup === '18-25' && this.preferences.riskLevel === 'High') {
      this.recommendations.push("Comprehensive Youth Plan");
    }
    if (this.preferences.coverage === 'Premium') {
      this.recommendations.push("Elite Protection Package");
    }
    if (this.preferences.riskLevel === 'Low') {
      this.recommendations.push("Standard Secure Plan");
    }

    if (this.recommendations.length === 0) {
      this.recommendations.push("No matching insurance plan found. Please refine your preferences.");
    }
  }
}
