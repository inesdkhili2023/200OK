import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = []; // Liste complète des utilisateurs
  admins: any[] = [];
  agents: any[] = [];
  filteredUsers: any[] = []; // Liste filtrée des utilisateurs
  errorMessage: string = '';
  isLoading: boolean = false;
  searchQuery: string = '';
  currentPage: number = 1; // Page actuelle
  pageSize: number = 5; // Nombre d'utilisateurs par page
  totalPages: number = 1; // Nombre total de pages
  isAdmin: boolean = false;
  isUser: boolean = false;
  isAgent: boolean = false;
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private toastr: ToastrService
   
  ) {}


  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
    this.isAgent = this.userService.isAgent();
    this.loadUsers();
  }
  
 
  // Charge la liste des utilisateurs
  async loadUsers() {
    try {
      const token: any = localStorage.getItem('token');
      const response = await this.userService.getAllUsers(token);
      if (response && response.statusCode === 200 && response.ourUsersList) {
        this.users = response.ourUsersList;
        this.filteredUsers = this.users;
  
        // Division par rôle
        this.admins = this.users.filter(user => user.role === 'ADMIN');
        this.filteredUsers = this.users.filter(user => user.role === 'USER'); // pour filtrage textuel
        this.agents = this.users.filter(user => user.role === 'AGENT');
  
        this.calculateTotalPages();
      } else {
        this.toastr.error('Aucun utilisateur trouvé.');
      }
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  // Calcule le nombre total de pages
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  adminsPage = 1;
  usersPage = 1;
  agentsPage = 1;
  
  get paginatedAdmins() {
    const start = (this.adminsPage - 1) * this.pageSize;
    return this.admins.slice(start, start + this.pageSize);
  }
  
  get paginatedUsers() {
    const start = (this.usersPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }
  
  get paginatedAgents() {
    const start = (this.agentsPage - 1) * this.pageSize;
    return this.agents.slice(start, start + this.pageSize);
  }

  get totalPagesAdmins(): number {
    return Math.ceil(this.admins.length / this.pageSize);
  }
  
  get totalPagesAgents(): number {
    return Math.ceil(this.agents.length / this.pageSize);
  }
  
  get totalPagesUsers(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize); // attention filtered ici
  }
  

  changePageAgents(direction: 'next' | 'prev') {
    const totalPages = Math.ceil(this.agents.length / this.pageSize);
  
    if (direction === 'next' && this.agentsPage < totalPages) {
      this.agentsPage++;
    }
    if (direction === 'prev' && this.agentsPage > 1) {
      this.agentsPage--;
    }
  }
  changePageAdmins(direction: 'next' | 'prev') {
    const totalPages = Math.ceil(this.admins.length / this.pageSize);
  
    if (direction === 'next' && this.adminsPage < totalPages) {
      this.adminsPage++;
    }
    if (direction === 'prev' && this.adminsPage > 1) {
      this.adminsPage--;
    }
  } 
  changePageUsers(direction: 'next' | 'prev') {
    const totalPages = Math.ceil(this.users.length / this.pageSize);
  
    if (direction === 'next' && this.usersPage < totalPages) {
      this.usersPage++;
    }
    if (direction === 'prev' && this.usersPage > 1) {
      this.usersPage--;
    }
  }  

  // Filtre les utilisateurs en fonction de la recherche
  filterUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.lastname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.calculateTotalPages(); // Recalcule le nombre total de pages après le filtrage
    this.currentPage = 1; // Réinitialise la page actuelle à 1
  }

  // Supprime un utilisateur
  async deleteUser(userId: string) {
    this.toastr.warning('Are you sure you want to delete this user?', 'Delete User', {
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      tapToDismiss: false,
      extendedTimeOut: 1000
    }).onTap.pipe().subscribe(() => {
      this.deleteUserConfirmed(userId);
    });
  }

  async deleteUserConfirmed(userId: string) {
    try {
      const token: any = localStorage.getItem('token');
      await this.userService.deleteUser(userId, token);
      this.toastr.success('User deleted successfully', 'Success');
      this.loadUsers(); // Recharge la liste des utilisateurs
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

 
  async toggleUserStatus(user: any) {
    const token: any = localStorage.getItem('token');
    try {
      if (user.enabled) {
        await this.userService.blockUser(user.id, token);
        this.toastr.error('Utilisateur bloqué avec succès');
      } else {
        await this.userService.deblockUser(user.id, token);
        this.toastr.success('Utilisateur débloqué avec succès');
      }
      this.loadUsers(); // recharge les données
    } catch (error: any) {
      this.toastr.error(error.message || 'Une erreur est survenue');
    }
  }
  
  
 

  // Redirige vers la page de mise à jour
  navigateToUpdate(userId: string) {
    this.router.navigate(['/update', userId]);
  }
}