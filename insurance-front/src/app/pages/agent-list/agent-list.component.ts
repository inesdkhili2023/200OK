import { Component,OnInit,Inject } from '@angular/core';
import { AgencyListComponent } from '../agency-list/agency-list.component';
import { OurUsers } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { AgencyService } from 'src/app/services/agency.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Agency } from 'src/app/models/agency.model';



@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})
export class AgentListComponent implements OnInit{
  agents: OurUsers[] = []; 
  agencies: Agency[] = []; 
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private userService: UserService,public dialog: MatDialog,private agencyService: AgencyService) {}

  ngOnInit(): void {
    this.loadAgents();
    this.loadAgencies();
    
  }

  loadAgents() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getAgents().subscribe({
      next: (data: OurUsers[]) => {
        this.agents = data || []; // Handle case where data might be null/undefined
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load agents. Please try again later.';
        this.isLoading = false;
        console.error('Error loading agents:', error);
      }
    });
  }
  loadAgencies() {
    this.agencyService.getAgencys().subscribe(
      data => {
        this.agencies = data;
      },
      error => {
        console.error('Error loading agencies:', error);
      }
    );
  }
  openAssignDialog(agent: OurUsers): void {
    const dialogRef = this.dialog.open(AssignAgencyDialog, {
      width: '400px',
      data: { agent, agencies: this.agencies }
    });

    dialogRef.afterClosed().subscribe((agencyId: number) => {
      if (agencyId) {
        this.assignAgency(agent.iduser, agencyId);
      }
    });
  }
  assignAgency(userId: number, agencyId: number): void {
    this.isLoading = true;
    this.userService.assignAgency(userId, agencyId).subscribe(
      () => {
        console.log('Agency assigned successfully');
        this.loadAgents(); // Reload the agent list
        this.isLoading = false;
      },
      (error) => {
        console.error('Error assigning agency:', error);
        this.isLoading = false;
      }
    );
  }
}
@Component({
  selector: 'assign-agency-dialog',
  template: `
  <h2 mat-dialog-title class="dialog-title">Assign Agency</h2>
    <div mat-dialog-content class="dialog-content">
      <p class="dialog-text">Assign <strong>{{ data.agent.name }}</strong> to an agency:</p>
      <mat-form-field appearance="fill" class="agency-select">
        <mat-label>Select Agency</mat-label>
        <mat-select [(value)]="selectedAgency">
          <mat-option *ngFor="let agency of data.agencies" [value]="agency.idAgency">
            {{ agency.agencyName }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button class="cancel-button" (click)="dialogRef.close()">Cancel</button>
      <button mat-button class="assign-button" (click)="assign()" [disabled]="!selectedAgency">Assign</button>
    </div>
  `,
  styles: [`

   .dialog-title {
      background-color: #455a70; 
      color: #ffffff;
      padding: 16px;
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      border-radius: 4px 4px 0 0;
    }

    .dialog-content {
      padding: 20px;
    }

    .dialog-text {
      color: #455a70; 
      font-size: 16px;
      margin-bottom: 20px;
    }

    .agency-select {
      width: 100%;
    }

    .agency-select .mat-form-field-wrapper {
      padding-bottom: 0;
    }

    .agency-select .mat-form-field-outline {
      border-color: #455a70; 
    }

    .agency-select .mat-form-field-label {
      color: #455a70; 
    }

    .agency-select .mat-select-arrow {
      color: #455a70; 
    }

    .agency-select .mat-select-value {
      color: #455a70; 
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .cancel-button {
      color: #455a70;
      border: 1px solid #455a70; 
      border-radius: 4px;
      padding: 8px 16px;
      margin-right: 10px;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .cancel-button:hover {
      background-color: #455a70; 
      color: #ffffff;
    }

    .assign-button {
      background-color: #f38F1D;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      transition: background-color 0.3s ease;
    }

    .assign-button:disabled {
      background-color: #cccccc; 
      cursor: not-allowed;
    }

    .assign-button:not(:disabled):hover {
      background-color: #e07d1a; 
    }
  `]
})
export class AssignAgencyDialog {
  selectedAgency: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<AssignAgencyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Assign the selected agency
  assign(): void {
    if (this.selectedAgency) {
      this.dialogRef.close(this.selectedAgency);
    }
  }
}