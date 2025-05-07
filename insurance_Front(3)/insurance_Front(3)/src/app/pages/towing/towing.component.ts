import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Towing } from '../../models/towing.model';
import { TowingService } from '../../services/towing.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

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
  isLoading: boolean = true;

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
    // Load all data in parallel to prevent timing issues
    this.isLoading = true;
    forkJoin({
      agents: this.towingService.getAgents(),
      users: this.towingService.getUsers(),
      towings: this.towingService.getAllTowings()
    }).subscribe({
      next: (results) => {
        this.agents = results.agents;
        this.users = results.users;
        this.towings = results.towings;
        
        // Map agent and user IDs to their respective objects
        this.processTowings();
        this.filteredTowings = [...this.towings];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    });
  }

  // Process towings to add agent and user objects
  processTowings(): void {
    this.towings.forEach(towing => {
      // For each towing request, find the associated agent and user
      const agent = this.agents.find(a => {
        return a.idAgent === towing.idAgent || 
              (towing.agent && a.idAgent === towing.agent.id);
      });
      
      const user = this.users.find(u => {
        return u.idUser === towing.idUser || 
              (towing.user && u.idUser === towing.user.id);
      });
      
      // Add agent and user data to the towing object
      if (agent) {
        towing.agent = { id: agent.idAgent, name: agent.name };
        towing.idAgent = agent.idAgent; // Ensure idAgent is set
      }
      
      if (user) {
        towing.user = { id: user.idUser, name: user.name };
        towing.idUser = user.idUser; // Ensure idUser is set
      }
    });
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
    this.isLoading = true;
    this.towingService.getAllTowings().subscribe({
      next: (data: Towing[]) => {
        this.towings = data;
        this.processTowings();
        this.filteredTowings = [...this.towings];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading towings:', error);
        this.isLoading = false;
      }
    });
  }

  filterTowings(): void {
    if (!this.searchText) {
      this.filteredTowings = this.towings;
      return;
    }
    const search = this.searchText.toLowerCase();
    this.filteredTowings = this.towings.filter(towing =>
      towing.location.toLowerCase().includes(search) ||
      towing.status.toLowerCase().includes(search) ||
      (towing.agent?.name?.toLowerCase().includes(search) || '') ||
      (towing.user?.name?.toLowerCase().includes(search) || '')
    );
  }

  /**
   * Gets the name of the agent for a towing request
   */
  getAgentName(towing: Towing): string {
    if (towing.agent && towing.agent.name) {
      return towing.agent.name;
    }
    
    const agent = this.agents.find(a => a.idAgent === towing.idAgent);
    return agent ? agent.name : 'N/A';
  }

  /**
   * Gets the initial letter of the agent's name for the avatar
   */
  getAgentInitial(towing: Towing): string {
    const agentName = this.getAgentName(towing);
    return agentName && agentName !== 'N/A' ? agentName.charAt(0).toUpperCase() : '?';
  }

  /**
   * Gets the name of the user for a towing request
   */
  getUserName(towing: Towing): string {
    if (towing.user && towing.user.name) {
      return towing.user.name;
    }
    
    const user = this.users.find(u => u.idUser === towing.idUser);
    return user ? user.name : 'N/A';
  }
  
  editTowing(towing: Towing): void {
    this.selectedTowing = { ...towing };
    // Patch the reactive form with the selected towing values.
    this.towingForm.patchValue({
      status: towing.status,
      location: towing.location,
      requestDate: this.formatDateForInput(towing.requestDate),
      idAgent: towing.idAgent || (towing.agent ? towing.agent.id : ''),
      idUser: towing.idUser || (towing.user ? towing.user.id : '')
    });
  }
  
  // Format date string to datetime-local input format
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = moment(dateString);
    return date.isValid() ? date.format('YYYY-MM-DDTHH:mm') : '';
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
      latitude: this.selectedTowing.latitude || 0,
      longitude: this.selectedTowing.longitude || 0,
      // Include agent and user objects
      agent: {
        id: Number(formValue.idAgent),
        name: this.agents.find(a => a.idAgent === Number(formValue.idAgent))?.name || 'Unknown'
      },
      user: {
        id: Number(formValue.idUser),
        name: this.users.find(u => u.idUser === Number(formValue.idUser))?.name || 'Unknown'
      }
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
    if (!confirm('Are you sure you want to delete this towing request?')) {
      return;
    }
    
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
