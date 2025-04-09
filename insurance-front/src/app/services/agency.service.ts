import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Agency } from '../models/agency.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AgencyService {

 constructor(private httpClient: HttpClient) { }
 
   api = "http://localhost:9090"

 public saveAgency(Agency: Agency): Observable<Agency> {
     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.httpClient.post<Agency>(`${this.api}/save/Agency`, Agency, { headers });
   }

     public getAgencys(): Observable<Agency[]> {
         return this.httpClient.get<Agency[]>(`${this.api}/get/Agency`);
     }
   
     public deleteAgency(AgencyId: number) {
       return this.httpClient.delete(`${this.api}/delete/Agency/${AgencyId}`);
     }
   
     public getAgency(AgencyId: number) {
       return this.httpClient.get<Agency>(`${this.api}/get/Agency/${AgencyId}`);
     }
   
     public updateAgency(agency: Agency): Observable<Agency> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.httpClient.put<Agency>(`${this.api}/update/Agency`, agency, { headers });
    }
}
