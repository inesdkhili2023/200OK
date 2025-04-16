import { Component, OnInit } from '@angular/core';
import { ClaimService } from 'src/app/services/claim.service';
import { Claim, ClaimStatus, ClaimType } from 'src/app/models/claim.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-claim-admin',
  templateUrl: './claim-admin.component.html',
  styleUrls: ['./claim-admin.component.css']
})
export class ClaimAdminComponent implements OnInit {
  dataSource: Claim[] = []; // All claims
  filteredClaims: Claim[] = []; // Filtered claims
  claimStatuses = Object.values(ClaimStatus); // Available claim statuses
  selectedStatus: string = ''; // Selected filter status
  searchQuery: string = ''; 
  isLoading: boolean = true;
  ClaimStatus = ClaimStatus;

  constructor(private claimService: ClaimService, private router: Router) {
    this.getClaimList();
  }

  ngOnInit(): void {}


  getClaimList(): void {
    this.isLoading = true;
    this.claimService.getClaims().subscribe({
      next: (res: Claim[]) => {
        this.dataSource = res;
        this.filteredClaims = [...res];
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading claims:', err);
        this.isLoading = false;
        alert('Failed to load claims. Please refresh the page to try again.');
      }
    });
  }

  // Filter claims by status and search query
  filterClaims(): void {
    this.filteredClaims = this.dataSource.filter(claim => {
      const matchesStatus = !this.selectedStatus || claim.claimStatus === this.selectedStatus;
      const matchesSearch = !this.searchQuery || 
        claim.user?.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        claim.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        claim.claimId.toString().includes(this.searchQuery);
      return matchesStatus && matchesSearch;  
    });
  }

  // Navigate to edit claim page
  updateClaim(claimId: number): void {
    this.router.navigate(['/claim', { claimId: claimId, admin: true }]);
  }

  // Delete a claim
  deleteClaim(claimId: number): void {
    this.claimService.deleteClaim(claimId).subscribe({
      next: (res) => {
        console.log(res);
        this.getClaimList(); // Refresh the list after deletion
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.filteredClaims = [...this.dataSource];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case ClaimStatus.UNTREATED:
        return 'claim-status-untreated';
      case ClaimStatus.TREATED:
        return 'claim-status-treated';
      default:
        return '';
    }
  }

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

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return String(dateString);
    }
  }

  quickUpdateStatus(claim: Claim, event: any): void {
    const newStatus = event.target.value;
  
    if (newStatus === claim.claimStatus) {
      return; // No change, do nothing
    }
  
    const statusDropdown = event.target;
    statusDropdown.style.backgroundColor = '#f8fafc';
    statusDropdown.style.cursor = 'wait';
    statusDropdown.options[statusDropdown.selectedIndex].text = "Updating...";
    statusDropdown.disabled = true;
  
    const updatedClaim: Claim = {
      ...claim,
      claimStatus: newStatus as ClaimStatus
    };
  
    this.claimService.updateClaim(updatedClaim).subscribe({
      next: (res: Claim) => {
        const index = this.dataSource.findIndex(c => c.claimId === claim.claimId);
        if (index !== -1) {
          this.dataSource[index] = res;
          this.filterClaims();
        }
  
        // Reset the dropdown style
        statusDropdown.style.backgroundColor = '';
        statusDropdown.style.cursor = '';
        statusDropdown.disabled = false;
  
        this.showToast(`Claim #${claim.claimId} status updated to ${newStatus}`);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating claim status:', err);
  
        statusDropdown.style.backgroundColor = '';
        statusDropdown.style.cursor = '';
        statusDropdown.disabled = false;
  
        this.showToast(`Failed to update claim status. Please try again.`, true);
  
        event.target.value = claim.claimStatus;
      }
    });
  }
  private showToast(message: string, isError: boolean = false): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-message ${isError ? 'toast-error' : 'toast-success'}`;
    toast.innerText = message;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 5000);
  }

  getStatusCount(status: ClaimStatus): number {
    return this.dataSource.filter(claim => claim.claimStatus === status).length;
  }


}