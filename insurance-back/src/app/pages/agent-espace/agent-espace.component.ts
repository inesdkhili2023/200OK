// agent-espace.component.ts
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { AgentTowingService } from '../../services/agent-towing.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-agent-espace',
  templateUrl: './agent-espace.component.html',
  styleUrls: ['./agent-espace.component.css']
})
export class AgentEspaceComponent implements OnInit {
  agentName: string = '';
  vehicleType: string = '';
  isLoggedIn: boolean = false;
  map!: L.Map;

  constructor(
    private agentTowingService: AgentTowingService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // On init, check if there's already a logged in agent
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
      // Optionally, assign agent data to a local variable if needed
      // this.agent = this.authService.agent;
      setTimeout(() => this.initializeMap(), 0);
    }
  }

  login(): void {
    const credentials = { name: this.agentName, vehicleType: this.vehicleType };
    this.agentTowingService.loginAgent(credentials).subscribe({
      next: (data) => {
        // Save agent data in AuthService
        this.authService.agent = data;
        this.isLoggedIn = true;
        setTimeout(() => this.initializeMap(), 0); // Ensure map container exists
      },
      error: () => {
        alert('Invalid credentials. Please check your name and car type.');
      }
    });
  }

  initializeMap(): void {
    // Initialize the map in the container with id 'agentMap'
    this.map = L.map('agentMap').setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(this.map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.map.setView([lat, lng], 13);
          L.marker([lat, lng]).addTo(this.map)
            .bindPopup('Your current location')
            .openPopup();
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  logout(): void {
    // Clear agent data from AuthService and update UI
    this.authService.logout();
    this.isLoggedIn = false;
    // Optionally, you could also destroy the map instance:
    if (this.map) {
      this.map.remove();
    }
    // Reset login form fields if needed
    this.agentName = '';
    this.vehicleType = '';
  }
}
