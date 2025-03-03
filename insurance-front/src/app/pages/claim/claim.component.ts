import { Component, OnInit } from '@angular/core';
import { Claim, ClaimStatus, ClaimType } from 'src/app/models/claim.model';
import { NgForm } from '@angular/forms';
import { ClaimService } from 'src/app/services/claim.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { OurUsers } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit{

  isCreateClaim: boolean = true;
  users: OurUsers[] = [];
  selectedUserId?: number;
  
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
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (res: OurUsers[]) => {
        this.users = res;
        //console.log("Users loaded:", this.users); 
      },
      (err: HttpErrorResponse) => {
        console.error("Error loading users:", err); //
      }
    );
   


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
  logSelectedUserId() {
    console.log('Selected User ID:', this.selectedUserId);
  }
  saveClaim(ClaimForm: NgForm): void {
    console.log('Selected User ID before saving:', this.selectedUserId);
    console.log('Users array:', this.users);
  
    if (!this.selectedUserId) {
      console.error('User ID is required');
      return;
    }
  
    // Ensure the users array is populated
    if (this.users.length === 0) {
      console.error('Users array is empty');
      alert('Users data is still loading. Please try again.');
      return;
    }
  
    // Log all user IDs for debugging
    console.log('User IDs:', this.users.map(user => user.iduser));
  
    // Find the selected user
    const selectedUser = this.users.find(user => user.iduser === Number(this.selectedUserId));
    console.log('Selected User:', selectedUser);
  
    if (!selectedUser) {
      console.error('Selected user not found in the users array');
      alert('Selected user not found. Please try again.');
      return;
    }
  
    // Set the creation date
    this.claim.dateCreation = new Date().toISOString();
  
    // Set the user object
    this.claim.user = selectedUser;
  
    // Log the claim being saved
    console.log('Saving claim:', this.claim);
  
    // Save or update the claim
    const observable = this.isCreateClaim
      ? this.claimService.saveClaim(this.selectedUserId, this.claim)
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
    this.router.navigate(['/claim']);
  }


}
