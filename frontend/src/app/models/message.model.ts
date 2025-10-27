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