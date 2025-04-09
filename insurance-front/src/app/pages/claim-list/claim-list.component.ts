import { Component, OnInit } from '@angular/core';
import { ClaimService } from 'src/app/services/claim.service';
import { Claim } from 'src/app/models/claim.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.css']
})
export class ClaimListComponent implements OnInit {

  dataSource: Claim[] = [];
  displayedColumns: string[] = ['claimId', 'description', 'ClaimStatus', 'claimType', 'edit', 'delete'];
  constructor(private claimService:ClaimService,
      private router: Router) {
      this.getClaimList();
    }
    ngOnInit(): void {
    
    }
    updateClaim(claimId: number): void {
      this.router.navigate(['/claim', {claimId: claimId}]);
    }  

    deleteClaim(claimId: number): void {
      console.log(claimId);
      this.claimService.deleteClaim(claimId).subscribe(
        {
          next: (res) => {
            console.log(res);
            this.getClaimList();
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          }
        }
      );
    }

     getClaimList(): void {
        this.claimService.getClaims().subscribe(
          {
            next: (res: Claim[]) => {
              this.dataSource = res;
            },
            error: (err: HttpErrorResponse)=> {
              console.log(err);
            }
          }
        );
      }

}
