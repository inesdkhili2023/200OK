import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentTowingService } from '../../services/agent-towing.service';
import { AgentTowing } from '../../models/agent-towing.model';
import { TowingService } from '../../services/towing.service';
import { Towing } from '../../models/towing.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-agent-towing',
  templateUrl: './agent-towing.component.html',
  styleUrls: ['./agent-towing.component.css']
})
export class AgentTowingComponent implements OnInit {
  page: number = 1; 
  map!: L.Map;
  markers: L.Marker[] = [];
  currentLocationMarker!: L.Marker;
  searchText: string = '';
  filteredAgents: AgentTowing[] = [];
  agents: AgentTowing[] = [];
  towings: Towing[] = [];
  newAgent: AgentTowing = { name: '', contactInfo: '', availability: true, vehicleType: '' };
  selectedAgent: AgentTowing | null = null;
  agentForm!: FormGroup;
  currentLocation: { lat: number; lng: number } | null = null;
  nearestAgent: AgentTowing | null = null;
  farthestAgent: AgentTowing | null = null;
  agentStats: {
    totalAgents: number;
    availableAgents: number;
    averageRating: number;
    totalRequests: number;
  } = {
    totalAgents: 0,
    availableAgents: 0,
    averageRating: 0,
    totalRequests: 0
  };

  constructor(
    private fb: FormBuilder, 
    private agentService: AgentTowingService, 
    private towingService: TowingService
  ) {}

  ngOnInit() {
    this.loadAgents();
    this.displayCurrentLocation();
    this.initMap();
    setTimeout(() => {
      this.loadTowings();
    }, 500);
    this.agentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      contactInfo: ['', [Validators.required, Validators.pattern("^[0-9+()-]{8,15}$")]],
      availability: [true, Validators.required],
      vehicleType: ['', Validators.required]
    });
  }

  displayCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.currentLocation = { lat, lng };
          this.map.setView([lat, lng], 13);
          this.currentLocationMarker = L.marker([lat, lng], {
            icon: L.icon({
              iconUrl: 'assets/images/current-location.png',
              iconSize: [32, 32]
            })
          }).addTo(this.map)
            .bindPopup('Your current location')
            .openPopup();
          
          this.findNearestAndFarthestAgents();
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  findNearestAndFarthestAgents(): void {
    if (!this.currentLocation || !this.agents.length) return;

    let nearest = this.agents[0];
    let farthest = this.agents[0];
    let minDistance = Infinity;
    let maxDistance = 0;

    this.agents.forEach(agent => {
      if (agent.latitude && agent.longitude) {
        const distance = this.calculateDistance(
          this.currentLocation!.lat,
          this.currentLocation!.lng,
          agent.latitude,
          agent.longitude
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearest = agent;
        }

        if (distance > maxDistance) {
          maxDistance = distance;
          farthest = agent;
        }
      }
    });

    this.nearestAgent = nearest;
    this.farthestAgent = farthest;
    this.updateAgentMarkers();
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(value: number): number {
    return value * Math.PI / 180;
  }

  updateAgentMarkers(): void {
    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Add markers for all agents
    this.agents.forEach(agent => {
      if (agent.latitude && agent.longitude) {
        const isNearest = agent === this.nearestAgent;
        const isFarthest = agent === this.farthestAgent;
        
        const customIcon = L.icon({
          iconUrl: isNearest ? 'assets/images/nearest-agent.png' : 
                   isFarthest ? 'assets/images/farthest-agent.png' : 
                   'assets/images/agent.png',
          iconSize: [32, 32]
        });

        const marker = L.marker([agent.latitude, agent.longitude], { icon: customIcon })
          .addTo(this.map)
          .bindPopup(`
            <b>${agent.name}</b><br>
            ${isNearest ? '🏆 Nearest Agent' : ''}
            ${isFarthest ? '🎯 Farthest Agent' : ''}<br>
            Status: ${agent.availability ? 'Available' : 'Busy'}<br>
            Vehicle: ${agent.vehicleType}
          `);

        this.markers.push(marker);
      }
    });
  }

  loadAgents() {
    this.agentService.getAllAgents().subscribe(
      (data) => {
        this.agents = data;
        this.filteredAgents = data;
        this.calculateAgentStats();
      },
      (error) => console.error('Error loading agents:', error)
    );
  }

  calculateAgentStats(): void {
    this.agentStats = {
      totalAgents: this.agents.length,
      availableAgents: this.agents.filter(a => a.availability).length,
      averageRating: this.calculateAverageRating(),
      totalRequests: this.towings.length
    };
  }

  calculateAverageRating(): number {
    // Implement rating calculation logic here
    return 4.5; // Placeholder
  }

  initMap() {
    if (this.map) {
      console.warn("⚠️ Map already initialized!");
      return;
    }

    this.map = L.map('map').setView([36.8065, 10.1815], 6); // Default Tunisia view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    console.log("✅ Map initialized successfully!");
  }

  exportPDF(): void {
    this.agentService.exportPDF().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agent_towings.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error("Error exporting PDF", error);
      }
    });
  }

  loadTowings() {
    this.towingService.getAllTowings().subscribe(
      (data) => {
        this.towings = data;
        this.addMarkers();
      },
      (error) => console.error('❌ Error loading towing requests:', error)
    );
  }

  addMarkers() {
    if (!this.map) {
      console.error("❌ Error: Map not initialized!");
      return;
    }

    this.markers.forEach(marker => marker.remove()); // ✅ Remove previous markers

    console.log("🚀 Adding markers for towings:", this.towings); // ✅ Debugging

    this.towings.forEach(towing => {
      if (towing.latitude !== 0 && towing.longitude !== 0) {
        const customIcon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const marker = L.marker([towing.latitude, towing.longitude], { icon: customIcon })
          .addTo(this.map)
          .bindPopup(`<b>Location: ${towing.location}</b><br>Status: ${towing.status}`);
        this.markers.push(marker);
      } else {
        console.warn("⚠️ Missing coordinates for towing:", towing);
      }
    });
  }

  // ✅ Dynamic Filtering Function
  filterAgents() {
    this.filteredAgents = this.agents.filter(agent =>
      agent.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      agent.contactInfo.toLowerCase().includes(this.searchText.toLowerCase()) ||
      agent.vehicleType.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  createAgent() {
    if (this.agentForm.invalid) {
      alert("Invalid input!");
      return;
    }

    this.agentService.addAgent(this.agentForm.value).subscribe(() => {
      alert("Agent added successfully");
    });
  }

  editAgent(agent: AgentTowing) {
    this.selectedAgent = { ...agent };
  }

  updateAgent() {
    if (!this.selectedAgent || !this.selectedAgent.idAgent) {
      console.error("❌ Error: Invalid agent selection.");
      return;
    }

    this.agentService.updateAgent(this.selectedAgent.idAgent, this.selectedAgent).subscribe(
      () => {
        this.loadAgents();
        this.selectedAgent = null;
      },
      (error) => console.error('❌ Error updating agent:', error)
    );
  }

  deleteAgent(id?: number) {
    if (!id) {
      console.error('❌ Error: ID is undefined');
      return;
    }

    if (confirm("⚠️ Are you sure you want to delete this agent?")) {
      this.agentService.deleteAgent(id).subscribe(
        () => this.loadAgents(),
        (error) => console.error('❌ Error deleting agent:', error)
      );
    }
  }

  cancelEdit() {
    this.selectedAgent = null;
  }

  resetForm() {
    this.newAgent = { name: '', contactInfo: '', availability: true, vehicleType: '' };
  }
}
