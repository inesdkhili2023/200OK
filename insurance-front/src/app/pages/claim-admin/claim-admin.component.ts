import { Component, OnInit } from '@angular/core';
import { ClaimService } from 'src/app/services/claim.service';
import { Claim, ClaimStatus, ClaimType } from 'src/app/models/claim.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { EmailService } from 'src/app/services/email.service';

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
  
  // Expose enum to template
  ClaimStatus = ClaimStatus;

  constructor(
    private claimService: ClaimService, 
    private router: Router,
    private notificationService: NotificationService,
    private emailService: EmailService
  ) { }

  ngOnInit(): void {
    this.getClaimList();
  }

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

  // Filter claims based on search query and selected status
  filterClaims(): void {
    // First filter by status
    let results = this.selectedStatus 
      ? this.dataSource.filter(claim => claim.claimStatus === this.selectedStatus)
      : [...this.dataSource];
    
    // Then filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      results = results.filter(claim => 
        claim.description?.toLowerCase().includes(query) ||
        claim.user?.name?.toLowerCase().includes(query) ||
        claim.user?.lastname?.toLowerCase().includes(query) ||
        claim.user?.email?.toLowerCase().includes(query) ||
        claim.claimId?.toString().includes(query)
      );
    }
    
    this.filteredClaims = results;
  }

  // Reset all filters
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.filteredClaims = [...this.dataSource];
  }

  // Navigate to edit claim page
  updateClaim(claimId: number | null): void {
    if (!claimId) return;
    this.router.navigate(['/claim', { claimId: claimId, admin: true }]);
  }

  // Delete a claim after confirmation
  deleteClaim(claimId: number | null): void {
    if (!claimId) return;
    
    if (confirm('Are you sure you want to delete this claim? This action cannot be undone.')) {
      this.claimService.deleteClaim(claimId).subscribe({
        next: () => {
          this.getClaimList();
          alert('Claim deleted successfully.');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting claim:', err);
          alert('Failed to delete claim. Please try again.');
        }
      });
    }
  }

  // Get CSS class based on claim status
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

  // Format date string
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

  // Get count of claims by status
  getStatusCount(status: ClaimStatus): number {
    return this.dataSource.filter(claim => claim.claimStatus === status).length;
  }

  // Quick update claim status without navigating to edit page
  quickUpdateStatus(claim: Claim, event: any): void {
    const newStatus = event.target.value;
    
    if (newStatus === claim.claimStatus) {
      return; // No change, do nothing
    }
    
    // Get the status dropdown element
    const statusDropdown = event.target;
    const originalLabel = statusDropdown.value;
    
    // Update the dropdown text to show it's processing
    statusDropdown.style.backgroundColor = '#f8fafc';
    statusDropdown.style.cursor = 'wait';
    statusDropdown.options[statusDropdown.selectedIndex].text = "Updating...";
    statusDropdown.disabled = true;
    
    // Create a copy of the claim with the updated status
    const updatedClaim: Claim = {
      ...claim,
      claimStatus: newStatus as ClaimStatus
    };
    
    this.claimService.updateClaim(updatedClaim).subscribe({
      next: (res: Claim) => {
        // Update local data
        const index = this.dataSource.findIndex(c => c.claimId === claim.claimId);
        if (index !== -1) {
          this.dataSource[index] = res;
          this.filterClaims(); // Refresh filtered list
        }
        
        // Create app notification for the user
        if (claim.user && claim.user.iduser) {
          this.notificationService.notifyClaimUpdate(
            claim.user.iduser,
            claim.claimId as number,
            newStatus
          );
          
          // Send email notification if user has email and name
          if (claim.user.email && (claim.user.name || claim.user.lastname)) {
            const userName = `${claim.user.name || ''} ${claim.user.lastname || ''}`.trim();
            
            // Show sending notification
            statusDropdown.options[statusDropdown.selectedIndex].text = "Sending email...";
            
            this.emailService.sendClaimUpdateEmail(
              claim.user.email,
              userName,
              claim.claimId as number,
              newStatus
            ).subscribe({
              next: (response) => {
                console.log('Email notification sent successfully:', response);
                
                // Reset the dropdown style
                statusDropdown.style.backgroundColor = '';
                statusDropdown.style.cursor = '';
                statusDropdown.disabled = false;
                
                // Show success toast
                this.showToast(`Claim #${claim.claimId} status updated and email notification sent to ${claim.user?.email || 'user'}`);
              },
              error: (err) => {
                console.error('Error sending email notification:', err);
                
                // Reset the dropdown style
                statusDropdown.style.backgroundColor = '';
                statusDropdown.style.cursor = '';
                statusDropdown.disabled = false;
                
                // Show partial success toast
                this.showToast(`Claim #${claim.claimId} status updated but failed to send email notification`);
              }
            });
          } else {
            // Reset the dropdown style
            statusDropdown.style.backgroundColor = '';
            statusDropdown.style.cursor = '';
            statusDropdown.disabled = false;
            
            // Show success toast
            this.showToast(`Claim #${claim.claimId} status updated to ${newStatus}`);
          }
        } else {
          // Reset the dropdown style
          statusDropdown.style.backgroundColor = '';
          statusDropdown.style.cursor = '';
          statusDropdown.disabled = false;
          
          // Show success toast
          this.showToast(`Claim #${claim.claimId} status updated to ${newStatus}`);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating claim status:', err);
        
        // Reset the dropdown style
        statusDropdown.style.backgroundColor = '';
        statusDropdown.style.cursor = '';
        statusDropdown.disabled = false;
        
        // Show error toast
        this.showToast(`Failed to update claim status. Please try again.`, true);
        
        // Reset the select to original value
        event.target.value = claim.claimStatus;
      }
    });
  }

  // Helper method to show a toast message
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
}