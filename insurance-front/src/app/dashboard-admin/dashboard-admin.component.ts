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
  showSettingsList: boolean = false;
  isMenuOpen = false;
  totalUsers: number = 0;


  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;
  isAgent: boolean = false;
  Info: any;
  role: string = '';
  userName: string = ''; // Nom de l'utilisateur
  userImage: string = 'assets/images/avatar-placeholder.png'; 
  errorMessage: string = '';
  
  constructor(private readonly userService: UsersService, private router: Router) {
    Chart.register(...registerables);
  }
 
  async ngOnInit(): Promise<void> {
    this.initializeRevenueChart();
    await this.loadUserStatistics();
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
        this.role = this.Info.ourUsers.role;
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
  async loadUserStatistics() {
    try {
      const token = localStorage.getItem('token');
      const response = await this.userService.getAllUsers(token!);
      console.log("Utilisateurs récupérés :", response);
      const allUsers = response.ourUsersList;
      console.log("Liste des utilisateurs :", allUsers);

      this.totalUsers = allUsers.length;
      console.log("Total utilisateurs :", this.totalUsers);
      this.updateUsersPerAgeChart(allUsers);

    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs :', error);
      this.showError('Erreur lors du chargement des utilisateurs');
    }
  }
  
  
  updateUsersPerAgeChart(users: any[]) {
    const countsByAge: { [age: number]: number } = {};
  
    const currentYear = new Date().getFullYear();
  
    users.forEach(user => {
      const birth = user.dnaiss ? new Date(user.dnaiss) : null;
      if (birth && !isNaN(birth.getTime())) {
        const age = currentYear - birth.getFullYear();
        if (age >= 18) {
          countsByAge[age] = (countsByAge[age] || 0) + 1;
        }
      }
    });
  
    // Trier les âges par ordre croissant
    const sortedAges = Object.keys(countsByAge)
      .map(age => parseInt(age))
      .sort((a, b) => a - b);
  
    const data = sortedAges.map(age => countsByAge[age]);
  
    console.log('Âges =', sortedAges);
    console.log('Data =', data);
  
    setTimeout(() => {
      const canvas = document.getElementById('usersPerYearChart') as HTMLCanvasElement;
      if (canvas) {
        new Chart(canvas, {
          type: 'bar',
          data: {
            labels: sortedAges.map(a => a.toString()),
            datasets: [{
              label: 'Utilisateurs par âge',
              data: data,
              borderWidth: 1,
              backgroundColor: '#4e73df'
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Âge'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Nombre d\'utilisateurs'
                },
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top'
              }
            }
          }
        });
      } else {
        console.error('Canvas non trouvé !');
      }
    }, 300);
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

  
  
}