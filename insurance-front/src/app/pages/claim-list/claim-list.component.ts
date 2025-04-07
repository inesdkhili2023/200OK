import { Component, OnInit } from '@angular/core';
import { ClaimService } from 'src/app/services/claim.service';
import { Claim, ClaimStatus, ClaimType } from 'src/app/models/claim.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.css']
})
export class ClaimListComponent implements OnInit {
  dataSource: Claim[] = [];
  filteredDataSource: Claim[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['claimId', 'description', 'ClaimStatus', 'claimType', 'edit', 'delete'];
  
  constructor(
    private claimService: ClaimService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.getClaimList();
  }
  
  updateClaim(claimId: number): void {
    this.router.navigate(['/claim', {claimId: claimId}]);
  }  

  deleteClaim(claimId: number): void {
    if (confirm('Are you sure you want to delete this claim?')) {
      this.isLoading = true;
      this.claimService.deleteClaim(claimId).subscribe({
        next: () => {
          this.getClaimList();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting claim:', err);
          this.isLoading = false;
          alert('Failed to delete the claim. Please try again.');
        }
      });
    }
  }

  getClaimList(): void {
    this.isLoading = true;
    this.claimService.getClaims().subscribe({
      next: (res: Claim[]) => {
        this.dataSource = res;
        this.filteredDataSource = [...res]; // Initialize filtered data
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading claims:', err);
        this.isLoading = false;
        alert('Failed to load claims. Please refresh the page to try again.');
      }
    });
  }
  
  // Filter claims based on search input
  filterClaims(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    
    if (!searchTerm) {
      this.filteredDataSource = [...this.dataSource];
      return;
    }
    
    this.filteredDataSource = this.dataSource.filter(claim => 
      claim.description.toLowerCase().includes(searchTerm) || 
      claim.claimType.toLowerCase().includes(searchTerm) ||
      claim.claimStatus.toLowerCase().includes(searchTerm)
    );
  }
  
  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  }
  
  // Get CSS class based on claim status
  getStatusClass(status: ClaimStatus): string {
    switch (status) {
      case ClaimStatus.UNTREATED:
        return 'claim-status-untreated';
      case ClaimStatus.INPROGRESS:
        return 'claim-status-inprogress';
      case ClaimStatus.TREATED:
        return 'claim-status-treated';
      default:
        return '';
    }
  }
  
  // Get icon class based on claim type
  getClaimTypeIcon(type: ClaimType): string {
    switch (type) {
      case ClaimType.CLAIM:
        return 'fas fa-file-alt';
      case ClaimType.IDEAS:
        return 'fas fa-lightbulb';
      default:
        return 'fas fa-file';
    }
  }
}