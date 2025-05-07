import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '903725b17ebed03ca5c165cdc3819fec';  // Remplace avec ta clé API
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  // Méthode pour obtenir les informations météorologiques par ville
  getWeatherByCity(city: string): Observable<any> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=fr`;
    return this.http.get<any>(url);
  }

  // Méthode pour obtenir les informations météorologiques par géolocalisation (latitude, longitude)
  getWeatherByCoordinates(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=fr`;
    return this.http.get<any>(url);
  }
}
