import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() agentId?: number = 1; // Default to agent ID 1 for testing
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  private apiUrl = 'http://localhost:8081';

  messages: ChatMessage[] = [];
  newMessage: string = '';
  shouldScroll = false;
  isConnected = false;
  agentName: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the agent information
    if (this.authService.isLoggedIn()) {
      this.agentId = this.authService.agent.idAgent;
      this.agentName = this.authService.agent.name || 'Agent';
    }

    if (this.agentId) {
      // Add mock mode message
      this.addSystemMessage('⚠️ Chat is running in mock mode. Messages are stored locally only.');
      this.addSystemMessage(`Server at ${this.apiUrl} is not connected.`);
      
      // Load chat history
      const historySub = this.chatService.getChatHistory(this.agentId).subscribe(messages => {
        this.messages = messages;
        this.shouldScroll = true;
      });
      this.subscriptions.push(historySub);

      // Subscribe to new messages
      const messageSub = this.chatService.getNewMessages().subscribe(message => {
        this.messages = [...this.messages, message];
        this.shouldScroll = true;
      });
      this.subscriptions.push(messageSub);
      
      // Get connection status
      const connStatusSub = this.chatService.getConnectionStatus().subscribe(status => {
        this.isConnected = status;
      });
      this.subscriptions.push(connStatusSub);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.agentId) return;

    const message: ChatMessage = {
      senderId: this.agentId,
      senderName: this.agentName, // Use the agent's actual name
      content: this.newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    this.chatService.sendMessage(message);
    this.newMessage = '';
  }

  sendTowingRequest(location: string): void {
    if (!this.agentId || !location.trim()) return;

    const message: ChatMessage = {
      senderId: this.agentId,
      senderName: this.agentName, // Use the agent's actual name
      content: location,
      timestamp: new Date(),
      type: 'request'
    };

    this.chatService.sendMessage(message);
  }

  testConnection(): void {
    // Use full URL for API calls - no proxy in mock mode
    this.addSystemMessage('Testing connection to ' + this.apiUrl + '/chat/test');
    
    this.http.get(`${this.apiUrl }/chat/test`).subscribe({
      next: (response) => {
        console.log('API test successful:', response);
        this.addSystemMessage('API connection test successful.');
        
        // Test WebSocket by sending a test message
        this.http.get(`${this.apiUrl }/chat/send-test`).subscribe({
          next: (response) => {
            console.log('WebSocket test message sent:', response);
            this.addSystemMessage('WebSocket test message sent. If WebSocket is working, you should see another message soon.');
          },
          error: (error) => {
            console.error('WebSocket test failed:', error);
            this.addSystemMessage('WebSocket test failed. Check console for details.');
          }
        });
      },
      error: (error) => {
        console.error('API test failed:', error);
        this.addSystemMessage('API connection test failed. Check console for details.');
        this.addSystemMessage('💡 Tip: Make sure your Spring Boot server is running at ' + this.apiUrl);
        this.addSystemMessage('Check browser network tab for specific error details');
      }
    });
  }

  addSystemMessage(content: string): void {
    const systemMessage: ChatMessage = {
      senderId: 0,
      senderName: 'System',
      content: content,
      timestamp: new Date(),
      type: 'status'
    };
    
    this.messages = [...this.messages, systemMessage];
    this.shouldScroll = true;
  }

  isCurrentUser(message: ChatMessage): boolean {
    return message.senderId === this.agentId;
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  clearChat(): void {
    this.chatService.clearChatHistory();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
} 