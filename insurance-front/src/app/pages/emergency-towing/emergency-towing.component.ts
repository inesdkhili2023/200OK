import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-emergency-towing',
  template: `
    <div class="emergency-container">
      <div *ngIf="!requestSent && !error" class="emergency-content">
        <h1><i class="fas fa-exclamation-triangle"></i> Emergency Towing</h1>
        <p class="status-message">Getting your location...</p>
        <div class="loading-spinner"></div>
      </div>
      
      <div *ngIf="requestSent" class="success-content">
        <h1><i class="fas fa-check-circle"></i> Help is on the way!</h1>
        <p>Your emergency towing request has been received.</p>
        <p *ngIf="requestId">Request ID: {{requestId}}</p>
        <p>An agent will be dispatched to your location.</p>
        <div class="contact-info">
          <p><i class="fas fa-phone"></i> Emergency Contact: <a href="tel:+1234567890">123-456-7890</a></p>
        </div>
      </div>

      <div *ngIf="error" class="error-content">
        <h1><i class="fas fa-times-circle"></i> Something went wrong</h1>
        <p>{{errorMessage}}</p>
        <button (click)="retryRequest()" class="retry-button">
          <i class="fas fa-redo"></i> Try Again
        </button>
      </div>
    </div>
  `,
  styles: [`
    .emergency-container {
      padding: 20px;
      text-align: center;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa;
      font-family: 'Arial', sans-serif;
    }
    .emergency-content, .success-content, .error-content {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      max-width: 90%;
      width: 400px;
    }
    h1 {
      color: #dc3545;
      margin-bottom: 20px;
      font-size: 1.8rem;
    }
    .success-content h1 {
      color: #28a745;
    }
    .status-message {
      font-size: 1.2rem;
      color: #495057;
      margin-bottom: 20px;
    }
    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #dc3545;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .retry-button {
      background: #dc3545;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 20px;
      font-size: 1rem;
      transition: background 0.3s;
    }
    .retry-button:hover {
      background: #c82333;
    }
    .contact-info {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }
    .contact-info a {
      color: #007bff;
      text-decoration: none;
      font-weight: bold;
    }
  `]
})
export class EmergencyTowingComponent implements OnInit {
  requestSent: boolean = false;
  error: boolean = false;
  errorMessage: string = '';
  requestId: string = '';
  private apiUrl = 'http://localhost:8081/qr';

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.sendEmergencyRequest();
  }

  sendEmergencyRequest() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.submitRequest(location);
        },
        (error) => {
          // Still submit request even if location is not available
          console.warn('Location access denied:', error);
          this.submitRequest(null);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      console.warn('Geolocation not supported by this browser');
      this.submitRequest(null);
    }
  }

  submitRequest(location: any) {
    // The environment.apiUrl already includes the base path
    const emergencyUrl = `${this.apiUrl}/emergency-towing`;
    let params: any = {};
    
    if (location) {
      params = {
        location: `${location.latitude},${location.longitude}`,
        latitude: location.latitude,
        longitude: location.longitude
      };
    } else {
      params = {
        location: 'Location not available'
      };
    }

    console.log('Sending emergency request to:', emergencyUrl, params);

    this.http.get(emergencyUrl, { params }).subscribe(
      (response: any) => {
        this.requestSent = true;
        // Handle the ID based on the database field "id" not "id_towing"
        this.requestId = response.id ? response.id.toString() : '';
        console.log('Emergency request successful:', response);
      },
      (error) => {
        this.error = true;
        this.errorMessage = 'Unable to send emergency request. Please try again or call emergency services directly.';
        console.error('Emergency request failed:', error);
      }
    );
  }

  retryRequest() {
    this.error = false;
    this.errorMessage = '';
    this.sendEmergencyRequest();
  }
} 