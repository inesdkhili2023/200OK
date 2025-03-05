import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentTowingService {
  private apiUrl = 'http://localhost:8081/api/agents';  // ✅ Corrected API path

  constructor(private http: HttpClient) {}

  getAllAgents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  addAgent(agent: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, agent);
  }

  updateAgent(id: number, agent: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, agent);
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}
