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
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RatingDialogComponent } from 'src/app/components/rating-dialog/rating-dialog.component';
import { RatingService } from 'src/app/services/rating.service';
import { NotificationService } from 'src/app/services/notification.service';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {

  isCreateClaim: boolean = true;
  users: OurUsers[] = [];
  currentUser: any = null;
  originalClaimStatus: ClaimStatus | null = null;
  
  claim: Claim = {
    claimId: undefined as any,
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
    private cdr: ChangeDetectorRef,
    private location: Location,
    private dialog: MatDialog,
    private ratingService: RatingService,
    private notificationService: NotificationService,
    private emailService: EmailService
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
            this.originalClaimStatus = res.claimStatus; // Store original status
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
    if (!this.currentUser && !this.adminMode) {
      console.error('Current user information not available');
      this.showToast('Please log in to submit a claim.', true);
      this.router.navigate(['/login']);
      return;
    }
  
    if (!ClaimForm.valid) {
      this.showToast('Please fill in all required fields.', true);
      return;
    }
  
    // Save or update the claim
    const observable = this.isCreateClaim
      ? this.claimService.saveClaim(this.currentUser.iduser, this.claim)
      : this.claimService.updateClaim(this.claim);
  
    observable.subscribe({
      next: (res: Claim) => {
        console.log('Claim saved/updated successfully:', res);
        ClaimForm.reset();
        
        // Show success message
        const action = this.isCreateClaim ? 'submitted' : 'updated';
        this.showToast(`Claim was ${action} successfully!`);
        
        // Check if admin is updating the claim status
        if (!this.isCreateClaim && this.adminMode && 
            this.originalClaimStatus !== null && 
            this.originalClaimStatus !== this.claim.claimStatus && 
            this.claim.user && this.claim.user.iduser) {
          
          // Send in-app notification
          this.notificationService.notifyClaimUpdate(
            this.claim.user.iduser,
            this.claim.claimId as number,
            this.claim.claimStatus
          );
          
          // Send email notification if user has email
          if (this.claim.user.email && (this.claim.user.name || this.claim.user.lastname)) {
            const userName = `${this.claim.user.name || ''} ${this.claim.user.lastname || ''}`.trim();
            
            // Show sending email toast
            this.showToast(`Sending email notification to ${this.claim.user.email}...`);
            
            this.emailService.sendClaimUpdateEmail(
              this.claim.user.email,
              userName,
              this.claim.claimId as number,
              this.claim.claimStatus
            ).subscribe({
              next: (response) => {
                console.log('Email notification sent successfully:', response);
                this.showToast(`Email notification sent to ${this.claim.user?.email || 'user'}`);
              },
              error: (err) => {
                console.error('Error sending email notification:', err);
                this.showToast(`Failed to send email notification`, true);
              }
            });
          }
        }
        
        // Only show rating dialog for new claims from regular users
        if (this.isCreateClaim && !this.adminMode && res.claimId) {
          this.openRatingDialog(res.claimId);
        }
        
        // Navigate according to user role
        if (this.adminMode) {
          this.router.navigate(['/admin/claims']);
        } else {
          this.router.navigate(['/claim-list']);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error saving/updating claim:', err);
        let errorMessage = 'An error occurred while saving the claim.';
        
        if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.message) {
          errorMessage += ' ' + err.message;
        }
        
        this.showToast(errorMessage + ' Please try again.', true);
      }
    });
  }

  // Helper method to show a toast message
  private showToast(message: string, isError: boolean = false): void {
    // Create toast element
    const toast = document.createElement('div');
    `toast.className = toast-message ${isError ? 'toast-error' : 'toast-success'}`;
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

  // Open the rating dialog after claim submission
  openRatingDialog(claimId: number | null | undefined): void {
    if (claimId === null || claimId === undefined) {
      console.error('Cannot open rating dialog: claim ID is undefined or null');
      return;
    }
    
    const dialogRef = this.dialog.open(RatingDialogComponent, {
      width: '400px',
      disableClose: false,
      data: { claimId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Rating submitted:', result);
        this.ratingService.saveRating({
          claimId: claimId,
          rating: result.rating,
          feedback: result.feedback
        }).subscribe({
          next: (rating) => {
            console.log('Rating saved successfully:', rating);
          },
          error: (err) => {
            console.error('Error saving rating:', err);
          }
        });
      } else {
        console.log('Rating skipped');
      }
    });
  }

  goBack(): void {
    // Use Location service to go back
    if (this.adminMode) {
      this.router.navigate(['/admin/claims']);
    } else {
      this.router.navigate(['/claim-list']);
    }
  }

  formatDate(dateString: string): string {
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
      return dateString;
    }
  }

  clearForm(ClaimForm: NgForm): void {
    ClaimForm.reset();
    
    // Reset to default values
    this.claim = {
      claimId: undefined as any,
      description: '',
      dateCreation: '',
      claimStatus: ClaimStatus.UNTREATED,
      claimType: ClaimType.CLAIM,
      user: undefined  
    };
  }
}