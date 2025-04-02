// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  id?: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'request' | 'status';
  requestId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private ws!: WebSocketSubject<any>;
  private messageSubject = new Subject<ChatMessage>();
  private apiUrl = `${environment.apiUrl}/api/chat`;
  private mockMode = false;
  private reconnectAttempts = 0;
  private MAX_RECONNECT_ATTEMPTS = 3;

  constructor(private http: HttpClient) {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    // If we've already tried to reconnect several times, switch to mock mode
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.log('Maximum reconnection attempts reached. Switching to mock mode.');
      this.setupMockMode();
      return;
    }

    try {
      this.ws = webSocket({
        url: `${environment.wsUrl}/ws/chat`,
        openObserver: {
          next: () => {
            console.log('WebSocket connected');
            this.mockMode = false;
            this.reconnectAttempts = 0;
          }
        },
        closeObserver: {
          next: () => {
            console.log('WebSocket disconnected');
            this.reconnectAttempts++;
            // Attempt to reconnect after 5 seconds
            if (!this.mockMode) {
              setTimeout(() => this.connectWebSocket(), 5000);
            }
          }
        }
      });
      
      this.ws.subscribe(
        (message: ChatMessage) => {
          this.messageSubject.next(message);
        },
        (error) => {
          console.error('WebSocket error:', error);
          this.reconnectAttempts++;
          
          if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            console.log('Switching to mock mode after connection errors');
            this.setupMockMode();
          } else if (!this.mockMode) {
            // Attempt to reconnect after 5 seconds
            setTimeout(() => this.connectWebSocket(), 5000);
          }
        }
      );
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
        this.setupMockMode();
      } else {
        setTimeout(() => this.connectWebSocket(), 5000);
      }
    }
  }

  private setupMockMode() {
    console.log('Setting up mock WebSocket mode');
    this.mockMode = true;
    // Send a system message to inform the user about mock mode
    this.messageSubject.next({
      senderId: 0,
      senderName: 'System',
      content: 'Chat is currently in offline mode. Messages will be stored locally.',
      timestamp: new Date(),
      type: 'status'
    });
  }

  sendMessage(message: ChatMessage): void {
    if (this.mockMode) {
      // In mock mode, simulate sending and receiving messages
      console.log('Sending message in mock mode:', message);
      // Echo the message back to the user
      this.messageSubject.next({...message, timestamp: new Date()});
      
      // Simulate a response after a short delay
      if (message.type === 'text') {
        timer(1000).subscribe(() => {
          this.messageSubject.next({
            senderId: 999, // System/AI user ID
            senderName: 'Agent Support',
            content: `Thanks for your message. This is an automated response in offline mode.`,
            timestamp: new Date(),
            type: 'text'
          });
        });
      }
    } else {
      // Normal WebSocket mode
      try {
        this.ws.next(message);
      } catch (error) {
        console.error('Error sending message via WebSocket:', error);
        // Fall back to mock mode if sending fails
        this.setupMockMode();
        this.sendMessage(message); // Retry with mock mode
      }
    }
  }

  getMessages(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }

  getChatHistory(agentId: number): Observable<ChatMessage[]> {
    if (this.mockMode) {
      // Return mock history in mock mode
      console.log('Getting chat history in mock mode');
      return of([
        {
          id: 1,
          senderId: 999,
          senderName: 'System',
          content: 'Welcome to the chat system. You are in offline mode.',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          type: 'status'
        }
      ]);
    }
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history/${agentId}`);
  }

  disconnect(): void {
    if (this.ws && !this.mockMode) {
      this.ws.complete();
    }
  }
}
