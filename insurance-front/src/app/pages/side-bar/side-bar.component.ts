import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
chart: any;

  constructor() {
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


