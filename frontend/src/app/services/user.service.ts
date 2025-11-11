
// src/app/services/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,catchError,map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, Agent } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
  //private apiUrl = 'http://localhost:8080/api';

  //constructor(private http: HttpClient) { }

  getCustomers(): Observable<User[]> {


  return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
    map(users => {
      // Double-check that we only have agents (not customers)
      return users.filter(user => 
        user && user.type === 'CUSTOMER'
      );
    }),
    catchError(error => {
      console.error('Error getting agents:', error);
      return of([]);
    })
  );


  }

  getAgents(): Observable<Agent[]> {
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

  getCustomerById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  getAgentById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }
}