import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  dynamicStyles = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    textAlign: 'center',
    color: '#003366'
  };
  selectedPreference: string = '';  // Stores selected option
  recommendation: string = '';  // Stores generated recommendation

  getRecommendation() {
    switch (this.selectedPreference) {
      case 'life-insurance':
        this.recommendation = "We recommend our Premium Life Insurance Plan!";
        break;
      case 'car-insurance':
        this.recommendation = "Get our Full Coverage Car Insurance for complete protection.";
        break;
      case 'house-insurance':
        this.recommendation = "Secure your home with our Comprehensive Home Insurance.";
        break;
      default:
        this.recommendation = "Please select a preference to get a recommendation.";
    }
  }
}
