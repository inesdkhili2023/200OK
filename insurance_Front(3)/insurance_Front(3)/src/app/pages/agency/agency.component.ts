import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { Agency } from 'src/app/models/agency.model';
import { NgForm } from '@angular/forms';
import { AgencyService } from 'src/app/services/agency.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit, AfterViewInit {

  isCreateAgency: boolean = true;
  agencies: Agency[] = [];
  agency: Agency = {
    idAgency: 0,
    latitude: 0,
    longitude: 0,
    agencyName: '',
    location: '',
    telephone: 0,
    email: '',
    openingHour: '',
    closingHour: ''
  };

  private map!: L.Map;

  // Define your custom icon outside of any function so you can reuse it
  private customIcon = L.icon({
    iconUrl: 'assets/images/work.png', // Path to your custom marker image
    iconSize: [40, 40],       // Size of the icon
    iconAnchor: [20, 40],     // The anchor point of the icon
    popupAnchor: [0, -35]     // Popup offset
  });

  constructor(
    private agencyService: AgencyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAgencies();

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

    this.agencies.forEach(agency => {
      if (agency.latitude && agency.longitude) {
        L.marker([agency.latitude, agency.longitude], { icon: this.customIcon })
          .addTo(this.map)
          .bindPopup(`<div style="font-size: 12px; font-weight: bold;">
            <p>Agency location: ${agency.location}</p>
            <p>Phone Number: ${agency.telephone}</p>
          </div>`);
      }
    });
  }

  saveAgency(AgencyForm: NgForm): void {
    if (AgencyForm.valid) {
      console.log('Form Submitted!', this.agency);
      if (this.isCreateAgency) {
        this.agencyService.saveAgency(this.agency).subscribe({
          next: (res: Agency) => {
            console.log(res);
            AgencyForm.reset();
            this.router.navigate(['/admin/agency-list']);
            this.loadAgencies(); // Refresh markers after saving
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          }
        });
      } else {
        this.agencyService.updateAgency(this.agency).subscribe({
          next: (res: Agency) => {
            this.router.navigate(['/agency-list']);
            this.loadAgencies(); // Refresh markers after updating
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          }
        });
      }
    } else {
      this.showValidationPopup();
    }
  }

  clearForm(AgencyForm: NgForm): void {
    AgencyForm.reset();
    this.router.navigate(['/agency']);
  }

  showValidationPopup() {
    const dialogRef = this.dialog.open(ValidationPopupComponent, {
      width: '300px',
      data: { message: 'Please fill in all required fields correctly.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

// Define the pop-up content directly in the component
@Component({
  selector: 'app-validation-popup',
  template: `
    <div class="validation-popup" [@fadeIn]>
      <h2 class="popup-title">Validation Error</h2>
      <p class="popup-message">{{ data.message }}</p>
      <button mat-button class="popup-button" [mat-dialog-close]="true">OK</button>
    </div>
  `,
  styles: [`
    .validation-popup {
      text-align: center;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 300px;
      margin: 0 auto;
    }

    .popup-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #d32f2f;
      margin-bottom: 10px;
    }

    .popup-message {
      font-size: 1rem;
      color: #333333;
      margin-bottom: 20px;
    }

    .popup-button {
      background-color: #d32f2f;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .popup-button:hover {
      background-color: #b71c1c;
    }
  `],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      transition(':enter', [
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ValidationPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}