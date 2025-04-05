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
  filteredUsers: any[] = []; // Liste filtrée des utilisateurs
  errorMessage: string = '';
  isLoading: boolean = false;
  searchQuery: string = '';
  currentPage: number = 1; // Page actuelle
  pageSize: number = 5; // Nombre d'utilisateurs par page
  totalPages: number = 1; // Nombre total de pages
  isAdmin: boolean = false;
  isUser: boolean = false;
  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
    this.loadUsers();
  }

  // Charge la liste des utilisateurs
  async loadUsers() {
    try {
      const token: any = localStorage.getItem('token');
      const response = await this.userService.getAllUsers(token);
      if (response && response.statusCode === 200 && response.ourUsersList) {
        this.users = response.ourUsersList;
        this.filteredUsers = this.users; // Initialise la liste filtrée
        this.calculateTotalPages(); // Calcule le nombre total de pages
      } else {
        this.toastr.error('No users found.');
      }
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  // Calcule le nombre total de pages
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  // Retourne les utilisateurs paginés
  get paginatedUsers(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  // Passe à la page suivante
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Revient à la page précédente
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
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

  // Bloque un utilisateur
  async blockUser(userId: string) {
    this.toastr.warning('Are you sure you want to block this user?', 'Block User', {
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      closeButton: true,
      progressBar: true
    }).onTap.pipe().subscribe(() => {
      this.blockUserConfirmed(userId);
    });
  }

  async blockUserConfirmed(userId: string) {
    try {
      const token: any = localStorage.getItem('token');
      await this.userService.blockUser(userId, token);
      this.toastr.success('User blocked successfully', 'Success');
      this.loadUsers(); // Recharge la liste des utilisateurs
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  // Débloque un utilisateur
  async deblockUser(userId: string) {
    this.toastr.warning('Are you sure you want to unblock this user?', 'Unblock User', {
      timeOut: 5000,
      closeButton: true,
      progressBar: true
    }).onTap.pipe().subscribe(() => {
      this.deblockUserConfirmed(userId);
    });
  }

  async deblockUserConfirmed(userId: string) {
    try {
      const token: any = localStorage.getItem('token');
      await this.userService.deblockUser(userId, token);
      this.toastr.success('User unblocked successfully', 'Success');
      this.loadUsers(); // Recharge la liste des utilisateurs
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  // Redirige vers la page de mise à jour
  navigateToUpdate(userId: string) {
    this.router.navigate(['/update', userId]);
  }
}