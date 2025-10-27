// src/app/models/user.model.ts
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  type: 'CUSTOMER' | 'AGENT';
  birthdate: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  type: 'CUSTOMER';
  birthdate: string;
  user: User;
}

export interface Agent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  type: 'AGENT';
  birthdate: string;
  user: User;
}