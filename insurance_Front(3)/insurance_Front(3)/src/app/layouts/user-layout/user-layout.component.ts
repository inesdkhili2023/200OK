import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent {
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
  activeRoute: string = '';
  
  constructor(private readonly userService: UsersService, 
    private router: Router,
    private readonly toastr: ToastrService) {
  }
 
  async ngOnInit(): Promise<void> {
    // Track router events to update active route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.url;
    });

    await this.loadUserStatistics();
    this.userService.isAuthenticated$.subscribe((value: boolean) => {
      this.isAuthenticated = value;
    });
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
    this.router.navigate(['/user/update', id])
}

  logout(): void {
    this.userService.logOut();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
    this.isAgent = false;
    this.toastr.success('Déconnexion réussie');
    this.router.navigate(['/login']);
  }

  // Check if a route is active
  isActive(route: string): boolean {
    return this.activeRoute.includes(route);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
