import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { OurUsers } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }


  api = 'http://localhost:9090';

  getUsers(): Observable<OurUsers[]> {
    return this.httpClient.get<OurUsers[]>(`${this.api}/get/Users`);
}
assignAgency(userId: number, agencyId: number): Observable<OurUsers> {
  return this.httpClient.post<OurUsers>(`${this.api}/assign-agency/${userId}/${agencyId}`, {});
}
  getAgents(): Observable<OurUsers[]> {
    return this.httpClient.get<OurUsers[]>(`${this.api}/get/Users`)
      .pipe(
        map(users => users.filter(user => 
          user.role && user.role.toUpperCase() === 'AGENT'))
      );
  }

}
