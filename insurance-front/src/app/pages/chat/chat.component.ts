// chat.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { ChatStoreService } from '../../services/chat-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  sender: string = 'agent1';     // Replace with the actual agent id/name
  receiver: string = 'customer1'; // Replace with the actual receiver id/name
  eventSource!: EventSource;
  private subscription!: Subscription;

  constructor(
    private chatService: ChatService,
    private chatStore: ChatStoreService
  ) {}

  ngOnInit(): void {
    // Load stored chat messages
    this.subscription = this.chatStore.messages$.subscribe((msgs) => {
      this.messages = msgs;
    });

    // Subscribe to SSE messages if needed
    this.eventSource = this.chatService.getMessageStream(this.sender);
    this.eventSource.addEventListener('chat', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      this.chatStore.addMessage(data);
    });
  }

  send(): void {
    const msg: ChatMessage = {
      sender: this.sender,
      receiver: this.receiver,
      message: this.newMessage
    };
    this.chatService.sendMessage(msg).subscribe(() => {
      // Optionally, add the message to the store on success
      this.chatStore.addMessage(msg);
    });
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    this.eventSource.close();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
