import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Towing } from '../../models/towing.model';
import { TowingService } from '../../services/towing.service';
import moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-towing',
  templateUrl: './towing.component.html',
  styleUrls: ['./towing.component.css']
})
export class TowingComponent implements OnInit {
  towings: Towing[] = [];
  filteredTowings: Towing[] = [];
  searchText: string = '';
  towingForm: FormGroup;

  agents: any[] = [];
  users: any[] = [];
  selectedTowing: Towing | null = null;
  page: number = 1;

  constructor(
    private fb: FormBuilder,
    private towingService: TowingService,
    private http: HttpClient,
  ) {
    // Define form controls with validators
    this.towingForm = this.fb.group({
      status: ['Pending', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      requestDate: ['', Validators.required],
      idAgent: ['', Validators.required],
      idUser: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTowings();
    this.loadAgents();
    this.loadUsers();
  }
  exportPDF(): void {
    this.towingService.exportPDF().subscribe({
      next: (blob: Blob) => {
        // Create a URL for the blob and trigger a download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'towings.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Export PDF failed', error);
      }
    });
  }
  loadTowings(): void {
    this.towingService.getAllTowings().subscribe(
      (data: Towing[]) => {
        this.towings = data;
        this.filteredTowings = data;
      },
      (error: any) => {
        console.error('Error loading towings:', error);
      }
    );
  }

  filterTowings(): void {
    if (!this.searchText) {
      this.filteredTowings = this.towings;
      return;
    }
    const search = this.searchText.toLowerCase();
    this.filteredTowings = this.towings.filter(towing =>
      towing.location.toLowerCase().includes(search) ||
      towing.status.toLowerCase().includes(search) 
    );
  }

  loadAgents(): void {
    this.towingService.getAgents().subscribe(
      (data: any[]) => { this.agents = data; },
      (error: any) => { console.error('Error loading agents:', error); }
    );
  }

  loadUsers(): void {
    this.towingService.getUsers().subscribe(
      (data: any[]) => { this.users = data; },
      (error: any) => { console.error('Error loading users:', error); }
    );
  }

  /**
   * Gets the name of the agent for a towing request
   */
  getAgentName(towing: Towing): string {
    const agent = this.agents.find(a => a.idAgent === towing.idAgent);
    return agent ? agent.name : 'N/A';
  }

  /**
   * Gets the initial letter of the agent's name for the avatar
   */
  getAgentInitial(towing: Towing): string {
    const agent = this.agents.find(a => a.idAgent === towing.idAgent);
    return agent && agent.name ? agent.name.charAt(0).toUpperCase() : '?';
  }

  /**
   * Gets the name of the user for a towing request
   */
  getUserName(towing: Towing): string {
    const user = this.users.find(u => u.idUser === towing.idUser);
    return user ? user.name : 'N/A';
  }
  
  editTowing(towing: Towing): void {
    this.selectedTowing = { ...towing };
    // Patch the reactive form with the selected towing values.
    this.towingForm.patchValue({
      status: towing.status,
      location: towing.location,
      requestDate: towing.requestDate,  // Adjust format if needed
      idAgent: towing.idAgent,
      idUser: towing.idUser
    });
  }

  updateTowing(): void {
    if (!this.selectedTowing || !this.selectedTowing.id) {
      console.error("Error: No towing selected for update.");
      return;
    }
    if (this.towingForm.invalid) {
      this.showValidationErrors();
      return;
    }

    const formValue = this.towingForm.value;
    // Convert requestDate to the required format.
    const formattedDate = moment(formValue.requestDate, "YYYY-MM-DDTHH:mm", true);
    if (!formattedDate.isValid()) {
      alert("Invalid date format. Please select a valid date.");
      return;
    }
    
    const towingData: Towing = {
      id: this.selectedTowing.id,
      status: formValue.status,
      location: formValue.location,
      requestDate: formattedDate.format("YYYY-MM-DD HH:mm:ss"),
      idAgent: Number(formValue.idAgent),
      idUser: Number(formValue.idUser),
      latitude: 0,
      longitude: 0
    };

    this.towingService.updateTowing(towingData).subscribe(
      (updatedTowing) => {
        console.log('Towing updated successfully:', updatedTowing);
        this.loadTowings();
        this.towingForm.reset({ status: 'Pending' });
        this.selectedTowing = null;
      },
      (error) => {
        console.error('Error updating towing:', error);
      }
    );
  }

  createTowing(): void {
    if (this.towingForm.invalid) {
      this.showValidationErrors();
      return;
    }

    const formValue = this.towingForm.value;
    const formattedDate = moment(formValue.requestDate, "YYYY-MM-DDTHH:mm", true);
    if (!formattedDate.isValid()) {
      alert("Invalid date format. Please select a valid date.");
      return;
    }

    const towingData: Towing = {
      id: undefined,
      status: formValue.status,
      location: formValue.location,
      requestDate: formattedDate.format("YYYY-MM-DD HH:mm:ss"),
      idAgent: Number(formValue.idAgent),
      idUser: Number(formValue.idUser),
      latitude: 0,
      longitude: 0
    };

    this.towingService.addTowing(towingData).subscribe(
      (data) => {
        console.log('Towing added successfully:', data);
        this.loadTowings();
        this.towingForm.reset({ status: 'Pending' });
      },
      (error) => {
        console.error('Error adding towing:', error);
      }
    );
  }

  cancelEdit(): void {
    this.selectedTowing = null;
    this.towingForm.reset({ status: 'Pending' });
  }

  deleteTowing(id: number): void {
    this.towingService.deleteTowing(id).subscribe(
      (response) => {
        console.log("Towing deleted successfully");
        this.loadTowings();
      },
      (error) => {
        console.error("Error deleting towing:", error);
      }
    );
  }

  // This method collects invalid fields and shows an alert.
  private showValidationErrors(): void {
    const invalidFields: string[] = [];
    Object.keys(this.towingForm.controls).forEach(key => {
      const control = this.towingForm.get(key);
      if (control && control.invalid) {
        invalidFields.push(this.getFriendlyFieldName(key));
      }
    });
    alert('Please correct the following fields: ' + invalidFields.join(', '));
    this.towingForm.markAllAsTouched();
  }

  private getFriendlyFieldName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      status: 'Status',
      location: 'Location',
      requestDate: 'Request Date',
      idAgent: 'Agent',
      idUser: 'User'
    };
    return fieldNames[field] || field;
  }
}
