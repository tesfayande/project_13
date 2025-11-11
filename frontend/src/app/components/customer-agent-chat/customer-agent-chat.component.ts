// src/app/components/customer-agent-chat/customer-agent-chat.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ChatMessage, MessageType } from '../../models/message.model';
import { AgentDashboardComponent } from '../agent-dashboard/agent-dashboard.component';
import { CustomerDashboardComponent } from '../customer-dashboard/customer-dashboard.component';

@Component({
  selector: 'app-customer-agent-chat',
  imports: [AgentDashboardComponent,CustomerDashboardComponent],
  standalone: true,
  templateUrl: './customer-agent-chat.component.html',
  styleUrls: ['./customer-agent-chat.component.css']
})
export class CustomerAgentChatComponent implements OnInit, OnDestroy {
  customers: User[] = [];
  agents: User[] = [];
  selectedCustomer: User | null = null;
  selectedAgent: User | null = null;
  currentChatMessages: ChatMessage[] = [];
  
  loadingCustomers: boolean = false;
  loadingAgents: boolean = false;
  loadingMessages: boolean = false;
  isConnected: boolean = false;
  
  private messageSubscription!: Subscription;
  private chatRooms: Map<string, ChatMessage[]> = new Map();

 

  ngOnInit(): void {
    this.loadCustomers();
    this.loadAgents();
    this.connectWebSocket();
  }

  connectWebSocket(): void {
   
  }

  loadCustomers(): void {
    
  }

  loadAgents(): void {
    
  }

  refreshCustomers(): void {
    this.loadCustomers();
  }

  refreshAgents(): void {
    this.loadAgents();
  }

  selectCustomer(customer: User): void {
    this.selectedCustomer = customer;
    this.loadChatHistory();
    this.joinChatRoom();
  }

  selectAgent(agent: User): void {
    this.selectedAgent = agent;
    this.loadChatHistory();
    this.joinChatRoom();
  }

  joinChatRoom(): void {
    
  }

  getChatRoomId(): string {
    if (this.selectedCustomer && this.selectedAgent) {
      return `chat_${this.selectedCustomer.id}_${this.selectedAgent.id}`;
    }
    return '';
  }

  loadChatHistory(): void {
    const chatRoomId = this.getChatRoomId();
    if (chatRoomId) {
      this.loadingMessages = true;
      
      // In a real app, you would fetch message history from backend
      // For now, we'll use local storage
      setTimeout(() => {
        if (this.chatRooms.has(chatRoomId)) {
          this.currentChatMessages = this.chatRooms.get(chatRoomId) || [];
        } else {
          this.currentChatMessages = [];
          this.chatRooms.set(chatRoomId, this.currentChatMessages);
          
          // Add welcome message
          const welcomeMessage: ChatMessage = {
            content: `Chat started between ${this.selectedCustomer?.name} (Customer) and ${this.selectedAgent?.name} (Agent)`,
            sender: 'System',
            receiver: '',
            type: MessageType.CHAT,
            timestamp: new Date(),
            chatRoomId: chatRoomId
          };
          this.currentChatMessages.push(welcomeMessage);
        }
        this.loadingMessages = false;
        this.scrollToBottom();
      }, 500);
    }
  }

  sendMessage(content: string): void {
    if (content.trim() && this.selectedCustomer && this.selectedAgent && this.isConnected) {
      const chatRoomId = this.getChatRoomId();
      
      const message: ChatMessage = {
        content: content.trim(),
        sender: this.selectedCustomer.name, // In real app, this would be dynamic based on who is sending
        receiver: this.selectedAgent.name,
        type: MessageType.CUSTOMER_TO_AGENT,
        timestamp: new Date(),
        chatRoomId: chatRoomId
      };

      // Add to current messages
      this.currentChatMessages.push(message);
      
      // Update chat room storage
      this.chatRooms.set(chatRoomId, this.currentChatMessages);

      // Send via WebSocket
      //this.webSocketService.sendMessage(message);

      // Clear input and scroll to bottom
      const input = document.querySelector('input') as HTMLInputElement;
      if (input) input.value = '';
      this.scrollToBottom();
    }
  }

  handleIncomingMessage(message: ChatMessage): void {
    if (message.chatRoomId === this.getChatRoomId()) {
      this.currentChatMessages.push(message);
      this.chatRooms.set(message.chatRoomId, this.currentChatMessages);
      this.scrollToBottom();
    }
  }

  clearChat(): void {
    const chatRoomId = this.getChatRoomId();
    if (chatRoomId) {
      this.currentChatMessages = [];
      this.chatRooms.set(chatRoomId, this.currentChatMessages);
      
      // Add cleared message
      const clearMessage: ChatMessage = {
        content: 'Chat history has been cleared',
        sender: 'System',
        receiver: '',
        type: MessageType.CHAT,
        timestamp: new Date(),
        chatRoomId: chatRoomId
      };
      this.currentChatMessages.push(clearMessage);
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    //this.webSocketService.disconnect();
  }
}