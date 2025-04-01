// chat-store.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class ChatStoreService {
  private _messages: ChatMessage[] = [];
  private _messagesSubject = new BehaviorSubject<ChatMessage[]>([]);

  messages$ = this._messagesSubject.asObservable();

  constructor() {
    // Load any stored messages from localStorage
    const stored = localStorage.getItem('chatMessages');
    if (stored) {
      this._messages = JSON.parse(stored);
      this._messagesSubject.next(this._messages);
    }
  }

  addMessage(msg: ChatMessage) {
    this._messages.push(msg);
    localStorage.setItem('chatMessages', JSON.stringify(this._messages));
    this._messagesSubject.next(this._messages);
  }

  clearMessages() {
    this._messages = [];
    localStorage.removeItem('chatMessages');
    this._messagesSubject.next(this._messages);
  }
}
