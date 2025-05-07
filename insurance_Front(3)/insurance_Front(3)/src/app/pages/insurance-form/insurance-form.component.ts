import { Component } from '@angular/core';
import { InsuranceService } from '../../services/insurance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insurance-form',
  templateUrl: './insurance-form.component.html',
  styles: []
})
export class InsuranceFormComponent {
  newInsurance: any = {
    insuranceType: '',
    startDate: '',
    endDate: '',
    description: ''
  };
  submitted = false;
  formErrors = {
    insuranceType: '',
    startDate: '',
    endDate: '',
    description: ''
  };

  constructor(
    private insuranceService: InsuranceService,
    private router: Router
  ) {}

  validateForm(insurance: any): boolean {
    let isValid = true;
    this.formErrors = {
      insuranceType: '',
      startDate: '',
      endDate: '',
      description: ''
    };

    if (!insurance.insuranceType || insurance.insuranceType.trim().length < 3) {
      this.formErrors.insuranceType = 'Type must be at least 3 characters';
      isValid = false;
    }

    if (!insurance.startDate) {
      this.formErrors.startDate = 'Start date is required';
      isValid = false;
    }

    if (!insurance.endDate) {
      this.formErrors.endDate = 'End date is required';
      isValid = false;
    }

    if (insurance.startDate && insurance.endDate && 
        new Date(insurance.startDate) >= new Date(insurance.endDate)) {
      this.formErrors.endDate = 'End date must be after start date';
      isValid = false;
    }

    if (!insurance.description || insurance.description.trim().length < 10) {
      this.formErrors.description = 'Description must be at least 10 characters';
      isValid = false;
    }

    return isValid;
  }

  createInsurance() {
    this.submitted = true;
    if (!this.validateForm(this.newInsurance)) {
      return;
    }

    this.insuranceService.createInsurance(this.newInsurance).subscribe(
      () => {
        this.router.navigate(['/admin/insurances']);
      },
      error => console.error('Error creating insurance:', error)
    );
  }
}
