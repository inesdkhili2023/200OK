import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import 'eventsource-polyfill';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Client;

  constructor() {}

  connect(agentId: number, callback: (message: string) => void): void {
    const socket = new SockJS('http://localhost:8081/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Reconnect every 5s
    });

    this.stompClient.onConnect = () => {
      console.log("✅ Connected to WebSocket");

      // Subscribe to agent-specific notifications
      this.stompClient.subscribe(`/topic/agent-${agentId}`, (message: Message) => {
        callback(JSON.parse(message.body));
      });
    };

    this.stompClient.onStompError = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log("🛑 Disconnected from WebSocket");
    }
  }
}
