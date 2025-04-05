import { Component, OnInit } from '@angular/core';
import { Claim, ClaimStatus, ClaimType } from 'src/app/models/claim.model';
import { NgForm } from '@angular/forms';
import { ClaimService } from 'src/app/services/claim.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { OurUsers } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from 'src/app/services/users.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {

  isCreateClaim: boolean = true;
  users: OurUsers[] = [];
  currentUser: any = null;
  
  claim: Claim = {
    claimId: 0,
    description: '',
    dateCreation: '',
    claimStatus: ClaimStatus.UNTREATED,
    claimType: ClaimType.CLAIM,
    user: undefined  
  };
    
  claimTypes = Object.values(ClaimType);
  claimStatuses = Object.values(ClaimStatus);
  adminMode: boolean = false;

  constructor(
    private claimService: ClaimService,
    private userService: UserService,
    private usersService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load the current user profile
    const token = localStorage.getItem('token');
    if (token) {
      this.usersService.getYourProfile(token).then((response) => {
        if (response && response.ourUsers) {
          this.currentUser = response.ourUsers;
          console.log('Current user:', this.currentUser);
        }
      }).catch((error) => {
        console.error('Error loading current user:', error);
      });
    } else {
      // Redirect to login if not logged in
      this.router.navigate(['/login']);
      return;
    }

    this.activatedRoute.paramMap.subscribe(params => {
      const claimId = params.get("claimId");
      const isAdmin = params.get("admin") === "true";
  
      if (claimId) {
        // Fetch claim manually using the service
        this.claimService.getClaim(Number(claimId)).subscribe(
          (res: Claim) => {
            this.claim = res;
            this.isCreateClaim = false;
            if (isAdmin) {
              // Admin is editing, allow status change
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
    // Check if we have the current user
    if (!this.currentUser || !this.currentUser.iduser) {
      console.error('Current user information not available');
      alert('Please log in to submit a claim.');
      this.router.navigate(['/login']);
      return;
    }
  
    // Set the creation date
    this.claim.dateCreation = new Date().toISOString();
  
    // Log the claim being saved
    console.log('Saving claim for user ID:', this.currentUser.iduser);
  
    // Save or update the claim
    const observable = this.isCreateClaim
      ? this.claimService.saveClaim(this.currentUser.iduser, this.claim)
      : this.claimService.updateClaim(this.claim);
  
    observable.subscribe({
      next: (res: Claim) => {
        console.log('Claim saved/updated successfully:', res);
        ClaimForm.reset();
        this.router.navigate(['/claim-list']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error saving/updating claim:', err);
        alert('An error occurred while saving the claim. Please try again.');
      }
    });
  }

  clearForm(ClaimForm: NgForm): void {
    ClaimForm.reset();
    this.claim = {
      claimId: 0,
      description: '',
      dateCreation: '',
      claimStatus: ClaimStatus.UNTREATED,
      claimType: ClaimType.CLAIM,
      user: undefined  
    };
    this.router.navigate(['/claim']);
  }
}
