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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
  
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