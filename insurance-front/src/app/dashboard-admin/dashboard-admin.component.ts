import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  chart: any;
  showUserList: boolean = false;
  showSettingsList: boolean = false;

  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;
  isAgent: boolean = false;

  constructor(private readonly userService: UsersService, private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initializeRevenueChart();
    this.isAuthenticated = this.userService.isAuthenticated();
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
    this.isAgent = this.userService.isAgent();
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
  }

  createNewPolicy(): void {
    console.log('Create new policy clicked');
  }

  generateReport(): void {
    console.log('Generate report clicked');
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
