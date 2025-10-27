// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,catchError,map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, Agent } from '../models/user.model';
import { Conversation, CreateConversationRequest } from '../models/conversation.model';
import { Message, SendMessageRequest } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;



  // User endpoints


  // Add this method to ApiService
getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/users`);
}


  registerUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/register`, userData);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  // Conversation endpoints
  createConversation(request: CreateConversationRequest): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.apiUrl}/conversations/create`, request);
  }

  createConversationWithAgent(customerId: number, agentId: number): Observable<Conversation> {
    return this.http.post<Conversation>(
      `${this.apiUrl}/conversations/create-with-agent?customerId=${customerId}&agentId=${agentId}`, 
      {}
    );
  }

  joinConversation(agentId: number, conversationId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.apiUrl}/conversations/join`, {
      agentId,
      conversationId
    });
  }

  getCustomerConversations(customerUserId: number): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations/customer/${customerUserId}`);
  }

  getAgentConversations(agentUserId: number): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations/agent/${agentUserId}`);
  }

  getAvailableConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations/available`);
  }

  /*
  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/conversations/agents`);
  }*/

    // src/app/services/api.service.ts - Update getAllAgents method
getAllAgents(): Observable<Agent[]> {
  return this.http.get<Agent[]>(`${this.apiUrl}/conversations/agents`).pipe(
    map(agents => {
      // Double-check that we only have agents (not customers)
      return agents.filter(agent => 
        agent.user && agent.user.type === 'AGENT'
      );
    }),
    catchError(error => {
      console.error('Error getting agents:', error);
      return of([]);
    })
  );
}

  // Message endpoints
  getConversationMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages/conversation/${conversationId}`);
  }

  sendMessageRest(request: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages/send`, request);
  }
}