import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OurUsers } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  api = 'http://localhost:9090';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAgents(): Observable<OurUsers[]> {
    return this.httpClient.get<OurUsers[]>(`${this.api}/users/agents`);
    // Or if your API filters by role, you might use:
    // return this.http.get<OurUsers[]>(`${this.apiUrl}/users?role=agent`);
  }
  assignAgency(userId: number, agencyId: number): Observable<OurUsers> {
    return this.httpClient.post<OurUsers>(
      `${this.api}/admin/${userId}/assign-to-agency/${agencyId}`, 
      {}, 
      { headers: this.getHeaders() }
    );
  }
  async getUsers(token:string):Promise<any>{
    const url = `${this.api}/admin/get-all-users`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    try{
      const response =  this.httpClient.get<any>(url, {headers}).toPromise()
      return response;
    }catch(error){
      throw error;
    }
  }
}