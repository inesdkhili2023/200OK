import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class ChatComponent implements OnInit {
  @Input() agentId?: number;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    if (this.agentId) {
      this.chatService.getChatHistory(this.agentId).subscribe(messages => {
        this.messages = messages;
      });

      this.chatService.getMessages().subscribe(message => {
        this.messages.push(message);
        this.scrollToBottom();
      });
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.agentId) return;

    const message: ChatMessage = {
      senderId: this.agentId,
      senderName: 'Agent', // You might want to get this from a user service
      content: this.newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    this.chatService.sendMessage(message);
    this.newMessage = '';
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
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch(err) {}
    });
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
} 