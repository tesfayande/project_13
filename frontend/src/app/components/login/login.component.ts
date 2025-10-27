// src/app/components/login/login.component.ts (Alternative with getAllUsers)
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Chat App Login</h2>
      
      @if (isLoading) {
        <div class="loading">Loading users...</div>
      }

      @if (error) {
        <div class="error">{{ error }}</div>
      }

      <div class="user-selection">
        <h3>Select User Type</h3>
        <button (click)="loginAsCustomer()" class="btn btn-primary" [disabled]="isLoading">
          Login as Customer
        </button>
        <button (click)="loginAsAgent()" class="btn btn-secondary" [disabled]="isLoading">
          Login as Agent
        </button>

        <!-- Refresh Button -->
        <button (click)="loadUsers()" class="btn btn-info" [disabled]="isLoading">
          Refresh Users
        </button>
      </div>
      
      @if (users.length > 0 && !isLoading) {
        <div class="user-list">
          <h3>Available Users ({{ users.length }})</h3>
          
          <!-- Customers Section -->
          @if (customers.length > 0) {
            <div class="user-section">
              <h4>Customers ({{ customers.length }})</h4>
              @for (user of customers; track user.id) {
                <div class="user-card customer-card">
                  <p><strong>{{ user.name }}</strong></p>
                  <p>Email: {{ user.email }}</p>
                  <button (click)="selectUser(user)" class="btn btn-success">
                    Login as Customer
                  </button>
                </div>
              }
            </div>
          }

          <!-- Agents Section -->
          @if (agents.length > 0) {
            <div class="user-section">
              <h4>Agents ({{ agents.length }})</h4>
              @for (user of agents; track user.id) {
                <div class="user-card agent-card">
                  <p><strong>{{ user.name }}</strong></p>
                  <p>Email: {{ user.email }}</p>
                  <button (click)="selectUser(user)" class="btn btn-success">
                    Login as Agent
                  </button>
                </div>
              }
            </div>
          }
        </div>
      } @else if (!isLoading && !error) {
        <div class="no-users">
          <p>No users available.</p>
          <p>Please make sure:</p>
          <ul>
            <li>Backend is running on http://localhost:8080</li>
            <li>Database has sample users</li>
            <li>Check browser console for errors</li>
          </ul>
          <button (click)="loadUsers()" class="btn btn-primary">Retry</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .login-container { max-width: 600px; margin: 50px auto; padding: 20px; }
    .user-selection { margin-bottom: 30px; text-align: center; }
    .btn { margin: 5px; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-info { background: #17a2b8; color: white; }
    .user-section { margin-bottom: 20px; }
    .user-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .customer-card { border-left: 4px solid #28a745; }
    .agent-card { border-left: 4px solid #007bff; }
    .loading { text-align: center; padding: 20px; color: #666; }
    .error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; margin: 10px 0; }
    .no-users { text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 5px; }
    .no-users ul { text-align: left; display: inline-block; }
  `]
})
export class LoginComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  users: User[] = [];
  isLoading = false;
  error = '';

  // Computed properties
  get customers(): User[] {
    return this.users.filter(user => user.type === 'CUSTOMER');
  }

  get agents(): User[] {
    return this.users.filter(user => user.type === 'AGENT');
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = '';

    // First, try to get all users from the new endpoint
    this.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
        console.log('Loaded users:', users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        
        // If getAllUsers fails, try the fallback method
        this.loadUsersFallback();
      }
    });
  }

  private loadUsersFallback(): void {
    // Fallback: Try to load individual users
    const userPromises = [1, 2, 3, 4].map(id => 
      this.apiService.getUser(id).toPromise()
    );

    Promise.all(userPromises)
      .then(users => {
        this.users = users.filter(user => user !== undefined) as User[];
        this.isLoading = false;
        
        if (this.users.length === 0) {
          this.error = 'No users found. Please make sure the backend is running and has sample data.';
        }
      })
      .catch(error => {
        console.error('Error in fallback user loading:', error);
        this.error = 'Failed to load users. Please check: 1) Backend is running on http://localhost:8080, 2) Database has users, 3) CORS is configured';
        this.isLoading = false;
      });
  }

  loginAsCustomer(): void {
    if (this.customers.length > 0) {
      this.selectUser(this.customers[0]);
    } else {
      this.error = 'No customers available.';
    }
  }

  loginAsAgent(): void {
    if (this.agents.length > 0) {
      this.selectUser(this.agents[0]);
    } else {
      this.error = 'No agents available.';
    }
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