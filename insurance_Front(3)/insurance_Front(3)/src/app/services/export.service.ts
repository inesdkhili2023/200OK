import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private baseUrl = 'http://localhost:8082/api/towings'; // adjust port if needed

  constructor(private http: HttpClient) { }

  exportTowingsPDF() {
    return this.http.get(`${this.baseUrl}/export/pdf`, { responseType: 'blob' });
  }
}
