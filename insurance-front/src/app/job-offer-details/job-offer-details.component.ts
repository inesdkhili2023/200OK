import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-job-offer-details',
  templateUrl: './job-offer-details.component.html',
  styleUrls: ['./job-offer-details.component.css']
})
export class JobOfferDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<JobOfferDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public job: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
