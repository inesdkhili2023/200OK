import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sinister } from '../models/sinister.model';
import { environment } from '../../environments/environment';
import { OperatorFunction } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SinisterService {
  // Use the API base URL defined in the environment
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllSinisters(): Observable<Sinister[]> {
    return this.http.get<Sinister[]>(`${this.apiUrl}/sinisters`);
  }

  createSinister(sinister: Sinister, file?: File): Observable<Sinister> {
    const formData = new FormData();
    
    // Convert sinister to JSON string for @RequestPart("sinister")
    const sinisterData = {
      ...sinister,
      dateAccident: this.formatDate(sinister.dateAccident),
      dateDeclaration: this.formatDate(sinister.dateDeclaration)
    };
    formData.append('sinister', JSON.stringify(sinisterData));

    // Add file if exists for @RequestPart("file")
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<Sinister>(`${this.apiUrl}/addsinister`, formData);
  }

  updateSinister(id: number, sinister: Sinister, file?: File): Observable<Sinister> {
    const formData = new FormData();
    
    // Préparer les données du sinistre
    const sinisterData = {
      sinisterId: id,
      idClient: sinister.idClient,
      dateAccident: this.formatDate(sinister.dateAccident),
      dateDeclaration: this.formatDate(sinister.dateDeclaration),
      accidentLocation: sinister.accidentLocation,
      typeSinister: sinister.typeSinister,
      description: sinister.description,
      status: sinister.status
    };

    // Ajouter le JSON comme string
    formData.append('sinister', new Blob([JSON.stringify(sinisterData)], {
      type: 'application/json'
    }));

    // Ajouter le fichier s'il existe
    if (file) {
      formData.append('file', file);
    }

    console.log('Data being sent:', {
      url: `${this.apiUrl}/sinisters/${id}`,
      sinisterData: sinisterData,
      hasFile: !!file
    });

    return this.http.put<Sinister>(
      `${this.apiUrl}/sinisters/${id}`,
      formData
    );
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  deleteSinister(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sinisters/${id}`);
  }

  assignSinister(sinisterId: number, clientId: number): Observable<Sinister> {
    return this.http.post<Sinister>(`${this.apiUrl}/assignsinister/${sinisterId}/client/${clientId}`, {});
  }

  getFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/files/${fileName}`, {
      responseType: 'blob'
    });
  }

  simulateCompensation(id: number, severity: number, clientResponsible: boolean): Observable<number> {
    return this.http.put<number>(
      `${this.apiUrl}/sinisters/simulate/${id}`,
      null,
      {
        params: {
          severity: severity.toString(),
          clientResponsible: clientResponsible.toString()
        }
      }
    );
  }

  getSinisterLocation(sinisterId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${sinisterId}/location`);
  }

  updateSinisterLocation(sinisterId: number, latitude: number, longitude: number): Observable<Sinister> {
    return this.http.put<Sinister>(
      `${this.apiUrl}/sinisters/location/${sinisterId}`,
      { latitude: latitude.toString(), longitude: longitude.toString() }
    );
  }

  getSinisterStatsByType(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.apiUrl}/sinisters/statistics/by-type`);
  }
}
function tap<T>(sideEffect: (value: T) => void): OperatorFunction<T, T> {
  return (source: Observable<T>) =>
    new Observable<T>(subscriber => {
      return source.subscribe({
        next(value) {
          try {
            sideEffect(value);
          } catch (err) {
            subscriber.error(err);
            return;
          }
          subscriber.next(value);
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        }
      });
    });
}
