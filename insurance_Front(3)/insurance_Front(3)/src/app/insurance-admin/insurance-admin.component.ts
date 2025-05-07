import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { InsuranceService } from '../services/insurance.service';
import { SinisterService } from '../services/sinister.service';

@Component({
  selector: 'app-insurance-admin',
  templateUrl: './insurance-admin.component.html',
  styleUrls: ['./insurance-admin.component.css']
})
export class InsuranceAdminComponent implements OnInit, OnDestroy{
  @ViewChild('pieChart') pieChart!: ElementRef;
  
  sinisters: any[] = [];
  chart: any;
  showInsuranceList = false;
  insurances: any[] = [];
  selectedInsurance: any = {};
  isEditing = false;
  showAddForm = false;
  submitted = false;
  newInsurance: any = {
    insuranceType: '',
    startDate: '',
    endDate: '',
    description: ''
  };
  formErrors = {
    insuranceType: '',
    startDate: '',
    endDate: '',
    description: ''
  };
  editingField: { insuranceId?: number, field?: string } = {};
  searchTerm: string = '';
  filteredInsurances: any[] = [];
  focused: string = '';  
  showAlert: boolean = false;
  showDeleteDialog: boolean = false;
  showDeleteSuccess: boolean = false;
  insuranceToDelete: number | null = null;
  pieChartInstance: any;

  constructor(
    private router: Router,
    private insuranceService: InsuranceService,
    private sinisterService: SinisterService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initializeRevenueChart();
    this.loadInsurances();
    this.loadSinisterStats();
  }

  private initializeRevenueChart(): void {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          fill: false,
          borderColor: '#f38F1D',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  loadInsurances() {
    this.insuranceService.getAllInsurances().subscribe(
      data => {
        this.insurances = data;
        this.filteredInsurances = data;
      },
      error => console.error('Error loading insurances:', error)
    );
  }

  loadSinisterStats() {
    this.sinisterService.getSinisterStatsByType().subscribe(
      (data: any) => {
        this.createPieChart(data);
      },
      error => console.error('Error loading sinister statistics:', error)
    );
  }

  createPieChart(data: Map<string, number>) {
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    const backgroundColor = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF'
    ];

    this.pieChartInstance = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: backgroundColor,
          hoverBackgroundColor: backgroundColor
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Distribution of Sinisters by Type'
          }
        }
      }
    });
  }

  toggleInsuranceList() {
    this.showInsuranceList = !this.showInsuranceList;
    if (this.showInsuranceList) {
      this.loadInsurances();
    }
  }

  editInsurance(insurance: any) {
    this.selectedInsurance = { ...insurance };
    this.isEditing = true;
    this.router.navigate(['/admin/add-insurance'], { 
      queryParams: { id: insurance.insuranceId }
    });
  }

  deleteInsurance(insuranceId: number) {
    this.insuranceToDelete = insuranceId;
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.insuranceToDelete = null;
  }

  confirmDelete() {
    if (this.insuranceToDelete) {
      this.insuranceService.deleteInsurance(this.insuranceToDelete).subscribe(
        () => {
          this.showDeleteDialog = false;
          this.showDeleteSuccess = true;
          this.loadInsurances();
         
          setTimeout(() => {
            this.showDeleteSuccess = false;
          }, 3000);
        },
        error => {
          console.error('Error deleting insurance:', error);
        
        }
      );
    }
  }

  addUser(): void {
    console.log('Add user clicked');
  }

  createNewPolicy(): void {
    console.log('Create new policy clicked');
  }

  generateReport(): void {
    console.log('Generate report clicked');
  }

  handleSearch(searchTerm: string): void {
    console.log('Searching for:', searchTerm);
  }

  viewNotifications(): void {
    console.log('Viewing notifications');
  }

  handleProfileAction(): void {
    console.log('Profile action clicked');
  }

  navigate(route: string): void {
    console.log('Navigating to:', route);
  }

  navigateToInsurances(): void {
    this.router.navigate(['/admin/add-insurance']);
  }
  navigateToAddInsurance(): void {
    this.router.navigate(['/add-insurance']);
  }

  viewInsurancesList(): void {
    this.router.navigate(['/insurances']);
  }

  toggleAddInsuranceForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.newInsurance = {
      insuranceType: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    this.submitted = false;
    this.formErrors = {
      insuranceType: '',
      startDate: '',
      endDate: '',
      description: ''
    };
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

  createInsurance() {
    this.submitted = true;
    if (!this.validateForm(this.newInsurance)) {
      return;
    }

    this.insuranceService.createInsurance(this.newInsurance).subscribe(
      () => {
        this.resetForm();
        this.showAddForm = false;
        // Navigate to home page after successful creation
        this.router.navigate(['/home']);
      },
      error => console.error('Error creating insurance:', error)
    );
  }

  startEditing(insurance: any, field: string) {
    this.editingField = {
      insuranceId: insurance.insuranceId,
      field: field
    };
  }

  isEditingField(insurance: any, field: string): boolean {
    return this.editingField.insuranceId === insurance.insuranceId && 
           this.editingField.field === field;
  }

  onEnter(event: any, insurance: any) {
    event.preventDefault();
    event.target.blur(); // Remove focus from input
    this.saveEdit(insurance);
  }

  onBlur(insurance: any) {
    this.saveEdit(insurance);
  }

  saveEdit(insurance: any) {
    if (!this.validateInsurance(insurance)) {
      return;
    }

    const updatedInsurance = { ...insurance }; // Create a copy of the insurance object

    this.insuranceService.updateInsurance(insurance.insuranceId!, updatedInsurance).subscribe(
      (response) => {
        // Update the local insurance object with the response data
        const index = this.insurances.findIndex(i => i.insuranceId === insurance.insuranceId);
        if (index !== -1) {
          this.insurances[index] = response;
        }
        
        // Clear editing state
        this.editingField = {};
        
        // Remplacer l'alert par notre alerte personnalisée
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 3000); // L'alerte disparaît après 3 secondes
      },
      error => {
        console.error('Error updating insurance:', error);
        // Vous pouvez aussi personnaliser l'alerte d'erreur si vous le souhaitez
      }
    );
  }

  validateInsurance(insurance: any): boolean {
    // You can reuse your existing validation logic here
    return this.validateForm(insurance);
  }

  searchInsurances() {
    if (!this.searchTerm) {
      this.filteredInsurances = this.insurances;
      return;
    }
    
    this.filteredInsurances = this.insurances.filter(insurance => 
      insurance.insuranceType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      insurance.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  refreshCharts() {
    // Détruire le graphique existant s'il existe
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
    }

    // Récupérer les nouvelles données
    this.sinisterService.getSinisterStatsByType().subscribe(
      (data) => {
        // Recréer le graphique avec les nouvelles données
        this.createPieChart(data);
      },
      (error) => {
        console.error('Error fetching sinisters:', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy();
    }
  }
}
