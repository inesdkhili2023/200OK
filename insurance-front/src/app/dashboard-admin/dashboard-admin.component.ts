import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  chart: any;
  showSettingsList: boolean = false;
  isMenuOpen = false;
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;
  isAgent: boolean = false;
  Info: any;
  userName: string = ''; // Nom de l'utilisateur
  userImage: string = 'assets/images/avatar-placeholder.png'; // Image de l'utilisateur
  errorMessage: string = '';


  constructor(private readonly userService: UsersService,private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initializeRevenueChart();
    // You can add more initialization logic here
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  updateProfile(id: string){
    this.router.navigate(['/update', id])
}
logout(): void {
  this.userService.logOut();
  this.isAuthenticated = false;
  this.isAdmin = false;
  this.isUser = false;
  this.isAgent = false;
  this.router.navigate(['/login']);
}

  // Methods for handling quick actions
  addUser(): void {
    console.log('Add user clicked');
    // Implement user addition logic
  }

  createNewPolicy(): void {
    console.log('Create new policy clicked');
    // Implement policy creation logic
  }

  generateReport(): void {
    console.log('Generate report clicked');
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