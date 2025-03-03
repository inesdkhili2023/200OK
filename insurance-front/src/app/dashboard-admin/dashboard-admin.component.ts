import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
<<<<<<< HEAD
=======
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  chart: any;
<<<<<<< HEAD

  constructor() {
=======
  showUserList: boolean = false;
  showSettingsList: boolean = false;

  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;
  isAgent: boolean = false;

  constructor(private readonly userService: UsersService, private router: Router) {
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initializeRevenueChart();
<<<<<<< HEAD
    // You can add more initialization logic here
=======
    this.isAuthenticated = this.userService.isAuthenticated();
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
    this.isAgent = this.userService.isAgent();
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1
  }

  private initializeRevenueChart(): void {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          fill: false,
          borderColor: '#f38F1D',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

<<<<<<< HEAD
  // Methods for handling quick actions
  addUser(): void {
    console.log('Add user clicked');
    // Implement user addition logic
=======
  toggleUserList(): void {
    this.showUserList = !this.showUserList;
  }

  toggleSettingsList(): void {
    this.showSettingsList = !this.showSettingsList;
  }

  logout(): void {
    this.userService.logOut();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
    this.isAgent = false;
    this.router.navigate(['/login']);
  }

  addUser(): void {
    console.log('Add user clicked');
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1
  }

  createNewPolicy(): void {
    console.log('Create new policy clicked');
<<<<<<< HEAD
    // Implement policy creation logic
=======
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1
  }

  generateReport(): void {
    console.log('Generate report clicked');
<<<<<<< HEAD
    // Implement report generation logic
  }

  // Method for handling search
  handleSearch(searchTerm: string): void {
    console.log('Searching for:', searchTerm);
    // Implement search logic
  }

  // Method for handling notifications
  viewNotifications(): void {
    console.log('Viewing notifications');
    // Implement notifications view logic
  }

  // Method for handling profile actions
  handleProfileAction(): void {
    console.log('Profile action clicked');
    // Implement profile actions logic
  }

  // Method for handling sidebar navigation
  navigate(route: string): void {
    console.log('Navigating to:', route);
    // Implement navigation logic
  }
}
=======
  }

  handleSearch(searchTerm: string): void {
    console.log('Searching for:', searchTerm);
  }

  viewNotifications(): void {
    console.log('Viewing notifications');
  }

  handleProfileAction(): void {
    console.log('Profile action clicked');
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
>>>>>>> c9305956a030b291610f62d4a496788fd831d8e1
