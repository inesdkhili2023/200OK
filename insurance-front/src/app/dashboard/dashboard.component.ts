import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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

  constructor(private readonly userService: UsersService, private router: Router) {
    Chart.register(...registerables);
  }

  async ngOnInit(): Promise<void> {
    this.initializeRevenueChart();
    this.isAuthenticated = this.userService.isAuthenticated();
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
    this.isAgent = this.userService.isAgent();

    // Récupérer les informations de l'utilisateur connecté
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No Token Found");
      }

      // Attendre la résolution de la promesse
      this.Info = await this.userService.getYourProfile(token);
      console.log(this.Info);

      // Mettre à jour les propriétés userName et userImage
      if (this.Info && this.Info.ourUsers) {
        this.userName = this.Info.ourUsers.name;
        this.userImage = this.Info.ourUsers.image || 'assets/images/avatar-placeholder.png';
      }
    } catch (error: any) {
      this.showError(error.message);
    }
  }

  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
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

  addUser(): void {
    console.log('Add user clicked');
  }

  createNewPolicy(): void {
    console.log('Create new policy clicked');
  }

  generateReport(): void {
    console.log('Generate report clicked');
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}