import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-all-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-messages.component.html',
  styleUrls: ['./all-messages.component.css']
})
export class AllMessagesComponent implements OnInit, OnDestroy {
  allMessages: ChatMessage[] = [];
  filteredMessages: ChatMessage[] = [];
  agentFilter: number | 'all' = 'all';
  messageTypeFilter: string = 'all';
  searchTerm: string = '';
  
  private subscriptions: Subscription[] = [];
  currentAgentId?: number;
  
  // List of unique agent IDs for filtering
  uniqueAgentIds: number[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current agent ID if logged in
    if (this.authService.isLoggedIn()) {
      this.currentAgentId = this.authService.agent.idAgent;
    }
    
    // Load all messages from all agents
    this.loadAllMessages();
    
    // Subscribe to new messages to keep the list updated
    this.subscriptions.push(
      this.chatService.getNewMessages().subscribe(message => {
        this.allMessages = [...this.allMessages, message];
        this.extractUniqueAgentIds();
        this.applyFilters();
      })
    );
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  loadAllMessages(): void {
    this.subscriptions.push(
      this.chatService.getAllAgentsMessages().subscribe(messages => {
        this.allMessages = messages;
        this.extractUniqueAgentIds();
        this.applyFilters();
      })
    );
  }
  
  private extractUniqueAgentIds(): void {
    // Extract unique agent IDs from messages for filtering
    const agentIds = new Set<number>();
    
    this.allMessages.forEach(message => {
      if (message.senderId && message.senderId > 0) {
        agentIds.add(message.senderId);
      }
      if (message.receiverId && message.receiverId > 0) {
        agentIds.add(message.receiverId);
      }
    });
    
    this.uniqueAgentIds = Array.from(agentIds).sort((a, b) => a - b);
  }
  
  applyFilters(): void {
    this.filteredMessages = this.allMessages.filter(message => {
      // Apply agent filter
      if (this.agentFilter !== 'all') {
        const agentId = Number(this.agentFilter);
        if (message.senderId !== agentId && message.receiverId !== agentId) {
          return false;
        }
      }
      
      // Apply message type filter
      if (this.messageTypeFilter !== 'all' && message.type !== this.messageTypeFilter) {
        return false;
      }
      
      // Apply search term
      if (this.searchTerm && !message.content.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    // Sort messages by timestamp (newest first)
    this.filteredMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  clearFilters(): void {
    this.agentFilter = 'all';
    this.messageTypeFilter = 'all';
    this.searchTerm = '';
    this.applyFilters();
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
  
  getMessageTypeLabel(type: string): string {
    switch (type) {
      case 'text': return 'Message';
      case 'request': return 'Request';
      case 'status': return 'Status';
      case 'notification': return 'Notification';
      default: return type;
    }
  }
  
  refreshMessages(): void {
    this.loadAllMessages();
  }
  
  isCurrentAgent(senderId: number): boolean {
    return senderId === this.currentAgentId;
  }
} 