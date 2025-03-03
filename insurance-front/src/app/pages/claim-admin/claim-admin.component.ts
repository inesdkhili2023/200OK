import { Component, OnInit } from '@angular/core';
import { ClaimService } from 'src/app/services/claim.service';
import { Claim, ClaimStatus } from 'src/app/models/claim.model';
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

  constructor(private claimService: ClaimService, private router: Router) {
    this.getClaimList();
  }

  ngOnInit(): void {}

  // Fetch all claims
  getClaimList(): void {
    this.claimService.getClaims().subscribe({
      next: (res: Claim[]) => {
        this.dataSource = res;
        this.filteredClaims = res; // Initialize filtered claims
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
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
}