import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Towing } from '../models/towing.model';

@Injectable({
  providedIn: 'root'
})
export class TowingService {
  private apiUrl = 'http://localhost:8082/api/towings';
  private agentsUrl = 'http://localhost:8082/api/towings/agents';  // ✅ Fixed Agent API Endpoint
  private usersUrl = 'http://localhost:8082/api/towings/users';    // ✅ Fixed User API Endpoint

  constructor(private http: HttpClient) {}

  /**
   * Get all towing requests
   */
  getAllTowings(): Observable<Towing[]> {
    return this.http.get<Towing[]>(`${this.apiUrl}/all`);
  }

  /**
   * Add a new towing request
   * @param towingData - The towing data object containing idAgent & idUser
   */
  addTowing(towingData: any): Observable<Towing> {
    const url = `${this.apiUrl}/add/${towingData.idAgent}/${towingData.idUser}`;
    return this.http.post<Towing>(url, towingData);
  }

  /**
   * Update an existing towing request
   */
  updateTowing(towing: Towing): Observable<Towing> {
    return this.http.put<Towing>(`${this.apiUrl}/update/${towing.id}`, towing);
  }
  
  
  deleteTowing(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { responseType: 'json' });
  }
  
  exportPDF() {
    return this.http.get(`${this.apiUrl}/export/pdf`, { responseType: 'blob' });
  }

  /**
   * Get all agents
   */
  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/agents`); // Ensure this endpoint works
  }

  /**
   * Get all users
   */
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.usersUrl);
  }
}
