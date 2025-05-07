import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobOfferService } from '../services/job-offer.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent {
  jobForm: FormGroup;
  jobOffer = {
    title: '',
    description: '',
    requirements: '',
    location: '',
    contractType: '',
    applicationDeadline: ''
  };
  constructor(private fb: FormBuilder,private jobOfferService: JobOfferService,private dialogRef: MatDialogRef<AddJobComponent>, private snackBar:MatSnackBar) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      location: ['', Validators.required],
      contractType: ['', Validators.required],
      applicationDeadline: ['', [Validators.required, this.dateValidator]]
    });
  }

  dateValidator(control: any) {
    const today = new Date();
    const inputDate = new Date(control.value);
    if (inputDate <= today) {
      return { invalidDate: 'La date limite doit être dans le futur.' };
    }
    return null;
  }

  onSubmit() {
    if (this.jobForm.valid) {
      console.log('Form values:', this.jobForm.value);  // Log form values before assigning
  
      // Ensure the deadline is formatted as yyyy-mm-dd
      const formattedDeadline = this.formatDate(this.jobForm.value.deadline);
  
      // Update jobOffer with the correctly formatted deadline
      this.jobOffer = { ...this.jobForm.value, deadline: formattedDeadline };
  
      console.log('Job Offer:', this.jobOffer);  // Log to verify the deadline format
  
      this.addJobOffer();
    } else {
      console.log('Le formulaire n\'est pas valide');
    }
  }
  
  
  addJobOffer(): void {
    this.jobOfferService.addJobOffer(this.jobOffer).subscribe(response => {
      console.log('Job Offer Added:', response);
      this.snackBar.open('✅ Offre d\'emploi ajoutée avec succès !', 'Fermer', {
        duration: 4000,
        panelClass: ['success-snackbar'],
      });
      this.jobForm.reset(); // Reset the form after submission
    }, error => {
      console.error('Error adding job offer:', error);
      this.snackBar.open('❌ Une erreur est survenue lors de l\'ajout.', 'Fermer', {
        duration: 4000,
        panelClass: ['error-snackbar'],
       
      }); 
     }
    );
  }
  
  // Helper function to convert date from yyyy/mm/dd to YYYY-MM-DD
  formatDate(date: string): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Get month, pad with leading zero
    const day = String(dateObj.getDate()).padStart(2, '0');  // Get day, pad with leading zero
    return `${year}-${month}-${day}`;  // Return the date in yyyy-mm-dd format
  }
  onCancel(): void {
    this.dialogRef.close(); // Ferme le dialogue
  }
  
}
