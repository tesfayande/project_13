import { Routes } from '@angular/router';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { AgentDashboardComponent } from './components/agent-dashboard/agent-dashboard.component';
import { HomeComponent } from './components/home/home.component';
export const routes: Routes = [

 

  { path: '', component: HomeComponent },
  { path: 'customer', component: CustomerDashboardComponent },
  { path: 'agent', component: AgentDashboardComponent },

  { path: '**', redirectTo: '' }
];
