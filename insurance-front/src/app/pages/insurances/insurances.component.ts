import { Component, OnInit } from '@angular/core';
import { InsuranceService } from '../../services/insurance.service';
import { Insurance } from '../../models/insurance.model';

@Component({
  selector: 'app-insurances',
  templateUrl: './insurances.component.html',
  styleUrls: ['./insurances.component.css']
})
export class InsurancesComponent implements OnInit {
  insurances: any[] = [];
  newInsurance: any = {
    insuranceType: '',
    startDate: '',
    endDate: '',
    description: ''
  };
  selectedInsurance: any = {};
  isEditing: boolean = false;
  submitted = false;
  editSubmitted = false;
  formErrors = {
    insuranceType: '',
    startDate: '',
    endDate: '',
    description: ''
  };

  constructor(private insuranceService: InsuranceService) {}

  ngOnInit() {
    this.loadInsurances();
  }

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

  loadInsurances() {
    this.insuranceService.getAllInsurances().subscribe(
      data => this.insurances = data,
      error => console.error('Error loading insurances:', error)
    );
  }

  createInsurance() {
    this.submitted = true;
    if (!this.validateForm(this.newInsurance)) {
      return;
    }

    this.insuranceService.createInsurance(this.newInsurance).subscribe(
      () => {
        this.loadInsurances();
        this.newInsurance = {
          insuranceType: '',
          startDate: '',
          endDate: '',
          description: ''
        };
        this.submitted = false;
      },
      error => console.error('Error creating insurance:', error)
    );
  }

  updateInsurance() {
    this.editSubmitted = true;
    if (!this.validateForm(this.selectedInsurance)) {
      return;
    }

    this.insuranceService.updateInsurance(
      this.selectedInsurance.insuranceId!, 
      this.selectedInsurance
    ).subscribe(
      () => {
        this.loadInsurances();
        this.cancelEdit();
      },
      error => console.error('Error updating insurance:', error)
    );
  }

  deleteInsurance(insuranceId: number) {
    if (confirm('Are you sure you want to delete this insurance?')) {
      this.insuranceService.deleteInsurance(insuranceId).subscribe(
        () => this.loadInsurances(),
        error => console.error('Error deleting insurance:', error)
      );
    }
  }

  editInsurance(insurance: Insurance) {
    this.selectedInsurance = { ...insurance };
    this.isEditing = true;
    this.editSubmitted = false;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editSubmitted = false;
    this.selectedInsurance = {};
  }
}