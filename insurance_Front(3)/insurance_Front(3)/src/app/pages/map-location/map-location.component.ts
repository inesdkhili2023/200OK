import { Component, EventEmitter, OnInit, Output, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';

@Component({
  selector: 'app-map-location',
  templateUrl: './map-location.component.html',
  styleUrls: ['./map-location.component.css']
})
export class MapLocationComponent implements OnInit, AfterViewInit {
  @Output() locationSelected = new EventEmitter<{ latitude: number; longitude: number }>();

  private map!: L.Map;
  private marker!: L.Marker;
  hasMarker: boolean = false;

  ngOnInit(): void {
    
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
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
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  private initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map', {
      center: [36.8065, 10.1815],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    
    const geocoder = (L.Control as any).geocoder({
      defaultMarkGeocode: false,
      placeholder: 'Search address...',
      geocoder: new (L.Control as any).Geocoder.Nominatim({
        language: 'fr'
      })
    }).addTo(this.map);

    geocoder.on('markgeocode', (e: any) => {
      const { center, bbox } = e.geocode;
      
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      
      this.marker = L.marker(center).addTo(this.map);
      this.hasMarker = true;
      
      this.map.fitBounds(bbox);
    });

    
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      this.hasMarker = true;
    });

    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  confirmLocation(): void {
    if (this.marker) {
      const { lat, lng } = this.marker.getLatLng();
      this.locationSelected.emit({ latitude: lat, longitude: lng });
    }
  }
}
