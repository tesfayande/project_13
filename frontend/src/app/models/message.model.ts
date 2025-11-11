// src/app/models/message.model.ts
import { User } from './user.model';

export interface Message {
  id: number;
  conversationId: number;
  sender: User;
  receiver: User;
  content: string;
  createdAt: string;
}

export interface SendMessageRequest {
  conversationId: number;
  senderId: number;
  receiverId: number;
  content: string;
}

export interface ChatMessage {
  content: string;
  sender: string;
  receiver: string;
  type: MessageType;
  timestamp: Date;
  chatRoomId: string;
}

export enum MessageType {
  CHAT = 'CHAT',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
  CUSTOMER_TO_AGENT = 'CUSTOMER_TO_AGENT',
  AGENT_TO_CUSTOMER = 'AGENT_TO_CUSTOMER'
}

