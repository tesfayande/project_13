// src/app/services/websocket.service.ts (Observable-only version)
import { Injectable, inject } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client | null = null;
  private messageSubject = new BehaviorSubject<Message | null>(null);
  private connectedSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeStompClient();
  }

  private initializeStompClient(): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.websocketUrl),
      debug: (str) => {
        if (str.includes('ERROR') || !environment.production) {
          console.log('STOMP:', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('WebSocket Connected: ', frame);
      this.connectedSubject.next(true);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP Error: ', frame.headers['message']);
      console.error('Additional details: ', frame.body);
      this.connectedSubject.next(false);
    };

    this.stompClient.onWebSocketError = (event) => {
      console.error('WebSocket error: ', event);
      this.connectedSubject.next(false);
    };

    this.stompClient.onDisconnect = (frame) => {
      console.log('WebSocket Disconnected: ', frame);
      this.connectedSubject.next(false);
    };
  }

  connect(): void {
    if (this.stompClient) {
      const currentStatus = this.connectedSubject.value;
      if (!currentStatus) {
        this.stompClient.activate();
      }
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
    this.connectedSubject.next(false);
  }

  isConnected$(): Observable<boolean> {
    return this.connectedSubject.asObservable();
  }

  // Helper method to check connection status synchronously
  isConnectedSync(): boolean {
    return this.connectedSubject.value;
  }

  subscribeToConversation(conversationId: number): void {
    this.isConnected$().subscribe(connected => {
      if (connected && this.stompClient) {
        this.stompClient.subscribe(
          `/topic/conversation.${conversationId}`,
          (message) => {
            try {
              const newMessage: Message = JSON.parse(message.body);
              this.messageSubject.next(newMessage);
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          }
        );
      }
    });
  }

  subscribeToUserMessages(userId: number): void {
    this.isConnected$().subscribe(connected => {
      if (connected && this.stompClient) {
        this.stompClient.subscribe(
          `/user/${userId}/queue/messages`,
          (message) => {
            try {
              const newMessage: Message = JSON.parse(message.body);
              this.messageSubject.next(newMessage);
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          }
        );
      }
    });
  }

  sendMessage(messageRequest: any): void {
    this.isConnected$().subscribe(connected => {
      if (connected && this.stompClient) {
        this.stompClient.publish({
          destination: '/app/chat.send',
          body: JSON.stringify(messageRequest)
        });
      } else {
        console.error('WebSocket not connected. Message not sent:', messageRequest);
      }
    });
  }

  getMessages(): Observable<Message | null> {
    return this.messageSubject.asObservable();
  }
}