import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {

  private apiUrl = 'http://localhost:8081/jobapplications'; 

  constructor(private http: HttpClient) {}

  // Méthode pour envoyer la candidature
  submitJobApplication(FormData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, FormData);
  }
  getJobApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }
  updateApplication(jobApp: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${jobApp.jobAppId}`, jobApp);
  }

  deleteJobApplication(jobAppId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${jobAppId}`);
  }
  getJobApplicationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log("Candidature récupérée:", data)) // Vérifie si jobOffer est présent
    );
}
getApplicationsByJobOffer(jobOfferId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/jobOffer/${jobOfferId}`);
}
updateJobApplicationStatus(applicationId: number, status: string): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${applicationId}/status?status=${status}`, 
    {}
  );
}
getFile(fileName:string):Observable<Blob>{
return this.http.get(`${this.apiUrl}/files/${fileName}`,{
  responseType:'blob'});
}
}


