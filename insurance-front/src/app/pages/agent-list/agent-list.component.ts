import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { OurUsers } from 'src/app/models/user.model';
import { AgencyService } from 'src/app/services/agency.service';
import { Agency } from 'src/app/models/agency.model';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})
export class AgentListComponent implements OnInit {
  
  users: OurUsers[] = [];
  agencies: Agency[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  selectedAgencyId: number | null = null;
  selectedUser: OurUsers | null = null;
  showAgencyModal: boolean = false;
  
  constructor(
    private userService: UserService,
    private agencyService: AgencyService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadAgencies();
  }
  
  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data.filter(user => user.role === 'AGENT');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadAgencies(): void {
    this.agencyService.getAgencys().subscribe({
      next: (agencies) => {
        this.agencies = agencies;
      },
      error: (error) => {
        console.error('Error loading agencies:', error);
      }
    });
  }
  
  assignAgency(user: OurUsers): void {
    this.selectedUser = user;
    this.showAgencyModal = true;
  }
  
  confirmAssignment(): void {
    if (this.selectedUser && this.selectedAgencyId) {
      this.userService.assignAgency(this.selectedUser.iduser, this.selectedAgencyId).subscribe({
        next: (updatedUser) => {
          // Update the user in the list
          const index = this.users.findIndex(u => u.iduser === this.selectedUser?.iduser);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.closeModal();
        },
        error: (error) => {
          console.error('Error assigning agency:', error);
          alert('Failed to assign agency. Please try again.');
        }
      });
    }
  }
  
  closeModal(): void {
    this.showAgencyModal = false;
    this.selectedUser = null;
    this.selectedAgencyId = null;
  }
}