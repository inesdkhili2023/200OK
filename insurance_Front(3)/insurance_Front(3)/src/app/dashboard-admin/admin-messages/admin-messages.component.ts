import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css']
})
export class AdminMessagesComponent implements OnInit {
  conversations: any[] = [];
  selectedConversation: any = null;
  messages: any[] = [];
  newMessage: string = '';
  
  constructor() { }

  ngOnInit() {
    // Load mock conversations
    this.loadMockData();
  }
  
  loadMockData() {
    // Mock conversations
    this.conversations = [
      {
        id: 1,
        user: {
          id: 101,
          name: 'John Smith',
          avatar: 'https://via.placeholder.com/50'
        },
        lastMessage: 'I need help with my claim',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        unread: 3
      },
      {
        id: 2,
        user: {
          id: 102,
          name: 'Jane Doe',
          avatar: 'https://via.placeholder.com/50'
        },
        lastMessage: 'When will my towing request be processed?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        unread: 1
      },
      {
        id: 3,
        user: {
          id: 103,
          name: 'Bob Johnson',
          avatar: 'https://via.placeholder.com/50'
        },
        lastMessage: 'Thanks for your help!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        unread: 0
      }
    ];
  }
  
  selectConversation(conversation: any) {
    this.selectedConversation = conversation;
    conversation.unread = 0; // Mark as read
    
    // Load mock messages for the selected conversation
    this.loadMockMessages(conversation.id);
  }
  
  loadMockMessages(conversationId: number) {
    // Different messages for each conversation
    if (conversationId === 1) {
      this.messages = [
        {
          id: 1,
          sender: 'user',
          content: 'Hello, I need help with my claim #12345',
          timestamp: new Date(Date.now() - 3600000 - 300000).toISOString()
        },
        {
          id: 2,
          sender: 'user',
          content: 'I submitted it last week but haven\'t heard back',
          timestamp: new Date(Date.now() - 3600000 - 240000).toISOString()
        },
        {
          id: 3,
          sender: 'user',
          content: 'Can you please check the status?',
          timestamp: new Date(Date.now() - 3600000 - 180000).toISOString()
        }
      ];
    } else if (conversationId === 2) {
      this.messages = [
        {
          id: 1,
          sender: 'user',
          content: 'Hi, I requested a towing service yesterday',
          timestamp: new Date(Date.now() - 7200000 - 300000).toISOString()
        },
        {
          id: 2,
          sender: 'admin',
          content: 'Hello, I can check that for you. May I have your request number?',
          timestamp: new Date(Date.now() - 7200000 - 240000).toISOString()
        },
        {
          id: 3,
          sender: 'user',
          content: 'It\'s request #5678',
          timestamp: new Date(Date.now() - 7200000 - 180000).toISOString()
        },
        {
          id: 4,
          sender: 'user',
          content: 'When will my towing request be processed?',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ];
    } else if (conversationId === 3) {
      this.messages = [
        {
          id: 1,
          sender: 'user',
          content: 'I need to update my insurance policy',
          timestamp: new Date(Date.now() - 86400000 - 3600000).toISOString()
        },
        {
          id: 2,
          sender: 'admin',
          content: 'I can help you with that. What changes would you like to make?',
          timestamp: new Date(Date.now() - 86400000 - 3000000).toISOString()
        },
        {
          id: 3,
          sender: 'user',
          content: 'I want to add another vehicle',
          timestamp: new Date(Date.now() - 86400000 - 2400000).toISOString()
        },
        {
          id: 4,
          sender: 'admin',
          content: 'I\'ve updated your policy to include the new vehicle. You\'ll receive the updated documents by email.',
          timestamp: new Date(Date.now() - 86400000 - 1800000).toISOString()
        },
        {
          id: 5,
          sender: 'user',
          content: 'Thanks for your help!',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ];
    }
  }
  
  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) {
      return;
    }
    
    // Add the new message to the conversation
    const newMsg = {
      id: this.messages.length + 1,
      sender: 'admin',
      content: this.newMessage,
      timestamp: new Date().toISOString()
    };
    
    this.messages.push(newMsg);
    
    // Update the conversation's last message
    this.selectedConversation.lastMessage = this.newMessage;
    this.selectedConversation.timestamp = new Date().toISOString();
    
    // Clear the input
    this.newMessage = '';
  }
} 