import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobOfferService } from '../services/job-offer.service';

@Component({
  selector: 'app-job-offer-edit',
  templateUrl: './job-offer-edit.component.html',
  styleUrls: ['./job-offer-edit.component.css']
})
export class JobOfferEditComponent {
  constructor(
    public dialogRef: MatDialogRef<JobOfferEditComponent>,
    @Inject(MAT_DIALOG_DATA) public job: any,private jobOfferService:JobOfferService
  ) {}

  // Method to close the dialog without saving
  closeDialog(): void {
    this.dialogRef.close();
  }

  saveJobOffer(): void {
    console.log('Job avant envoi:', this.job); // Debugging
    
    if (!this.job.jobOfferId) {
      console.error('L’ID du job est undefined ! Vérifie que le job est bien passé à la boîte de dialogue.');
      return;
    }
  
    this.jobOfferService.updateJobOffer(this.job).subscribe(
      () => {
        this.dialogRef.close(this.job);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du job :', error);
      }
    );
  }
  
  
}
