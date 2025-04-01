// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  sender: string;
  receiver: string;
  message: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:8081/api/chat'; // Adjust the port/URL as needed

  constructor(private http: HttpClient) { }

  // Send a message via POST
  sendMessage(message: ChatMessage): Observable<any> {
    return this.http.post(`${this.baseUrl}/send`, message);
  }

  // Subscribe to the SSE stream for a given userId
  getMessageStream(userId: string): EventSource {
    return new EventSource(`${this.baseUrl}/stream/${userId}`);
  }
}
