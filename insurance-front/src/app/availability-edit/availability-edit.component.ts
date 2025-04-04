import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AvailabilityService } from '../services/availability.service';

@Component({
  selector: 'app-availability-edit',
  templateUrl: './availability-edit.component.html',
  styleUrls: ['./availability-edit.component.css']
})
export class AvailabilityEditComponent {

  constructor(
    public dialogRef: MatDialogRef<AvailabilityEditComponent>,
    private availabilityService: AvailabilityService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loadAvailabilities();
    console.log('Données reçues dans le dialog:', this.data); // Doit contenir l'id

  }

  loadAvailabilities(): void {
    this.availabilityService.getAvailabilities().subscribe((data) => {
      
    });
  }
  save() {
    this.dialogRef.close(this.data); // Retourne les données modifiées
  }
  updateAvailability(updated: any) {
    this.availabilityService.updateAvailability(updated).subscribe(() => {
      this.loadAvailabilities(); // refresh
    });
    this.dialogRef.close(this.data); // Retourne les données modifiées

  }
}
