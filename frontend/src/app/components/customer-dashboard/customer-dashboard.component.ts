// src/app/components/customer-dashboard/customer-dashboard.component.ts (Fixed)
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { WebsocketService } from '../../services/websocket.service';
import { User, Agent } from '../../models/user.model';
import { Conversation } from '../../models/conversation.model';
import { Message, SendMessageRequest } from '../../models/message.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],

})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private websocketService = inject(WebsocketService);
  private router = inject(Router);
  
  currentUser: User | null = null;
  agents: Agent[] = [];
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage = '';
  showNewConversation = false;
  
  private messageSubscription: Subscription | null = null;

  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      this.loadData();
      this.connectWebSocket();
      //console.log("Loaded data:", this.loadData());
    } else {
      this.router.navigate(['/']);
    }
    
    
  }

  /*
  loadData(): void {
    if (!this.currentUser) return;

    this.apiService.getAllAgents().subscribe(agents => {
      this.agents = agents;
    });

    this.apiService.getCustomerConversations(this.currentUser.id).subscribe(conversations => {
      this.conversations = conversations;
    });
  }*/
 // src/app/components/customer-dashboard/customer-dashboard.component.ts - Update loadData method
loadData(): void {
  if (!this.currentUser) return;

  this.apiService.getAllAgents().subscribe({
    next: (agents) => {
      console.log('Loaded agents:', agents);
      // Filter to ensure we only show actual agents
      this.agents = agents.filter(agent => 
        agent.user && agent.user.type === 'AGENT'
      );
      console.log('Filtered agents:', this.agents);
    },
    error: (error) => {
      console.error('Error loading agents:', error);
      this.agents = [];
    }
  });

  this.apiService.getCustomerConversations(this.currentUser.id).subscribe(conversations => {
    this.conversations = conversations;
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

  // Helper method to get initials for avatars
  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  toggleNewConversation(): void {
    this.showNewConversation = !this.showNewConversation;
  }

  /*
  startConversationWithAgent(agent: Agent): void {
    if (!this.currentUser) return;

    this.apiService.createConversationWithAgent(this.currentUser.id, agent.id).subscribe({
      next: (conversation) => {
        this.conversations.push(conversation);
        this.selectedConversation = conversation;
        this.showNewConversation = false; // Hide the agents list after selection
        this.loadConversationMessages(conversation.id);
        this.websocketService.subscribeToConversation(conversation.id);
      },
      error: (error) => {
        console.error('Error creating conversation:', error);
        alert('Error creating conversation: ' + error.error?.error || error.message);
      }
    });
  }*/
 // In CustomerDashboardComponent - Add validation before creating conversation
startConversationWithAgent(agent: Agent): void {
  if (!this.currentUser) return;

  // Validate that the selected user is actually an agent
  if (!agent.user || agent.user.type !== 'AGENT') {
    console.error('Selected user is not an agent:', agent);
    alert('Error: Selected user is not a valid agent. Please select a different agent.');
    return;
  }

  this.apiService.createConversationWithAgent(this.currentUser.id, agent.user.id).subscribe({
    next: (conversation) => {
      this.conversations.push(conversation);
      this.selectedConversation = conversation;
      this.showNewConversation = false;
      this.loadConversationMessages(conversation.id);
      this.websocketService.subscribeToConversation(conversation.id);
    },
    error: (error) => {
      console.error('Error creating conversation:', error);
      alert('Error creating conversation: ' + error.error?.error || error.message);
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

    const messageRequest: SendMessageRequest = {
      conversationId: this.selectedConversation.id,
      senderId: this.currentUser.id,
      receiverId: this.selectedConversation.agent?.id || 0,
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



  // Add these methods to CustomerDashboardComponent

// Safe methods to handle potentially undefined data
getAgentName(conversation: Conversation): string {
  if (!conversation?.agent?.name) {
    return 'Waiting for agent...';
  }
  return conversation.agent.name;
}

getAgentInitial(conversation: Conversation): string {
  const name = this.getAgentName(conversation);
  return name.charAt(0).toUpperCase();
}

getAgentId(conversation: Conversation): number {
  if (!conversation?.agent?.id) {
    return 0;
  }
  return conversation.agent.id;
}


  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.websocketService.disconnect();
  }
}