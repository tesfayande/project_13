import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { AgentDashboardComponent } from './components/agent-dashboard/agent-dashboard.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [

  /*{ path: '', component: LoginComponent },
  { path: 'customer', component: CustomerDashboardComponent },
  { path: 'agent', component: AgentDashboardComponent },
  { path: '**', redirectTo: '' }*/

  { path: '', component: HomeComponent },
  { path: 'customer', component: CustomerDashboardComponent },
  { path: 'agent', component: AgentDashboardComponent },
  { path: '**', redirectTo: '' }
];
