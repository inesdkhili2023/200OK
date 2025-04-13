// agent-espace.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { AgentTowingService } from '../../services/agent-towing.service';
import { AuthService } from '../../services/auth.service';
import { ChatComponent } from '../chat/chat.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationBellComponent } from '../notification/notification-bell.component';
import { Subscription } from 'rxjs';
import { TowingService } from '../../services/towing.service';

@Component({
  selector: 'app-agent-espace',
  templateUrl: './agent-espace.component.html',
  styleUrls: ['./agent-espace.component.css'],
  imports: [CommonModule, FormsModule, ChatComponent, NotificationBellComponent],
  standalone: true
})
export class AgentEspaceComponent implements OnInit, OnDestroy {
  agentName: string = '';
  vehicleType: string = '';
  isLoggedIn: boolean = false;
  map!: L.Map;
  towingRequests: any[] = [];
  isLoading: boolean = false;

  constructor(
    private agentTowingService: AgentTowingService,
    public authService: AuthService,
    private towingService: TowingService
  ) {}

  ngOnInit(): void {
    // On init, check if there's already a logged in agent
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
      setTimeout(() => {
        this.initializeMap();
        this.loadTowingRequests();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    // Clean up map
    if (this.map) {
      this.map.remove();
    }
  }

  login(): void {
    const credentials = { name: this.agentName, vehicleType: this.vehicleType };
    this.agentTowingService.loginAgent(credentials).subscribe({
      next: (data) => {
        // Save agent data in AuthService
        this.authService.agent = data;
        this.isLoggedIn = true;
        setTimeout(() => {
          this.initializeMap();
          this.loadTowingRequests();
        }, 0); // Ensure map container exists
      },
      error: () => {
        alert('Invalid credentials. Please check your name and car type.');
      }
    });
  }

  loadTowingRequests(): void {
    if (!this.authService.isLoggedIn() || !this.authService.agent?.idAgent) {
      return;
    }
    
    this.isLoading = true;
    this.towingService.getAllTowings().subscribe({
      next: (data) => {
        // Filter towing requests for the current logged-in agent
        this.towingRequests = data.filter(towing => 
          towing.agent?.id === this.authService.agent?.idAgent || 
          towing.idAgent === this.authService.agent?.idAgent
        );
        this.isLoading = false;
        
        // Add towing requests to the map
        this.addTowingMarkersToMap();
      },
      error: (error) => {
        console.error('Error loading towing requests:', error);
        this.isLoading = false;
      }
    });
  }
  
  addTowingMarkersToMap(): void {
    if (!this.map || !this.towingRequests.length) return;
    
    // Clear existing markers
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
    
    // Add agent's current location marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          L.marker([lat, lng]).addTo(this.map)
            .bindPopup('Your current location')
            .openPopup();
        }
      );
    }
    
    // Add markers for each towing request
    this.towingRequests.forEach(request => {
      if (request.latitude && request.longitude) {
        const marker = L.marker([request.latitude, request.longitude]).addTo(this.map);
        marker.bindPopup(`
          <strong>Location:</strong> ${request.location}<br>
          <strong>Status:</strong> ${request.status}<br>
          <strong>Date:</strong> ${new Date(request.requestDate).toLocaleString()}
        `);
      }
    });
  }

  initializeMap(): void {
    // Set default icons to use CDN
    const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
    const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
    const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
    
    // Set default icon options
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    
    L.Marker.prototype.options.icon = iconDefault;
    
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
    
    // Destroy the map instance
    if (this.map) {
      this.map.remove();
    }
    
    // Reset form fields
    this.agentName = '';
    this.vehicleType = '';
    this.towingRequests = [];
  }
}
