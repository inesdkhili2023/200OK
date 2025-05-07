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
    insuranceType: '',  // ensure field exists
    startDate: '', 
    endDate: '', 
    description: ''     // ensure field exists
  };
  selectedInsurance: any = {};
  isEditing: boolean = false;

  constructor(private insuranceService: InsuranceService) {}

  ngOnInit() {
    this.loadInsurances();
  }

  loadInsurances() {
    this.insuranceService.getAllInsurances().subscribe(
      data => this.insurances = data,
      error => console.error('Error loading insurances:', error)
    );
  }

  createInsurance() {
    this.insuranceService.createInsurance(this.newInsurance).subscribe(
      () => {
        this.loadInsurances();
        this.newInsurance = { insuranceType: '', startDate: '', endDate: '', description: '' };
      },
      error => console.error('Error creating insurance:', error)
    );
  }

  updateInsurance() {
    this.insuranceService.updateInsurance(this.selectedInsurance.insuranceId!, this.selectedInsurance).subscribe(
      () => {
        this.loadInsurances();
        this.isEditing = false;
        this.selectedInsurance = { insuranceType: '', startDate: '', endDate: '', description: '' };
      },
      error => console.error('Error updating insurance:', error)
    );
  }

  deleteInsurance(insuranceId: number) {
    this.insuranceService.deleteInsurance(insuranceId).subscribe(
      () => this.loadInsurances(),
      error => console.error('Error deleting insurance:', error)
    );
  }

  editInsurance(insurance: Insurance) {
    this.isEditing = true;
    this.selectedInsurance = { ...insurance };
  }
  cancelEdit() {
    this.isEditing = false;
    this.selectedInsurance = { insuranceType: '', startDate: '', endDate: '', description: '' };
  }
  
}
