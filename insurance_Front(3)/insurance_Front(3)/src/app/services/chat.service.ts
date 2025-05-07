// chat.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, of, map, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client } from '@stomp/stompjs';

// Use declaration for SockJS since it doesn't have proper TypeScript types
declare var SockJS: any;

export interface ChatMessage {
  id?: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'request' | 'status' | 'notification';
  requestId?: number;
  receiverId?: number;
  read?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private stompClient: Client | null = null;
  private messageSubject = new BehaviorSubject<ChatMessage[]>([]);
  private newMessageSubject = new Subject<ChatMessage>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  
  private apiUrl = environment.apiBaseUrl + '/chat';
  private wsUrl = environment.wsUrl || 'http://localhost:8082';
  private STORAGE_KEY = 'chat_messages';
  private connected = false;
  private connectionAttempts = 0;
  private MAX_RECONNECT_ATTEMPTS = 5;
  private useMockData = false;
  private fallbackToDirectConnection = false;

  constructor(private http: HttpClient) {
    this.loadMessagesFromStorage();
    this.connect();
  }

  private addMockMessages(): void {
    const mockMessages: ChatMessage[] = [
      {
        senderId: 0,
        senderName: 'System',
        content: 'Welcome to the chat system. This is running in mock mode because the backend server is not available.',
        timestamp: new Date(),
        type: 'status'
      },
      {
        senderId: 2,
        senderName: 'Support',
        content: 'Hello! How can I help you today?',
        timestamp: new Date(Date.now() - 60000), // 1 minute ago
        type: 'text'
      }
    ];
    
    const currentMessages = this.messageSubject.value;
    this.messageSubject.next([...currentMessages, ...mockMessages]);
    this.saveMessagesToStorage([...currentMessages, ...mockMessages]);
  }

  private connect(): void {
    if (this.useMockData) {
      console.log('Using mock data - WebSocket connection disabled');
      this.addMockMessages();
      this.connectionStatusSubject.next(true);
      return;
    }

    if (this.connectionAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.warn('Max reconnection attempts reached. Stopped trying to reconnect WebSocket.');
      return;
    }

    try {
      // Ensure SockJS is available
      if (typeof SockJS === 'undefined') {
        // Dynamically load SockJS if not available
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js';
        script.onload = () => {
          console.log('SockJS loaded successfully');
          this.initializeStompClient();
        };
        document.head.appendChild(script);
      } else {
        this.initializeStompClient();
      }
    } catch (error) {
      console.error('Error setting up WebSocket connection:', error);
      this.reconnectLater();
    }
  }
  
  private initializeStompClient(): void {
    try {
      console.log('Initializing STOMP client...');
      
      // Use the full URL to the WebSocket endpoint
      const socketUrl = this.fallbackToDirectConnection 
        ? `${this.wsUrl}/api/ws` 
        : `${this.wsUrl}/ws`;
        
      console.log('📡 Connecting to WebSocket at:', socketUrl);
      
      // Create SockJS instance using the global variable (not import)
      const socket = new SockJS(socketUrl);
      
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        debug: function(str) {
          console.log('STOMP:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });
      
      this.configureStompClient();
      this.stompClient.activate();
      console.log('STOMP client activated');
    } catch (error) {
      console.error('Error initializing STOMP client:', error);
      this.reconnectLater();
    }
  }
  
  private configureStompClient(): void {
    if (!this.stompClient) return;
    
    this.stompClient.onConnect = (frame) => {
      console.log('✅ Connected to WebSocket:', frame);
      this.connected = true;
      this.connectionStatusSubject.next(true);
      this.connectionAttempts = 0;
      this.fallbackToDirectConnection = false;
      
      // Subscribe to public channel
      this.stompClient?.subscribe('/topic/public', (message) => {
        console.log('Received message on /topic/public:', message);
        const chatMessage = JSON.parse(message.body) as ChatMessage;
        // Convert timestamp string to Date object if needed
        if (typeof chatMessage.timestamp === 'string') {
          chatMessage.timestamp = new Date(chatMessage.timestamp);
        }
        this.handleNewMessage(chatMessage);
      });
      
      // Subscribe to towing updates
      this.stompClient?.subscribe('/topic/towing', (message) => {
        console.log('Received message on /topic/towing:', message);
        const towingUpdate = JSON.parse(message.body);
        console.log('Received towing update:', towingUpdate);
        
        // Create a status message for the towing update
        const statusMessage: ChatMessage = {
          senderId: 0,
          senderName: 'System',
          content: `Towing request #${towingUpdate.id || towingUpdate.towingId} status changed to ${towingUpdate.status || towingUpdate.newStatus}`,
          timestamp: new Date(),
          type: 'status',
          requestId: towingUpdate.id || towingUpdate.towingId
        };
        
        this.handleNewMessage(statusMessage);
      });
    };
    
    this.stompClient.onStompError = (frame) => {
      console.error('❌ WebSocket STOMP error:', frame);
      this.connected = false;
      this.connectionStatusSubject.next(false);
      
      // Try alternative endpoint if first one fails
      if (!this.fallbackToDirectConnection) {
        console.log("⚠️ Trying alternative WebSocket endpoint...");
        this.fallbackToDirectConnection = true;
        this.connect();
        return;
      }
      
      this.reconnectLater();
    };
    
    this.stompClient.onWebSocketError = (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.connected = false;
      this.connectionStatusSubject.next(false);
      
      // Try alternative endpoint if first one fails
      if (!this.fallbackToDirectConnection) {
        console.log("⚠️ Trying alternative WebSocket endpoint...");
        this.fallbackToDirectConnection = true;
        this.connect();
        return;
      }
      
      this.connectionAttempts++;
      this.reconnectLater();
    };
  }
  
  private reconnectLater(): void {
    this.connectionAttempts++;
    if (this.connectionAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        this.connect();
      }, 5000);
    }
  }

  private loadMessagesFromStorage(): void {
    try {
      const storedMessages = localStorage.getItem(this.STORAGE_KEY);
      if (storedMessages) {
        const messages = JSON.parse(storedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        this.messageSubject.next(messages);
      } else {
        // Initialize with a welcome message
        const welcomeMessage: ChatMessage = {
          senderId: 0,
          senderName: 'System',
          content: 'Welcome to the chat system. You can start sending messages.',
          timestamp: new Date(),
          type: 'status'
        };
        this.messageSubject.next([welcomeMessage]);
        this.saveMessagesToStorage([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading messages from storage:', error);
      this.messageSubject.next([]);
    }
  }

  private saveMessagesToStorage(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  }

  private handleNewMessage(message: ChatMessage): void {
    // Update the message list
    const currentMessages = this.messageSubject.value;
    const updatedMessages = [...currentMessages, message];
    
    // Update both subjects
    this.messageSubject.next(updatedMessages);
    this.newMessageSubject.next(message);
    
    // Save to local storage
    this.saveMessagesToStorage(updatedMessages);
  }

  sendMessage(message: ChatMessage): void {
    // Add timestamp if not provided
    if (!message.timestamp) {
      message.timestamp = new Date();
    }

    if (this.connected && this.stompClient?.connected && !this.useMockData) {
      // Send via WebSocket
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message)
      });
    } else if (this.useMockData) {
      console.warn('WebSocket not connected. Message saved locally only.');
      // Add message locally anyway
      this.handleNewMessage(message);
      
      // In mock mode, simulate a response
      setTimeout(() => {
        const response: ChatMessage = {
          senderId: 2,
          senderName: 'Support',
          content: `Thank you for your message. This is an automated response in mock mode.`,
          timestamp: new Date(),
          type: 'text'
        };
        this.handleNewMessage(response);
      }, 1000);
    } else {
      // Not in mock mode but WebSocket not connected, try to send via HTTP
      console.warn('WebSocket not connected. Trying to send via HTTP API...');
      
      // Try to send via REST API
      this.http.post<ChatMessage>(`${this.apiUrl}/chat/send`, message).subscribe({
        next: (response) => {
          console.log('Message sent via HTTP:', response);
          this.handleNewMessage(response);
        },
        error: (error) => {
          console.error('Error sending message via HTTP:', error);
          // Still add the message locally
          this.handleNewMessage(message);
          // Try reconnecting WebSocket
          if (this.connectionAttempts < this.MAX_RECONNECT_ATTEMPTS) {
            this.connect();
          }
        }
      });
    }
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messageSubject.asObservable();
  }

  getNewMessages(): Observable<ChatMessage> {
    return this.newMessageSubject.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    // In mock mode, return always connected
    if (this.useMockData) {
      return of(true);
    }
    return this.connectionStatusSubject.asObservable();
  }

  getChatHistory(agentId: number): Observable<ChatMessage[]> {
    if (this.useMockData) {
      // Use local storage data in mock mode
      return this.messageSubject.asObservable();
    }
    
    // First try to fetch from API
    this.http.get<ChatMessage[]>(`${this.apiUrl}/history/${agentId}`).subscribe({
      next: (messages) => {
        // Convert timestamp strings to Date objects
        const formattedMessages = messages.map(msg => ({
          ...msg, 
          timestamp: new Date(msg.timestamp)
        }));
        
        // Update the message subject with the fetched history
        this.messageSubject.next(formattedMessages);
        this.saveMessagesToStorage(formattedMessages);
      },
      error: (error) => {
        console.error('Error fetching chat history:', error);
        // If API call fails, return the local storage messages
      }
    });

    // Return the current observable regardless
    return this.messageSubject.asObservable();
  }

  // New method to get all messages for all agents
  getAllAgentsMessages(): Observable<ChatMessage[]> {
    if (this.useMockData) {
      // In mock mode, generate some example messages from different agents
      const mockMessages: ChatMessage[] = [
        {
          senderId: 1,
          senderName: 'Agent 1',
          content: 'Hello from Agent 1',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text'
        },
        {
          senderId: 2,
          senderName: 'Agent 2',
          content: 'Hello from Agent 2',
          timestamp: new Date(Date.now() - 2800000),
          type: 'text'
        },
        {
          senderId: 3,
          senderName: 'Agent 3',
          content: 'Hello from Agent 3',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text'
        }
      ];
      
      // Combine with existing messages
      const currentMessages = this.messageSubject.value;
      const allMessages = [...currentMessages, ...mockMessages];
      
      // Sort by timestamp
      allMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      return of(allMessages);
    }
    
    // For real implementation, fetch all messages from the backend
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/messages/all`).pipe(
      map((messages) => {
        // Convert timestamp strings to Date objects
        return messages.map(msg => ({
          ...msg, 
          timestamp: new Date(msg.timestamp)
        }));
      }),
      catchError(error => {
        console.error('Error fetching all messages:', error);
        // Return current messages if API fails
        return of(this.messageSubject.value);
      })
    );
  }

  clearChatHistory(): void {
    const welcomeMessage: ChatMessage = {
      senderId: 0,
      senderName: 'System',
      content: 'Chat history has been cleared.',
      timestamp: new Date(),
      type: 'status'
    };
    
    this.messageSubject.next([welcomeMessage]);
    this.saveMessagesToStorage([welcomeMessage]);
  }

  disconnect(): void {
    if (this.stompClient && this.connected) {
      try {
        this.stompClient.deactivate();
        console.log('WebSocket disconnected');
      } catch (error) {
        console.error('Error disconnecting WebSocket:', error);
      }
    }
    this.connected = false;
    this.connectionStatusSubject.next(false);
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}