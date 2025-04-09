import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class QRCodeService {
  // Use environment.apiUrl to work with the proxy
  private apiUrl = 'http://localhost:8081/qr';
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  generateQRCode(): Observable<Blob> {
    // This will be rewritten by the proxy to the correct endpoint
    console.log(`Calling QR code endpoint: ${this.apiUrl}/generate`);
    return this.http.get(`${this.apiUrl}/generate`, { 
      responseType: 'blob'
    });
  }

  getQRCodeUrl(qrBlob: Blob): SafeUrl {
    const url = URL.createObjectURL(qrBlob);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  requestEmergencyTowing(location: string, latitude: number, longitude: number): Observable<any> {
    // This will be rewritten by the proxy to the correct endpoint
    return this.http.get(`${this.apiUrl}/emergency-towing`, {
      params: {
        location,
        latitude: latitude.toString(),
        longitude: longitude.toString()
      }
    });
  }
} 