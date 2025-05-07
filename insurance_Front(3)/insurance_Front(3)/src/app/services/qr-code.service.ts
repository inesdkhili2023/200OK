import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class QRCodeService {
  // Use a consistent API URL
  private apiUrl = 'http://localhost:8082/qr';
  
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  generateQRCode(): Observable<Blob> {
    // Make API call to generate QR code
    console.log(`Calling QR code endpoint: ${this.apiUrl}/generate`);
    return this.http.get(`${this.apiUrl}/generate`, { 
      responseType: 'blob'
    }) as Observable<Blob>;
  }

  getQRCodeUrl(qrBlob: Blob): SafeUrl {
    const url = URL.createObjectURL(qrBlob);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  requestEmergencyTowing(location: string, latitude: number, longitude: number): Observable<any> {
    // Make API call to request emergency towing
    return this.http.get(`${this.apiUrl}/emergency-towing`, {
      params: {
        location,
        latitude: latitude.toString(),
        longitude: longitude.toString()
      }
    });
  }
} 