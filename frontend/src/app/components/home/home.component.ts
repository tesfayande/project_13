// src/app/components/home/home.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <header class="home-header">
        <h1>💬 Your Car Your Way  Chat</h1>
        <p>Connect with users and start conversations</p>
      </header>

      <div class="users-section">
        <h2>All Users</h2>
        
        @if (isLoading) {
          <div class="loading">Loading users...</div>
        }

        @if (error) {
          <div class="error">{{ error }}</div>
        }

        <div class="users-grid">
          @for (user of users; track user.id) {
            <div class="user-card" (click)="selectUser(user)">
              <div class="user-avatar">
                {{ user.name.charAt(0) }}
              </div>
              <div class="user-info">
                <h3>{{ user.name }}</h3>
                <p class="user-email">{{ user.email }}</p>
                <span class="user-badge" [class.customer]="user.type === 'CUSTOMER'" 
                      [class.agent]="user.type === 'AGENT'">
                  {{ user.type }}
                </span>
              </div>
              <div class="user-action">
                <button class="btn btn-chat">Start Chat →</button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container { max-width: 1000px; margin: 0 auto; padding: 20px; }
    .home-header { text-align: center; margin-bottom: 40px; padding: 40px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; }
    .home-header h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .home-header p { font-size: 1.2rem; opacity: 0.9; }
    
    .users-section h2 { margin-bottom: 20px; color: #333; }
    
    .users-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    
    .user-card { 
      display: flex; align-items: center; padding: 20px; background: white; 
      border: 1px solid #e0e0e0; border-radius: 10px; cursor: pointer; 
      transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .user-card:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.15); border-color: #667eea; }
    
    .user-avatar { 
      width: 50px; height: 50px; border-radius: 50%; background: #667eea; 
      color: white; display: flex; align-items: center; justify-content: center; 
      font-weight: bold; font-size: 1.2rem; margin-right: 15px; 
    }
    
    .user-info { flex: 1; }
    .user-info h3 { margin: 0 0 5px 0; color: #333; }
    .user-email { margin: 0; color: #666; font-size: 0.9rem; }
    
    .user-badge { 
      display: inline-block; padding: 3px 8px; border-radius: 12px; 
      font-size: 0.7rem; font-weight: bold; text-transform: uppercase; 
      margin-top: 5px; 
    }
    .user-badge.customer { background: #e8f5e8; color: #2e7d32; }
    .user-badge.agent { background: #e3f2fd; color: #1565c0; }
    
    .user-action { margin-left: 15px; }
    .btn-chat { 
      padding: 8px 15px; background: #667eea; color: white; 
      border: none; border-radius: 5px; cursor: pointer; font-weight: 500;
    }
    
    .loading { text-align: center; padding: 40px; color: #666; }
    .error { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; text-align: center; }
  `]
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  users: User[] = [];
  isLoading = false;
  error = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users. Please check your connection.';
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  selectUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user.type === 'CUSTOMER') {
      this.router.navigate(['/customer']);
    } else {
      this.router.navigate(['/agent']);
    }
  }
}