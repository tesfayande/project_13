import { Routes } from '@angular/router';


import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { AgentDashboardComponent } from './components/agent-dashboard/agent-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { CustomerAgentChatComponent } from './components/customer-agent-chat/customer-agent-chat.component';
export const routes: Routes = [

  /*
  { path: 'customer', component: CustomerDashboardComponent },
  { path: 'agent', component: AgentDashboardComponent },
  { path: '**', redirectTo: '' }*/

  { path: '', component: HomeComponent },
  { path: 'customer', component: CustomerDashboardComponent },
  { path: 'agent', component: AgentDashboardComponent },
  { path: 'customer-support', component: CustomerAgentChatComponent },
  { path: '**', redirectTo: '' }
];
