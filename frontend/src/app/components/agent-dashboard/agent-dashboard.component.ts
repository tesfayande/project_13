// src/app/components/agent-dashboard/agent-dashboard.component.ts (Fixed)
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { WebsocketService } from '../../services/websocket.service';
import { User } from '../../models/user.model';
import { Conversation } from '../../models/conversation.model';
import { Message, SendMessageRequest } from '../../models/message.model';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css'],
})
export class AgentDashboardComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private websocketService = inject(WebsocketService);
  private router = inject(Router);
  
  currentUser: User | null = null;
  availableConversations: Conversation[] = [];
  myConversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage = '';
  
  private messageSubscription: Subscription | null = null;

  ngOnInit(): void {
    const userStr = localStorage.getItem('selectedAgent');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      this.loadData();
      this.connectWebSocket();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadData(): void {
    if (!this.currentUser) return;

    this.apiService.getAvailableConversations().subscribe(conversations => {
      this.availableConversations = conversations;
      console.log('Available conversations:', conversations);
    });

    this.apiService.getAgentConversations(this.currentUser.id).subscribe(conversations => {
      this.myConversations = conversations;
      console.log('My conversations:', conversations);
    });
  }

  connectWebSocket(): void {
    this.websocketService.connect();
    
    this.websocketService.isConnected$().subscribe(connected => {
      if (connected && this.currentUser) {
        this.websocketService.subscribeToUserMessages(this.currentUser.id);
        
        this.messageSubscription = this.websocketService.getMessages().subscribe(message => {
          if (message && this.selectedConversation && message.conversationId === this.selectedConversation.id) {
            this.messages.push(message);
            this.scrollToBottom();
          }
        });
      }
    });
  }

  // Safe methods to handle potentially undefined data
  getCustomerName(conversation: Conversation): string {
    if (!conversation?.customer?.name) {
      return 'Unknown Customer';
    }
    return conversation.customer.name;
  }

  getCustomerInitial(conversation: Conversation): string {
    const name = this.getCustomerName(conversation);
    return name.charAt(0).toUpperCase();
  }

  getCustomerId(conversation: Conversation): number {
    if (!conversation?.customer?.id) {
      console.warn('Customer ID not found for conversation:', conversation);
      return 0;
    }
    return conversation.customer.id;
  }

  joinConversation(conversation: Conversation): void {
    if (!this.currentUser) return;

    this.apiService.joinConversation(this.currentUser.id, conversation.id).subscribe({
      next: (updatedConversation) => {
        this.availableConversations = this.availableConversations.filter(c => c.id !== conversation.id);
        this.myConversations.push(updatedConversation);
        this.selectedConversation = updatedConversation;
        this.loadConversationMessages(updatedConversation.id);
        this.websocketService.subscribeToConversation(updatedConversation.id);
      },
      error: (error) => {
        console.error('Error joining conversation:', error);
        alert('Error joining conversation: ' + error.error?.error || error.message);
      }
    });
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.loadConversationMessages(conversation.id);
    this.websocketService.subscribeToConversation(conversation.id);
  }

  loadConversationMessages(conversationId: number): void {
    this.apiService.getConversationMessages(conversationId).subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation || !this.currentUser) return;

    const customerId = this.getCustomerId(this.selectedConversation);
    if (customerId === 0) {
      console.error('Cannot send message: Customer ID not found');
      return;
    }

    const messageRequest: SendMessageRequest = {
      conversationId: this.selectedConversation.id,
      senderId: this.currentUser.id,
      receiverId: customerId,
      content: this.newMessage.trim()
    };

    this.websocketService.sendMessage(messageRequest);
    this.newMessage = '';
  }

  leaveChat(): void {
    localStorage.removeItem('currentUser');
    this.websocketService.disconnect();
    this.router.navigate(['/']);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messageContainer = document.querySelector('.chat-messages');
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.websocketService.disconnect();
  }
}