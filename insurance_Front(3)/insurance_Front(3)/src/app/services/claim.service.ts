import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Claim } from '../models/claim.model';
import { Observable } from 'rxjs';
import { OurUsers } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private httpClient: HttpClient) { }

  api = "http://localhost:8093/ahch"


  public saveClaim(userId: number, claim: Claim): Observable<Claim> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<Claim>(`${this.api}/save/Claim/${userId}`, claim, { headers });
  }
  
  public saveClaimAnonymous(claim: Claim): Observable<Claim> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<Claim>(`${this.api}/save/Claim/anonymous`, claim, { headers });
  }
  
    public getClaims(): Observable<Claim[]> {
        return this.httpClient.get<Claim[]>(`${this.api}/get/Claim`);
    }
  
    public deleteClaim(ClaimId: number) {
      return this.httpClient.delete(`${this.api}/delete/Claim/${ClaimId}`);
    }
  
    public getClaim(ClaimId: number) {
      return this.httpClient.get<Claim>(`${this.api}/get/Claim/${ClaimId}`);
    }
  
    public updateClaim(Claim: Claim) {
      return this.httpClient.put<Claim>(`${this.api}/update/Claim`, Claim);
    }


}
