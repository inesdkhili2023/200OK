import { Component, OnInit } from '@angular/core';
import { Claim, ClaimStatus, ClaimType } from 'src/app/models/claim.model';
import { NgForm } from '@angular/forms';
import { ClaimService } from 'src/app/services/claim.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RatingService } from 'src/app/services/rating.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit{

  isCreateClaim: boolean = true;
  
  claim: Claim = {
    claimId: 0,
    description: '',
    dateCreation: '',
    claimStatus: ClaimStatus.UNTREATED,
    claimType: ClaimType.CLAIM,
    user: undefined  };
    
  claimTypes = Object.values(ClaimType);
  claimStatuses = Object.values(ClaimStatus);
  adminMode: boolean = false;
  constructor(private claimService: ClaimService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private ratingService: RatingService) {

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const claimId = params.get("claimId");
      const isAdmin = params.get("admin") === "true";
  
      if (claimId) {
        this.claimService.getClaim(Number(claimId)).subscribe(
          (res: Claim) => {
            this.claim = res;
            this.isCreateClaim = false;
            if (isAdmin) {
              this.adminMode = true;
            }
          },
          (err: HttpErrorResponse) => {
            console.log(err);
          }
        );
      } else {
        // New claim
        this.isCreateClaim = true;
      }
    });
  }

  saveClaim(ClaimForm: NgForm): void {
    // Set the creation date
    this.claim.dateCreation = new Date().toISOString();
    const observable = this.isCreateClaim
      ? this.claimService.saveClaimAnonymous(this.claim)
      : this.claimService.updateClaim(this.claim);
  
    observable.subscribe({
      next: (res: Claim) => {
        console.log('Claim saved/updated successfully:', res);
        
        ClaimForm.reset();
        this.router.navigate(['user/claim']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error saving/updating claim:', err);
        alert('An error occurred while saving the claim. Please try again.');
      }
    });
  }

  clearForm(ClaimForm: NgForm): void {
    ClaimForm.reset();
    this.router.navigate(['/claim']);
  }
}