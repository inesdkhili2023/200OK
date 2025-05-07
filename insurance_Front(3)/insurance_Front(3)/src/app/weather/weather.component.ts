import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  weather: any;
  city: string = 'Tunis';  // Ville par défaut
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeather();
  }

  // Méthode pour obtenir la météo
  getWeather(): void {
    this.isLoading = true;
    this.weatherService.getWeatherByCity(this.city).subscribe(
      (data) => {
        this.weather = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Impossible de récupérer les informations météorologiques.';
        this.isLoading = false;
      }
    );
  }
}
