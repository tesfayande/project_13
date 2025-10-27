// src/app/models/conversation.model.ts
import { User, Customer, Agent } from './user.model';

export interface Conversation {
  id: number;
  agent?: Agent;
  customer: Customer;
  createdAt: string;
}

export interface CreateConversationRequest {
  customerId: number;
  agentId?: number;
  initialMessage?: string;
}