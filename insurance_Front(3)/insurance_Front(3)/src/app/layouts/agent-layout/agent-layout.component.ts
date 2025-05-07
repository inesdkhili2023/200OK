import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-agent-layout',
  templateUrl: './agent-layout.component.html',
  styleUrls: ['./agent-layout.component.css']
})
export class AgentLayoutComponent {
showSettingsList: boolean = false;
  isMenuOpen = false;
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;
  isAgent: boolean = false;
  Info: any;
  role: string = '';
  userName: string = ''; // Nom de l'utilisateur
  userImage: string = 'assets/images/avatar-placeholder.png'; 
  errorMessage: string = '';
  
  constructor(
    private readonly userService: UsersService, 
    private router: Router,
  private readonly toastr: ToastrService) {
  }
 
  async ngOnInit(): Promise<void> {

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
  
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs :', error);
      this.showError('Erreur lors du chargement des utilisateurs');
    }
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  updateProfile(id: string){
    this.router.navigate(['agent/update', id])
}

  logout(): void {
    this.userService.logOut();
    this.isAuthenticated= false;
    this.isAdmin = false;
    this.isUser = false;
    this.isAgent = false;
    this.toastr.success('Déconnexion réussie');
    this.router.navigate(['/login']);
  }

  addUser(): void {
    this.loadUserStatistics();
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
