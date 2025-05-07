import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalAgents: 0,
    totalClaims: 0,
    totalSinisters: 0,
    totalTowingRequests: 0,
    pendingSinisters: 0,
    pendingTowingRequests: 0
  };
  
  recentActivity: any[] = [];
  
  constructor() { }

  ngOnInit() {
    // Simulate fetching data
    setTimeout(() => {
      this.loadMockData();
    }, 1000);
  }

  loadMockData() {
    // Mock statistics
    this.stats = {
      totalUsers: 125,
      totalAgents: 15,
      totalClaims: 78,
      totalSinisters: 42,
      totalTowingRequests: 56,
      pendingSinisters: 8,
      pendingTowingRequests: 12
    };
    
    // Mock recent activity
    this.recentActivity = [
      { 
        type: 'sinister', 
        action: 'created', 
        user: 'John Doe', 
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        description: 'Reported a car accident'
      },
      { 
        type: 'towing', 
        action: 'requested', 
        user: 'Jane Smith', 
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        description: 'Requested emergency towing'
      },
      { 
        type: 'sinister', 
        action: 'approved', 
        user: 'Admin User', 
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        description: 'Approved claim #1234'
      },
      { 
        type: 'user', 
        action: 'registered', 
        user: 'New User', 
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        description: 'Created a new account'
      },
      { 
        type: 'agent', 
        action: 'assigned', 
        user: 'Agent Mike', 
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        description: 'Assigned to towing request #5678'
      }
    ];
  }
} 