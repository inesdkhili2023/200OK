import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Agency } from 'src/app/models/agency.model';
import { AgencyService } from 'src/app/services/agency.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  isCreateAgency: boolean = true;
  agencies: Agency[] = [];
  agency: Agency = {
    idAgency: null as unknown as number,
    latitude: 0,
    longitude: 0,
    agencyName: '',
    location: '',
    telephone: 0,
    email:'',
    openingHour:'',  
    closingHour:''
  };
  agencyCount: number = 0;

  private map!: L.Map;

  private customIcon = L.icon({
    iconUrl: 'assets/images/work.png', 
    iconSize: [40, 40],       
    iconAnchor: [20, 40],     
    popupAnchor: [0, -35]     
  });
 constructor(private agencyService: AgencyService, private router: Router, private activatedRoute: ActivatedRoute) {}

 ngOnInit(): void {
  this.loadAgencies();
  this.loadAgencyCount();
  this.activatedRoute.paramMap.subscribe(params => {
    const idAgency = params.get("idAgency");
    if (idAgency) {
      this.agencyService.getAgency(Number(idAgency)).subscribe(
        (res: Agency) => {
          this.agency = res;
          this.isCreateAgency = false;
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
    } else {
      this.isCreateAgency = true;
    }
  });
}
  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [36.8065, 10.1815],
      zoom: 6
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
  
        
          const userIcon = L.icon({
            iconUrl: 'assets/images/user.png', 
            iconSize: [60, 60],      
            iconAnchor: [30, 60],     
            popupAnchor: [0, -60]
          });
  
          
          L.marker([userLat, userLng], { icon: userIcon })
            .addTo(this.map)
            .bindPopup(`<b >You are here</b>`).openPopup();
  
          
          this.map.setView([userLat, userLng], 10);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }
  

  private loadAgencies(): void {
    this.agencyService.getAgencys().subscribe({
      next: (data: Agency[]) => {
        this.agencies = data;
        this.addMarkers();
      },
      error: (err) => console.error(err)
    });
  }

  private addMarkers(): void {
  if (!this.map) return;

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinutes;

  this.agencies.forEach(agency => {
    if (agency.latitude && agency.longitude && agency.email) {
      const [openHour, openMinutes] = agency.openingHour.split(':').map(Number);
      const [closeHour, closeMinutes] = agency.closingHour.split(':').map(Number);
      const openTotalMinutes = openHour * 60 + openMinutes;
      const closeTotalMinutes = closeHour * 60 + closeMinutes;

      const isOpen = currentTotalMinutes >= openTotalMinutes && currentTotalMinutes <= closeTotalMinutes;
      const statusText = isOpen ? "🟢 Open Now" : "🔴 Closed";

      const email = encodeURIComponent(agency.email);
      const mailtoLink = `mailto:${email}`;
      const qrCodeEmail = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${mailtoLink}`;

      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${agency.latitude},${agency.longitude}`;
      const qrCodeMaps = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(mapsUrl)}`;

      L.marker([agency.latitude, agency.longitude], { icon: this.customIcon })
        .addTo(this.map)
        .bindPopup(`
          <div style="font-size: 12px; font-weight: bold;">
            <p><strong>Agency location:</strong> ${agency.location}</p>
            <p><strong>Phone Number:</strong> ${agency.telephone}</p>
            <p><strong>Status:</strong> ${statusText}</p> <!-- Display Open/Closed Status -->
            <p><strong>Opening Hours:</strong> ${agency.openingHour} - ${agency.closingHour}</p> <!-- Show Opening and Closing Hours -->
            <p><strong>Scan to Email (Mobile):</strong></p>
            <img src="${qrCodeEmail}" alt="QR Code Email" width="100" height="100"/>
            <br>
            <a href="${mailtoLink}" class="email-button" style="display:inline-block; padding:8px; background:#007bff; color:white; text-decoration:none; border-radius:5px; margin-top:5px;">Send Email</a>
            <br><br>
            <p><strong>Scan for Directions:</strong></p>
            <img src="${qrCodeMaps}" alt="QR Code Maps" width="100" height="100"/>
            <br>
            <a href="${mapsUrl}" class="maps-button" style="display:inline-block; padding:8px; background:#28a745; color:white; text-decoration:none; border-radius:5px; margin-top:5px;">Get Directions</a>
          </div>`);
    }
  });
}

  
  
  
  private loadAgencyCount(): void {
    this.agencyService.getAgencys().subscribe({
      next: (data: Agency[]) => {
        this.agencyCount = data.length;  
      },
      error: (err) => console.error(err)
    });
  }

}
