import { Component, OnInit } from '@angular/core';
import { QRCodeService } from '../../services/qr-code.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-qr-code',
  template: `
    <div class="qr-code-container">
      <div *ngIf="loading" class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Generating QR code...</p>
      </div>
      
      <div *ngIf="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ errorMessage }}</p>
        <button (click)="generateQRCode()" class="retry-button">
          <i class="fas fa-redo"></i> Try Again
        </button>
      </div>
      
      <div *ngIf="qrCodeUrl && !loading && !error" class="qr-code-wrapper">
        <img [src]="qrCodeUrl" alt="Emergency Towing QR Code" class="qr-code-image">
        <div class="qr-code-instructions">
          <h3>Emergency Towing Request</h3>
          <p>Scan this QR code with your phone camera to request immediate roadside assistance.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .qr-code-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      max-width: 400px;
      margin: 0 auto;
    }
    .qr-code-image {
      max-width: 250px;
      height: auto;
      margin: 20px 0;
      border: 1px solid #eee;
      padding: 10px;
      background: white;
    }
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px;
    }
    .loading-spinner i {
      font-size: 2rem;
      color: #007bff;
      margin-bottom: 15px;
    }
    .error-message {
      color: #dc3545;
      margin: 20px 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .error-message i {
      font-size: 2rem;
      margin-bottom: 15px;
    }
    .qr-code-instructions {
      text-align: center;
      color: #495057;
      margin-top: 15px;
    }
    .qr-code-instructions h3 {
      font-size: 1.25rem;
      margin-bottom: 10px;
      color: #212529;
    }
    .retry-button {
      background: #dc3545;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 15px;
      font-size: 0.9rem;
    }
    .retry-button:hover {
      background: #c82333;
    }
  `]
})
export class QRCodeComponent implements OnInit {
  qrCodeUrl: SafeUrl | null = null;
  loading = true;
  error = false;
  errorMessage = 'Failed to generate QR code. Please try again.';

  constructor(private qrCodeService: QRCodeService) {}

  ngOnInit() {
    this.generateQRCode();
  }

  generateQRCode() {
    this.loading = true;
    this.error = false;
    this.qrCodeUrl = null;
    console.log("Starting QR code generation...");

    this.qrCodeService.generateQRCode().subscribe(
      (blob: Blob) => {
        console.log("QR code generated successfully!", blob.type, blob.size);
        this.qrCodeUrl = this.qrCodeService.getQRCodeUrl(blob);
        this.loading = false;
      },
      (error) => {
        console.error('Error generating QR code:', error);
        console.log('Status:', error.status, 'Message:', error.message);
        console.log('URL that failed:', error.url);
        this.error = true;
        this.errorMessage = `Failed to generate QR code: ${error.status} ${error.statusText}`;
        this.loading = false;
      }
    );
  }
} 