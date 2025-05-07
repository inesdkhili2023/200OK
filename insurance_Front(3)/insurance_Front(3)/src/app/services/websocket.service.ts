import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

// Use declaration for SockJS since it doesn't have proper TypeScript types
declare var SockJS: any;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Client;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<any>(null);
  private wsBaseUrl = environment.wsUrl || 'http://localhost:8082';
  private apiBaseUrl = environment.apiBaseUrl || 'http://localhost:8082/api';
  private fallbackToDirectConnection = false;

  constructor() {
    // Ensure SockJS is available
    this.loadSockJSIfNeeded();
  }

  private loadSockJSIfNeeded(): void {
    if (typeof SockJS === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js';
      document.head.appendChild(script);
      console.log('SockJS script loaded');
    }
  }

  // Get connection status as observable
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  // Get messages as observable
  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  connect(agentId: number): void {
    // Ensure we're not already connected
    if (this.stompClient && this.connectionStatus.value) {
      console.log("Already connected to WebSocket");
      return;
    }

    try {
      // Ensure SockJS is loaded before creating connection
      if (typeof SockJS === 'undefined') {
        console.error('SockJS is not loaded. Cannot establish WebSocket connection.');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js';
        script.onload = () => {
          console.log('SockJS loaded, now connecting...');
          this.createConnection(agentId);
        };
        document.head.appendChild(script);
        return;
      }

      this.createConnection(agentId);
    } catch (error) {
      console.error("❌ Error connecting to WebSocket:", error);
      this.connectionStatus.next(false);
    }
  }

  private createConnection(agentId: number): void {
    try {
      // Try the endpoint from the proxy first, then fallback to direct connection if needed
      const wsEndpoint = this.fallbackToDirectConnection 
        ? `${this.wsBaseUrl}/api/ws` 
        : `${this.wsBaseUrl}/ws`;
      
      console.log(`📡 Attempting to connect to WebSocket at: ${wsEndpoint}`);
      const socket = new SockJS(wsEndpoint);
      
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (msg) => console.log(`STOMP: ${msg}`)
      });

      this.stompClient.onConnect = () => {
        console.log("✅ Connected to WebSocket");
        this.connectionStatus.next(true);

        // Subscribe to public channel
        this.stompClient.subscribe('/topic/public', (message: Message) => {
          const data = JSON.parse(message.body);
          console.log("Received public message:", data);
          this.messageSubject.next(data);
        });

        // Subscribe to agent-specific channel
        this.stompClient.subscribe(`/topic/agent-${agentId}`, (message: Message) => {
          const data = JSON.parse(message.body);
          console.log(`Received message for agent ${agentId}:`, data);
          this.messageSubject.next(data);
        });

        // Subscribe to towing updates if needed
        this.stompClient.subscribe('/topic/towing', (message: Message) => {
          const data = JSON.parse(message.body);
          console.log("Received towing update:", data);
          this.messageSubject.next(data);
        });
      };

      this.stompClient.onStompError = (error) => {
        console.error("❌ WebSocket STOMP error:", error);
        this.connectionStatus.next(false);
        
        // Try alternative endpoint if first one fails
        if (!this.fallbackToDirectConnection) {
          console.log("⚠️ Trying alternative WebSocket endpoint...");
          this.fallbackToDirectConnection = true;
          setTimeout(() => this.createConnection(agentId), 1000);
        }
      };

      this.stompClient.onWebSocketError = (error) => {
        console.error("❌ WebSocket error:", error);
        this.connectionStatus.next(false);
        
        // Try alternative endpoint if first one fails
        if (!this.fallbackToDirectConnection) {
          console.log("⚠️ Trying alternative WebSocket endpoint...");
          this.fallbackToDirectConnection = true;
          setTimeout(() => this.createConnection(agentId), 1000);
        }
      };

      this.stompClient.activate();
    } catch (error) {
      console.error("❌ Error creating WebSocket connection:", error);
      this.connectionStatus.next(false);
      
      // Try alternative endpoint if first one fails
      if (!this.fallbackToDirectConnection) {
        console.log("⚠️ Trying alternative WebSocket endpoint...");
        this.fallbackToDirectConnection = true;
        setTimeout(() => this.createConnection(agentId), 1000);
      }
    }
  }

  // Method to send messages
  sendMessage(destination: string, body: any): void {
    if (!this.stompClient || !this.connectionStatus.value) {
      console.error("Cannot send message, not connected to WebSocket");
      return;
    }

    this.stompClient.publish({
      destination: destination,
      body: JSON.stringify(body)
    });
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log("🛑 Disconnected from WebSocket");
      this.connectionStatus.next(false);
    }
  }
}